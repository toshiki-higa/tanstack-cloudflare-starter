import type { QueryClient } from '@tanstack/solid-query';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';
import { Show, Suspense } from 'solid-js';
import { HydrationScript } from 'solid-js/web';

import styles from '../styles.css?url';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'description',
        content: 'TanStack Start、Solid、Honoで構成した型安全なCloudflare Workersアプリです。',
      },
      { title: 'TanStack Start + Solid + Hono' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'stylesheet', href: styles },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument() {
  return (
    <html lang="ja">
      <head>
        <HydrationScript />
        <HeadContent />
      </head>
      <body>
        <Suspense>
          <Outlet />
        </Suspense>
        <Show when={import.meta.env.DEV}>
          <TanStackRouterDevtools position="bottom-right" />
        </Show>
        <Scripts />
      </body>
    </html>
  );
}
