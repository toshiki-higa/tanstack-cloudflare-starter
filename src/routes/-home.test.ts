import { expect, test } from 'vitest';

import { fetchHomeData } from './-home.ts';

test('fetches the home data through the server function', async () => {
  const data = await fetchHomeData({ HELLO: 'secret-value' });

  expect(data).toEqual({
    environment: { helloConfigured: true },
    testUser: {
      age: 20,
      id: '1212121',
      name: 'Ultra-man',
    },
  });
});
