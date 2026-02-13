import type { MiddlewareHandler } from "hono";
import { proxy } from "hono/proxy";

/**
 * Reverse proxy middleware that forwards HTTP requests and WebSocket
 * connections to an upstream origin.
 */
export function proxyMiddleware(origin: string): MiddlewareHandler {
  const base = new URL(origin);
  // Strip trailing slash to avoid double slashes when joining with target.pathname
  const basePath = base.pathname.replace(/\/$/, "");

  return async (c) => {
    const target = new URL(c.req.url);
    target.host = base.host;
    target.protocol = base.protocol;
    target.pathname = basePath + target.pathname;

    // WebSocket upgrade
    if (c.req.header("upgrade")?.toLowerCase() === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(c.req.raw);
      target.protocol = base.protocol === "https:" ? "wss:" : "ws:";
      const upstream = new WebSocket(target);

      upstream.onopen = () => {
        socket.onmessage = (e) => upstream.send(e.data);
      };
      upstream.onmessage = (e) => socket.send(e.data);
      upstream.onclose = () => socket.close();
      socket.onclose = () => upstream.close();

      return response;
    }

    // HTTP proxy
    return await proxy(target.href, { raw: c.req.raw });
  };
}
