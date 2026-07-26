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

## Development

Run dev server, then assign to https://<slug>.localhost:<port>.

```sh
pnpm dev
```

## Deployment

Local:

```sh
# Staging
(source .env.keys && ACTRUN_SECRET_DOTENV_PRIVATE_KEY="$DOTENV_PRIVATE_KEY_STAGING" actrun workflow run .github/workflows/cd.staging.yaml)

# Production
(source .env.keys && ACTRUN_SECRET_DOTENV_PRIVATE_KEY="$DOTENV_PRIVATE_KEY_PRODUCTION" actrun workflow run .github/workflows/cd.production.yaml)
```
