import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verifySessionToken } from "../lib/auth/session.ts";
import type { AuthUser } from "../lib/auth/types.ts";

export type AuthEnv = {
	Variables: {
		user: AuthUser | null;
	};
};

export async function authMiddleware(c: Context<AuthEnv>, next: Next) {
	const token = getCookie(c, "session");

	let user: AuthUser | null = null;
	if (token) {
		user = await verifySessionToken(token);
	}

	c.set("user", user);
	await next();
}
