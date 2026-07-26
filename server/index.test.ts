/*
# Spec
- The public Hono API returns a typed test user.
- Invalid path parameters are rejected.
- Environment injection is exposed only as a boolean status.
*/
import { describe, expect, it } from 'vitest';

import { app } from './index.ts';

describe('Hono API', () => {
  it('returns a typed test user', async () => {
    const response = await app.request('/api/test/1212121');

    expect(await response.json()).toEqual({
      id: '1212121',
      age: 20,
      name: 'Ultra-man',
    });
  });

  it('rejects an id shorter than three characters', async () => {
    const response = await app.request('/api/test/12');

    expect(response.status).toBe(400);
  });

  it('reports an injected binding without exposing its value', async () => {
    const response = await app.request('/api/environment', undefined, {
      HELLO: 'secret-value',
    });

    expect(await response.json()).toEqual({ helloConfigured: true });
  });
});
