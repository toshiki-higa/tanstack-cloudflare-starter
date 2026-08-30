/*
# Spec
- The public Hono API returns a typed test user.
- Invalid path parameters are rejected.
- Environment injection is exposed only as a boolean status.
- The HTTP application mounts the API and delegates other requests to TanStack Start.
*/
import { describe, expect, it } from 'vitest';

import { api } from './api/index.ts';
import { createApp } from './index.ts';

const bindings = { HELLO: 'secret-value' };

describe('Hono API', () => {
  it('returns a typed test user', async () => {
    const response = await api.request('/test/1212121');

    expect(await response.json()).toEqual({
      id: '1212121',
      age: 20,
      name: 'Ultra-man',
    });
  });

  it('rejects an id shorter than three characters', async () => {
    const response = await api.request('/test/12');

    expect(response.status).toBe(400);
  });

  it('reports an injected binding without exposing its value', async () => {
    const response = await api.request('/environment', undefined, bindings);

    expect(await response.json()).toEqual({ helloConfigured: true });
  });
});

describe('HTTP application', () => {
  const app = createApp((request) => new Response(`Start: ${new URL(request.url).pathname}`));

  it('mounts the API at /api', async () => {
    const response = await app.request('/api/health', undefined, bindings);

    expect(await response.json()).toEqual({ ok: true });
  });

  it('delegates non-API requests to TanStack Start', async () => {
    const response = await app.request('/posts', undefined, bindings);

    expect(await response.text()).toBe('Start: /posts');
  });

  it('keeps unknown API requests out of TanStack Start', async () => {
    const response = await app.request('/api/unknown', undefined, bindings);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: 'Not Found' });
  });
});
