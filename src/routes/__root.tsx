import { HydrationScript } from "@solidjs/web";
import type { QueryClient } from "@tanstack/solid-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { Loading, Show } from "solid-js";

import styles from "../styles.css?url";

const RootDocument = () => (
  <html lang="ja">
    <head>
      <HydrationScript />
      <HeadContent />
    </head>
    <body>
      <Loading>
        <Outlet />
      </Loading>
      <Show when={import.meta.env.DEV}>
        <TanStackRouterDevtools position="bottom-right" />
      </Show>
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "TanStack Start、Solid、Honoで構成した型安全なCloudflare Workersアプリです。",
        },
        { title: "TanStack Start + Solid + Hono" },
      ],
      links: [
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "stylesheet", href: styles },
      ],
    }),
    shellComponent: RootDocument,
  }
);
