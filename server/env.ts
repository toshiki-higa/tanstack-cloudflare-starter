import * as cf from "cloudflare:workers";

import type { WebsiteEnv } from "../alchemy.run.ts";

export type Bindings = Omit<WebsiteEnv, "ASSETS">;

declare global {
  // oxlint-disable-next-line typescript/no-namespace -- Cloudflare exposes an augmentable namespace for Worker bindings.
  namespace Cloudflare {
    // oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type -- Declaration merging connects Alchemy's generated bindings to cloudflare:workers.
    interface Env extends Bindings {}
  }
}

export const env: Bindings = cf.env;
