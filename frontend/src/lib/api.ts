export interface AuthUser {
	sub: string;
	username?: string;
	email?: string;
}

/**
 * Fetch the current user from the backend.
 * Requests are proxied via Next.js rewrites so we use relative paths.
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
	try {
		const res = await fetch("/api/me", { credentials: "include" });
		if (!res.ok) return null;
		const data = (await res.json()) as { user: AuthUser | null };
		return data.user;
	} catch {
		return null;
	}
}

/**
 * Send a greeting request
 */
export async function sendGreeting(
	name: string,
): Promise<{ message?: string; error?: string }> {
	const res = await fetch("/api/greeting", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name }),
	});
	return res.json() as Promise<{ message?: string; error?: string }>;
}
