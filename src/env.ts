import * as cf from 'cloudflare:workers';

import type { WebsiteEnv } from '../alchemy.run.ts';

export const env = new Proxy({} as WebsiteEnv, {
  get(_, property) {
    return cf.env[property as keyof typeof cf.env];
  },
});
