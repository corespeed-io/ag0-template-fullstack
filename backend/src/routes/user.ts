import { Hono } from "hono";
import type { AuthEnv } from "../middleware/auth.ts";

const user = new Hono<AuthEnv>();

/**
 * GET /api/me — Get the current authenticated user
 */
user.get("/me", (c) => {
	const currentUser = c.get("user");
	if (!currentUser) {
		return c.json({ user: null });
	}
	return c.json({ user: currentUser });
});

export default user;
