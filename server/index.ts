import { Hono } from "hono";

import { api } from "./api/index.ts";
import type { Bindings } from "./env.ts";

type StartFetch = (request: Request) => Response | Promise<Response>;

interface Env {
  Bindings: Bindings;
}

export const createApp = (startFetch: StartFetch) =>
  new Hono<Env>()
    .route("/api", api)
    .all("/api/*", (c) => c.json({ message: "Not Found" }, 404))
    .all("*", async (c) => await startFetch(c.req.raw));
