import { createFileRoute, useRouter, useRouterState } from '@tanstack/solid-router';
import { createServerFn } from '@tanstack/solid-start';

import { fetchHomeData } from './-home.ts';

const getHomeData = createServerFn({ method: 'GET' }).handler(() => fetchHomeData(process.env));

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
    <main class="home-shell">
      <div class="home-container">
        <header class="site-header">
          <a class="brand" href="/" aria-label="スターターキット ホーム">
            <span class="brand-mark" aria-hidden="true">
              TS
            </span>
            <span>Starter Kit</span>
          </a>
          <span class="badge">Cloudflare Workers</span>
        </header>

        <section class="hero" aria-labelledby="page-title">
          <div class="hero-copy">
            <p class="eyebrow">TYPE-SAFE FULL-STACK TEMPLATE</p>
            <h1 id="page-title">小さく始めて、堅牢に育てる。</h1>
            <p class="hero-description">
              TanStack Start、Solid、Honoを組み合わせた、型安全でコンパクトなスターターキットです。
            </p>
          </div>

          <article class="card status-card">
            <div class="card-header">
              <div>
                <p class="card-label">SYSTEM STATUS</p>
                <h2>API 接続</h2>
              </div>
              <span
                class={`status-dot status-dot--${props.environmentStatus}`}
                aria-hidden="true"
              />
            </div>

            <dl class="data-list">
              <div>
                <dt>ユーザー ID</dt>
                <dd>{props.data.id}</dd>
              </div>
              <div>
                <dt>名前</dt>
                <dd>{props.data.name}</dd>
              </div>
              <div>
                <dt>年齢</dt>
                <dd>{props.data.age}</dd>
              </div>
              <div>
                <dt>環境変数 HELLO</dt>
                <dd aria-live="polite">
                  <span class={`status-badge status-badge--${props.environmentStatus}`}>
                    {props.environmentStatus === 'configured' ? '注入済み' : '未注入'}
                  </span>
                </dd>
              </div>
            </dl>

            <button
              class="primary-button"
              type="button"
              disabled={props.isFetching}
              aria-busy={props.isFetching}
              onClick={() => props.onReload()}
            >
              {props.isFetching ? '再読込中…' : 'APIを再読込'}
            </button>
          </article>
        </section>

        <section class="stack-section" aria-labelledby="stack-title">
          <div class="section-heading">
            <p class="eyebrow">FOUNDATION</p>
            <h2 id="stack-title">最小限の構成、明確な責務</h2>
          </div>
          <div class="feature-grid">
            <article class="card feature-card">
              <span class="feature-number">01</span>
              <h3>TanStack Start</h3>
              <p>ルーティングとサーバー関数を、一貫した型でつなぎます。</p>
            </article>
            <article class="card feature-card">
              <span class="feature-number">02</span>
              <h3>Solid</h3>
              <p>きめ細かなリアクティビティで、高速な画面を構築します。</p>
            </article>
            <article class="card feature-card">
              <span class="feature-number">03</span>
              <h3>Hono</h3>
              <p>Cloudflare Workers上で、軽量なAPIを提供します。</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
