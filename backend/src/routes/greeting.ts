import { Hono } from "hono";
import type { AuthEnv } from "../middleware/auth.ts";

const greeting = new Hono<AuthEnv>();

/**
 * POST /api/greeting — Server action equivalent
 */
greeting.post("/greeting", async (c) => {
	const user = c.get("user");
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const body = await c.req.json<{ name: string }>();
	const name = body.name;

	if (!name || typeof name !== "string") {
		return c.json({ error: "Name is required" }, 400);
	}

	const displayName = user.username ?? user.email ?? user.sub;
	return c.json({
		message: `Hello ${name}, from ${displayName}!`,
	});
});

export default greeting;
