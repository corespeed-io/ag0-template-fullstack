import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth.ts";
import type { AuthEnv } from "./middleware/auth.ts";
import authRoutes from "./routes/auth.ts";
import greetingRoutes from "./routes/greeting.ts";
import userRoutes from "./routes/user.ts";

const app = new Hono<AuthEnv>();

const FRONTEND_URL = Deno.env.get("FRONTEND_URL") ?? "http://localhost:3000";

// CORS — allow frontend origin with credentials
app.use(
	"*",
	cors({
		origin: FRONTEND_URL,
		credentials: true,
	}),
);

// Auth middleware — populates c.var.user on every request
app.use("*", authMiddleware);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

// Auth routes (login, callback, logout)
app.route("/auth", authRoutes);

// API routes
app.route("/api", greetingRoutes);
app.route("/api", userRoutes);

const port = Number(Deno.env.get("PORT") ?? 8000);
console.log(`Backend listening on http://localhost:${port}`);

Deno.serve({ port }, app.fetch);
