import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

export const cloudflareConfig = {
  workerName: "tanstack-cloudflare-starter",
  compatibilityDate: "2026-08-04",
  compatibilityFlags: ["nodejs_compat"],
};

export class Website extends Cloudflare.Website.Vite<Website>()(
  "Website",
  Effect.gen(function* createWebsite() {
    const stage = yield* Alchemy.Stage;

    return {
      name: `${cloudflareConfig.workerName}-${stage}`,
      dev: {
        port: Number(process.env["PORT"]),
        strictPort: true,
      },
      compatibility: {
        date: cloudflareConfig.compatibilityDate,
        flags: cloudflareConfig.compatibilityFlags,
      },
      assets: {
        runWorkerFirst: true,
      },
      env: {
        HELLO: Config.redacted("HELLO"),
      },
    };
  })
) {}

export type WebsiteEnv = Cloudflare.InferEnv<typeof Website>;

export default Alchemy.Stack(
  "TanStackStartSolidHono",
  {
    providers: Cloudflare.providers(),
    state: Alchemy.localState(),
  },
  Effect.gen(function* createStack() {
    const website = yield* Website;
    return { websiteUrl: website.url.as<string>() };
  })
);
