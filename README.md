# TanStack Cloudflare Starter

## Prerequirements

- Nix
- direnv

## Teck Stack

- Tanstack Start
- Solid
- Hono
- Valibot
- Tailwind CSS
- dotenvx
- Alchemy

## Additional Stack

- Result Type: `@praha/byethrow` + `@praha/byethrow-oxlint` + `@praha/byethrow-testing`
- Components:
  - Focus on minimal & development speed: daisyui
  - Focus on accessibility & originality: Ark UI
- Form: `@formisch/solid`
- Database:
  - Turso: `kysely` + `@libsql/kysely-libsql` + `atlasgo`
  - D1: `kysely` + `@oselvar/kysely-cloudflare` + `wrangler`
- Auth: `betterauth`
- Payment: `stripe`

## Setup (First only)

- Setup development enviroment

```sh
direnv allow
pnpm portless trust
```

- Create `.env.*` files from `.env.example`
  - development
  - staging
  - production

- Create `DESIGN.md` from [pre-design-md](https://pre-design-md.dev/)

## Development

Run dev server, then assign to https://<slug>.localhost:<port>.

```sh
pnpm dev
```

## Optional Server-Side API Access

The example calls Hono from the browser; for SSR data or server-only orchestration, keep SSR enabled and call Hono in-process from a Server Function using its typed client:

```tsx
import { createFileRoute } from '@tanstack/solid-router';
import { createServerFn } from '@tanstack/solid-start';
import { hc } from 'hono/client';

import { api } from '../../server/api/index.ts';
import type { Api } from '../../server/api/index.ts';
import { env } from '../../server/env.ts';

const getEnvironment = createServerFn({ method: 'GET' }).handler(async () => {
  const client = hc<Api>('http://internal', {
    fetch: (input, init) => api.request(input, init, env),
  });
  const response = await client.environment.$get();

  if (!response.ok) throw new Error('API request failed');
  return response.json();
});

export const Route = createFileRoute('/settings')({
  loader: () => getEnvironment(),
  component: Settings,
});

function Settings() {
  const data = Route.useLoaderData();
  return <p>{data().helloConfigured ? 'Configured' : 'Missing'}</p>;
}
```

## Deployment

Local:

```sh
# Staging
(source .env.keys && ACTRUN_SECRET_DOTENV_PRIVATE_KEY="$DOTENV_PRIVATE_KEY_STAGING" actrun workflow run .github/workflows/cd.staging.yaml)

# Production
(source .env.keys && ACTRUN_SECRET_DOTENV_PRIVATE_KEY="$DOTENV_PRIVATE_KEY_PRODUCTION" actrun workflow run .github/workflows/cd.production.yaml)
```
