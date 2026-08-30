import * as cf from 'cloudflare:workers';

import type { WebsiteEnv } from '../alchemy.run.ts';

export type Bindings = Omit<WebsiteEnv, 'ASSETS'>;

export const env = new Proxy({} as Bindings, {
  get(_, property) {
    return cf.env[property as keyof typeof cf.env];
  },
});
