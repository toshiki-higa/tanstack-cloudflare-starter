import * as Alchemy from 'alchemy';
import * as Cloudflare from 'alchemy/Cloudflare';
import * as Config from 'effect/Config';
import * as Effect from 'effect/Effect';

const WORKER_BASE_NAME = 'tanstack-cloudflare-starter';

export const Website = Cloudflare.Website.Vite(
  'Website',
  Effect.gen(function* () {
    const stage = yield* Alchemy.Stage;

    return {
      name: `${WORKER_BASE_NAME}-${stage}`,
      dev: {
        port: Number(process.env['PORT']),
        strictPort: true,
      },
      compatibility: {
        date: '2026-06-16',
        flags: ['nodejs_compat'],
      },
      env: {
        HELLO: Config.redacted('HELLO'),
      },
    };
  }),
);

export default Alchemy.Stack(
  'TanStackStartSolidHono',
  {
    providers: Cloudflare.providers(),
    state: Alchemy.localState(),
  },
  Effect.gen(function* () {
    const website = yield* Website;
    return { websiteUrl: website.url.as<string>() };
  }),
);
