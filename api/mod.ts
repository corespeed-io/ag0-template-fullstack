/**
 * API Router
 *
 * This module defines the backend API. All routes defined
 * here are mounted under `/api` by `main.ts`.
 *
 * Add custom routes, middleware, and API handlers here. For example:
 *
 *   app.get("/users", (c) => c.json([{ name: "Alice" }]));   // GET /api/users
 *   app.post("/echo", async (c) => c.json(await c.req.json())); // POST /api/echo
 *
 * You can also mount sub-routers for more complex APIs:
 *
 *   const items = new Hono();
 *   items.get("/", (c) => c.json([]));
 *   items.post("/", async (c) => { ... });
 *   app.route("/items", items);  // /api/items/*
 */
import { Hono } from "hono";
import { cors } from "hono/cors";
// import { createZypherAgentRouter } from "./agent.ts";

const app = new Hono()
  .use(cors());

// Zypher Agent API — uncomment to mount the agent HTTP/WebSocket API.
// createZypherAgentRouter() (from ./agent.ts) uses @zypher/http, a
// framework-agnostic HTTP handler that exposes a Zypher Agent over
// HTTP and WebSocket.
//
// On the frontend, use the @zypher/ui package — it provides React hooks
// (e.g., useAgent) designed to consume the Zypher agent API.
//
// AG0 Dashboard integration:
// The dashboard shows the agent canvas tab only when GET /api/agent/info
// returns an AgentInfo object. This endpoint is defined in agent.ts via
// buildAgentInfo(). Without it, the dashboard treats this as a plain app.
//
// app.route("/agent", await createZypherAgentRouter());

export default app;
