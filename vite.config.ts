import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), tailwindcss(), solid({ ssr: true })],
  build: {
    rolldownOptions: {
      external: ['cloudflare:workers'],
    },
  },
  test: {
    environment: 'node',
    include: ['server/**/*.test.ts', 'src/**/*.test.ts'],
  },
  lint: {
    categories: {
      correctness: 'error',
      perf: 'error',
      suspicious: 'error',
    },
    ignorePatterns: ['.wrangler/**', 'dist/**', 'src/routeTree.gen.ts'],
    plugins: ['import', 'jsx-a11y', 'vitest'],
    jsPlugins: [
      { name: 'solid', specifier: 'eslint-plugin-solid' },
      {
        name: '@tanstack/query',
        specifier: '@tanstack/eslint-plugin-query',
      },
      {
        name: '@tanstack/router',
        specifier: '@tanstack/eslint-plugin-router',
      },
    ],
    options: {
      maxWarnings: 0,
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/router/create-route-property-order': 'error',
      '@tanstack/router/route-param-names': 'error',
      complexity: ['error', 10],
      curly: ['error', 'all'],
      'max-depth': ['error', 3],
      'max-params': ['error', 4],
      'no-await-in-loop': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-nested-ternary': 'error',
      'oxc/no-barrel-file': 'error',
      'solid/components-return-once': 'warn',
      'solid/jsx-no-script-url': 'error',
      'solid/no-destructure': 'error',
      'solid/no-innerhtml': 'error',
      'solid/reactivity': 'error',
      'typescript/consistent-type-definitions': ['error', 'interface'],
      'typescript/consistent-type-imports': 'error',
      'typescript/method-signature-style': ['error', 'property'],
      'typescript/no-confusing-void-expression': 'error',
      'typescript/no-explicit-any': 'error',
      'typescript/no-floating-promises': 'error',
      'typescript/no-misused-promises': 'error',
      'typescript/no-unnecessary-condition': 'error',
      'typescript/no-unnecessary-type-assertion': 'error',
      'typescript/no-unsafe-argument': 'error',
      'typescript/no-unsafe-assignment': 'error',
      'typescript/no-unsafe-call': 'error',
      'typescript/no-unsafe-member-access': 'error',
      'typescript/no-unsafe-return': 'error',
      'typescript/no-unsafe-type-assertion': 'error',
      'typescript/only-throw-error': 'error',
      'typescript/restrict-plus-operands': 'error',
      'typescript/restrict-template-expressions': 'error',
      'typescript/strict-boolean-expressions': 'error',
      'typescript/switch-exhaustiveness-check': 'error',
      'typescript/use-unknown-in-catch-callback-variable': 'error',
    },
  },
  fmt: {
    ignorePatterns: ['.wrangler/**', 'dist/**', 'src/routeTree.gen.ts'],
    singleQuote: true,
    sortImports: true,
    sortPackageJson: true,
    sortTailwindcss: true,
  },
  staged: {
    '*.{js,ts,tsx}': 'vp check --fix',
    '*': ['env NODE_PATH=./node_modules secretlint --no-glob', 'ls-lint'],
    '.env{,.*}': [() => 'dotenvx precommit .', () => 'dotenvx validate --overload'],
    '.github/workflows/*.{yml,yaml}': 'actrun lint --strict',
  },
});
