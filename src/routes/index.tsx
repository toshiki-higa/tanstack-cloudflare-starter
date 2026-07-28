import { createFileRoute, useRouter, useRouterState } from '@tanstack/solid-router';
import { createServerFn } from '@tanstack/solid-start';

import { env } from '../env.ts';
import { fetchHomeData } from './-home.ts';

const getHomeData = createServerFn({ method: 'GET' }).handler(() => fetchHomeData(env));

export const Route = createFileRoute('/')({
  loader: () => getHomeData(),
  component: Home,
});

type HomeData = Awaited<ReturnType<typeof getHomeData>>;

type EnvironmentStatus = 'configured' | 'missing';

interface HomeViewProps {
  data: HomeData['testUser'];
  environmentStatus: EnvironmentStatus;
  isFetching: boolean;
  onReload: () => void;
}

function Home() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const isFetching = useRouterState({ select: (state) => state.isLoading });
  const environmentStatus = (): EnvironmentStatus =>
    data().environment.helloConfigured ? 'configured' : 'missing';

  return (
    <HomeView
      data={data().testUser}
      environmentStatus={environmentStatus()}
      isFetching={isFetching()}
      onReload={() => void router.invalidate()}
    />
  );
}

function HomeView(props: HomeViewProps) {
  return (
    <main class="mx-auto max-w-xl p-8">
      <h1 class="text-2xl font-bold">TanStack Start + Solid + Hono</h1>
      <p class="my-4">Cloudflare Workers向けのシンプルなスターターです。</p>

      <section class="mt-8" aria-labelledby="api-title">
        <h2 id="api-title" class="text-lg font-semibold">
          API 接続
        </h2>
        <dl class="my-4 divide-y">
          <div class="flex justify-between py-2">
            <dt>ユーザー ID</dt>
            <dd>{props.data.id}</dd>
          </div>
          <div class="flex justify-between py-2">
            <dt>名前</dt>
            <dd>{props.data.name}</dd>
          </div>
          <div class="flex justify-between py-2">
            <dt>年齢</dt>
            <dd>{props.data.age}</dd>
          </div>
          <div class="flex justify-between py-2">
            <dt>環境変数 HELLO</dt>
            <dd aria-live="polite">
              {props.environmentStatus === 'configured' ? '設定済み' : '未設定'}
            </dd>
          </div>
        </dl>

        <button
          class="rounded bg-black px-4 py-2 text-white transition hover:scale-105 active:scale-95 disabled:opacity-50"
          type="button"
          disabled={props.isFetching}
          aria-busy={props.isFetching}
          onClick={() => props.onReload()}
        >
          {props.isFetching ? '再読込中…' : '再読込'}
        </button>
      </section>
    </main>
  );
}
