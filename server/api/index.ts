import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import * as v from "valibot";

import type { Bindings } from "../env.ts";

const paramsSchema = v.object({
  id: v.pipe(v.string(), v.minLength(3)),
});

export const api = new Hono<{ Bindings: Bindings }>()
  .get("/health", (c) => c.json({ ok: true }))
  .get("/environment", (c) =>
    c.json({
      helloConfigured: Boolean(c.env.HELLO),
    })
  )
  .get("/test/:id", sValidator("param", paramsSchema), (c) => {
    const { id } = c.req.valid("param");

    return c.json({
      id,
      age: 20,
      name: "Ultra-man",
    });
  });

export type Api = typeof api;
