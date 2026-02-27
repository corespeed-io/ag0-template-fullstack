import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { getEndSessionEndpoint, getKeycloak } from "../lib/auth/oidc.ts";
import { createSessionToken } from "../lib/auth/session.ts";
import type { AuthUser } from "../lib/auth/types.ts";

const isProduction = () => Deno.env.get("DENO_ENV") === "production";

const auth = new Hono();

/**
 * GET /auth/login — Redirect to Keycloak authorization
 */
auth.get("/login", (c) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const keycloak = getKeycloak();

	const authUrl = keycloak.createAuthorizationURL(state, codeVerifier, [
		"openid",
		"profile",
		"email",
	]);

	setCookie(c, "oauth_state", state, {
		httpOnly: true,
		secure: isProduction(),
		sameSite: "Lax",
		path: "/",
		maxAge: 600,
	});

	setCookie(c, "code_verifier", codeVerifier, {
		httpOnly: true,
		secure: isProduction(),
		sameSite: "Lax",
		path: "/",
		maxAge: 600,
	});

	return c.redirect(authUrl.toString());
});

/**
 * GET /auth/callback — Handle OIDC callback
 */
auth.get("/callback", async (c) => {
	const code = c.req.query("code");
	const state = c.req.query("state");
	const error = c.req.query("error");

	if (error) {
		return c.text(`Authentication error: ${error}`, 400);
	}

	if (!code || !state) {
		return c.text("Missing code or state parameter", 400);
	}

	const savedState = getCookie(c, "oauth_state");
	if (savedState !== state) {
		return c.text("Invalid state parameter", 400);
	}

	const codeVerifier = getCookie(c, "code_verifier");
	if (!codeVerifier) {
		return c.text("Missing code verifier", 400);
	}

	const keycloak = getKeycloak();

	const tokens = await keycloak
		.validateAuthorizationCode(code, codeVerifier)
		.catch((err: unknown) => {
			console.error("Token exchange failed:", err);
			return null;
		});

	if (!tokens) {
		return c.text("Token exchange failed", 500);
	}

	const claims = decodeIdToken(tokens.idToken()) as {
		sub: string;
		preferred_username?: string;
		email?: string;
	};

	if (!claims.sub) {
		return c.text("Invalid ID token: missing sub claim", 401);
	}

	const user: AuthUser = {
		sub: claims.sub,
		username: claims.preferred_username,
		email: claims.email,
	};

	const sessionToken = await createSessionToken(user);

	setCookie(c, "session", sessionToken, {
		httpOnly: true,
		secure: isProduction(),
		sameSite: "Lax",
		path: "/",
		maxAge: 86400,
	});

	deleteCookie(c, "oauth_state", { path: "/" });
	deleteCookie(c, "code_verifier", { path: "/" });

	const frontendUrl = Deno.env.get("FRONTEND_URL") ?? "http://localhost:3000";
	return c.redirect(frontendUrl);
});

/**
 * GET /auth/logout — Clear session and redirect to Keycloak logout
 */
auth.get("/logout", async (c) => {
	let logoutUrl: string;
	try {
		const endSessionEndpoint = await getEndSessionEndpoint();
		const url = new URL(endSessionEndpoint);
		const frontendUrl = Deno.env.get("FRONTEND_URL") ?? "http://localhost:3000";
		url.searchParams.set("post_logout_redirect_uri", frontendUrl);
		logoutUrl = url.toString();
	} catch {
		const frontendUrl = Deno.env.get("FRONTEND_URL") ?? "http://localhost:3000";
		logoutUrl = frontendUrl;
	}

	deleteCookie(c, "session", { path: "/" });
	return c.redirect(logoutUrl);
});

export default auth;
