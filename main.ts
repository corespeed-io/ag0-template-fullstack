import { Hono } from "hono";
import { parsePort } from "@zypher/utils/env";
import { setupLogging } from "@ag0/logging";
import api from "./api/mod.ts";
import { proxyMiddleware } from "./api/middlewares/proxy.ts";

async function main(): Promise<void> {
  await setupLogging();

  const app = new Hono()
    .route("/api", api)
    .get("/health", (c) => c.json({ status: "ok" }));

  const vitePort = Deno.env.get("VITE_PORT");
  if (vitePort) {
    app.all("*", proxyMiddleware(`http://localhost:${vitePort}`));
  }

  const port = parsePort(Deno.env.get("PORT"), 8080);
  Deno.serve({ handler: app.fetch, port });
}

if (import.meta.main) {
  main();
}
