import { createQuery, queryOptions } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { Show } from "solid-js";

import { apiClient } from "../api.ts";

const testUserId = "1212121";

const homeQueryOptions = queryOptions({
  queryKey: ["home"],
  staleTime: 30_000,
  queryFn: async () => {
    const [testUserResponse, environmentResponse] = await Promise.all([
      apiClient.test[":id"].$get({ param: { id: testUserId } }),
      apiClient.environment.$get(),
    ]);

    if (!testUserResponse.ok) {
      throw new Error("API request failed");
    }
    if (!environmentResponse.ok) {
      throw new Error("Environment status request failed");
    }

    const [testUser, environment] = await Promise.all([
      testUserResponse.json(),
      environmentResponse.json(),
    ]);

    return { environment, testUser };
  },
});

const Home = () => {
  const home = createQuery(() => homeQueryOptions);

  return (
    <main class="mx-auto max-w-xl p-8">
      <h1 class="text-2xl font-bold">TanStack Start + Solid + Hono</h1>
      <p class="my-4">Cloudflare Workers向けのシンプルなスターターです。</p>

      <section class="mt-8" aria-labelledby="api-title">
        <h2 id="api-title" class="text-lg font-semibold">
          API 接続
        </h2>

        <Show when={home.data}>
          {(data) => (
            <dl class="my-4 divide-y">
              <div class="flex justify-between py-2">
                <dt>ユーザー ID</dt>
                <dd>{data().testUser.id}</dd>
              </div>
              <div class="flex justify-between py-2">
                <dt>名前</dt>
                <dd>{data().testUser.name}</dd>
              </div>
              <div class="flex justify-between py-2">
                <dt>年齢</dt>
                <dd>{data().testUser.age}</dd>
              </div>
              <div class="flex justify-between py-2">
                <dt>環境変数 HELLO</dt>
                <dd>
                  {data().environment.helloConfigured ? "設定済み" : "未設定"}
                </dd>
              </div>
            </dl>
          )}
        </Show>

        <button
          class="rounded bg-black px-4 py-2 text-white transition hover:scale-105 active:scale-95 disabled:opacity-50"
          type="button"
          disabled={home.isFetching}
          aria-busy={home.isFetching ? "true" : "false"}
          onClick={() => {
            void home.refetch();
          }}
        >
          {home.isFetching ? "再読込中…" : "再読込"}
        </button>
      </section>
    </main>
  );
};

export const Route = createFileRoute("/")({
  ssr: false,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(homeQueryOptions),
  component: Home,
});
