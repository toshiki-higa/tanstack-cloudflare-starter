import { hc } from 'hono/client';

import { app } from '../../server/index.ts';
import type { App, Bindings } from '../../server/index.ts';

export const fetchHomeData = async (bindings: Bindings) => {
  const client = hc<App>('http://internal', {
    fetch: (input: Request | string | URL, requestInit?: RequestInit) =>
      app.request(input, requestInit, bindings),
  });
  const [testUserResponse, environmentResponse] = await Promise.all([
    client.api.test[':id'].$get({ param: { id: '1212121' } }),
    client.api.environment.$get(),
  ]);

  if (!testUserResponse.ok) {
    throw new Error('API request failed');
  }
  if (!environmentResponse.ok) {
    throw new Error('Environment status request failed');
  }

  const [testUser, environment] = await Promise.all([
    testUserResponse.json(),
    environmentResponse.json(),
  ]);

  return { environment, testUser };
};
