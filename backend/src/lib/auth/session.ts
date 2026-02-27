import * as jose from "jose";
import type { AuthUser } from "./types.ts";

let secret: Uint8Array | undefined;

function getSecret(): Uint8Array {
	if (secret) return secret;
	const raw = Deno.env.get("OIDC_AUTH_SECRET");
	if (!raw || raw.length < 32) {
		throw new Error(
			"OIDC_AUTH_SECRET must be set and at least 32 characters long",
		);
	}
	secret = new TextEncoder().encode(raw);
	return secret;
}

export function createSessionToken(user: AuthUser): Promise<string> {
	return new jose.SignJWT({
		sub: user.sub,
		username: user.username,
		email: user.email,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("24h")
		.sign(getSecret());
}

export async function verifySessionToken(
	token: string,
): Promise<AuthUser | null> {
	try {
		const { payload } = await jose.jwtVerify(token, getSecret());
		if (!payload.sub) return null;
		return {
			sub: payload.sub,
			username: payload.username as string | undefined,
			email: payload.email as string | undefined,
		};
	} catch {
		return null;
	}
}
