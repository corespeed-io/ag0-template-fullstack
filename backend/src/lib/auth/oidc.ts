import { KeyCloak } from "arctic";

let keycloak: KeyCloak | undefined;

function getEnvOrThrow(key: string): string {
	const value = Deno.env.get(key);
	if (!value) throw new Error(`Missing environment variable: ${key}`);
	return value;
}

export function getKeycloak(): KeyCloak {
	if (keycloak) return keycloak;
	keycloak = new KeyCloak(
		getEnvOrThrow("OIDC_ISSUER_URL"),
		getEnvOrThrow("OIDC_CLIENT_ID"),
		getEnvOrThrow("OIDC_CLIENT_SECRET"),
		getEnvOrThrow("OIDC_REDIRECT_URI"),
	);
	return keycloak;
}

let endSessionEndpoint: string | undefined;

export async function getEndSessionEndpoint(): Promise<string> {
	if (endSessionEndpoint) return endSessionEndpoint;
	const issuer = getEnvOrThrow("OIDC_ISSUER_URL");
	const url = new URL(
		".well-known/openid-configuration",
		issuer.endsWith("/") ? issuer : `${issuer}/`,
	);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`OIDC discovery failed: ${res.status}`);
	const config = (await res.json()) as { end_session_endpoint: string };
	endSessionEndpoint = config.end_session_endpoint;
	return endSessionEndpoint;
}
