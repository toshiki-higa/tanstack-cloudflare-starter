import { createFileRoute } from '@tanstack/solid-router';

import { app } from '../../../server/index.ts';

const serve = ({ request }: { request: Request }) => app.fetch(request, process.env);

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: serve,
      POST: serve,
      PUT: serve,
      DELETE: serve,
      PATCH: serve,
      OPTIONS: serve,
      HEAD: serve,
    },
  },
});
