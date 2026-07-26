import { vValidator } from '@hono/valibot-validator';
import type * as Cloudflare from 'alchemy/Cloudflare';
import { Hono } from 'hono';
import * as v from 'valibot';

import type { Website } from '../alchemy.run.ts';

export type Bindings = Partial<Omit<Cloudflare.InferEnv<typeof Website>, 'ASSETS'>>;

const paramsSchema = v.object({
  id: v.pipe(v.string(), v.minLength(3)),
});

export const app = new Hono<{ Bindings: Bindings }>()
  .basePath('/api')
  .get('/health', (c) => c.json({ ok: true }))
  .get('/environment', (c) =>
    c.json({
      helloConfigured: Boolean(c.env.HELLO),
    }),
  )
  .get('/test/:id', vValidator('param', paramsSchema), (c) => {
    const { id } = c.req.valid('param');

    return c.json({
      id,
      age: 20,
      name: 'Ultra-man',
    });
  })
  .notFound((c) => c.json({ message: 'Not Found' }, 404));

export type App = typeof app;
