import assert from "node:assert/strict";

import router from "@tanstack/eslint-plugin-router";
import solidV2 from "eslint-plugin-solid/configs/v2";
import ultraciteFmt from "ultracite/oxfmt";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import shadcn from "ultracite/oxlint/shadcn";
import tanstack from "ultracite/oxlint/tanstack";
import vitest from "ultracite/oxlint/vitest";
import { defineConfig, lazyPlugins, runnerImport } from "vite-plus";

import type * as alchemy from "./alchemy.run.ts";

// Narrow the type before configuring
assert.ok(core.ignorePatterns, "Ultracite core must provide ignorePatterns");

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    watch: {
      // Ignore non-sources
      ignored: [
        "**/.direnv/**",
        "**/.alchemy/**",
        "**/.tmp/**",
        "**/.fallow/**",
        "**/dist/**",
      ],
    },
  },
  plugins: [
    // Import lazily so lint and test skips them
    lazyPlugins(async () => {
      const { tanstackStart } =
        await import("@tanstack/solid-start/plugin/vite");
      const { default: solid } = await import("@solidjs/vite-plugin");
      const { default: tailwindcss } = await import("@tailwindcss/vite");
      return [
        tanstackStart({
          importProtection: {
            behavior: "error",
            client: {
              files: ["**/*.server.*", "**/server/**"],
            },
          },
        }),
        solid({ ssr: true }),
        tailwindcss(),
      ];
    }),
  ],
  build: {
    minify: true,
    rolldownOptions: {
      external: ["cloudflare:workers"],
    },
  },
  test: {
    environment: "node",
    projects: [
      {
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.ts", "server/**/*.test.ts"],
          exclude: ["**/*.cf.test.ts"],
        },
      },
      {
        plugins: [
          lazyPlugins(async () => {
            const { cloudflareTest } =
              await import("@cloudflare/vitest-pool-workers");
            // Workaround: Keep these imports out of the config bundle.
            const {
              module: { cloudflareConfig },
            } = await runnerImport<typeof alchemy>("./alchemy.run.ts");

            return [
              cloudflareTest({
                miniflare: {
                  compatibilityDate: cloudflareConfig.compatibilityDate,
                  compatibilityFlags: cloudflareConfig.compatibilityFlags,
                },
              }),
            ];
          }),
        ],
        test: {
          name: "cloudflare",
          include: ["server/**/*.cf.test.ts"],
        },
      },
    ],
    reporters: ["agent"],
    silent: "passed-only",
  },
  lint: {
    extends: [core, vitest, tanstack, antiSlop, shadcn],
    ignorePatterns: [...core.ignorePatterns],
    jsPlugins: [
      { name: "shadcn", specifier: "@shadcn/lint" },
      { name: "solid", specifier: "eslint-plugin-solid" },
      {
        name: "@tanstack/query",
        specifier: "@tanstack/eslint-plugin-query",
      },
      {
        name: "@tanstack/router",
        specifier: "@tanstack/eslint-plugin-router",
      },
    ],
    options: {
      denyWarnings: true,
      typeAware: true,
      typeCheck: true,
    },
    settings: {
      solid: { version: 2 },
    },
    rules: {
      ...router.configs.recommended.rules,
      ...solidV2.rules,

      // Framework-agnostic TanStack Query rules
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/infinite-query-property-order": "error",
      "@tanstack/query/prefer-query-options": "error",

      // Prevent cross-request state sharing during SSR
      "solid/no-module-scope-reactive-primitive": "error",

      // Production-ready quality: Module and runtime safety
      "import/no-commonjs": "error",
      "typescript/no-require-imports": "error",
      "import/no-unassigned-import": [
        "error",
        {
          allow: [
            "**/*.css",
            "**/*.scss",
            "**/*.sass",
            "**/*.less",
            "**/*.styl",
            "**/*.stylus",
            "**/*.pcss",
          ],
        },
      ],
      "unicorn/prefer-global-this": "error",

      // Relax Ultracite
      "sort-keys": "off",
      "no-inline-comments": "off",
      "no-warning-comments": "off",
      "no-plusplus": "off",
      "prefer-destructuring": "off",
      "unicorn/prefer-ternary": "off",

      // Relax anti-slop
      "anti-slop/no-conditional-empty-object-spread": "off",
      "anti-slop/no-shape-in-symbol-names": "off",
      "anti-slop/no-unknown-parameters": "off",
    },
  },
  fmt: ultraciteFmt,
  staged: {
    "*.{js,ts,tsx}": ["vp lint --fix --format=agent", "vp test related"],
    "*": [
      "vp fmt --no-error-on-unmatched-pattern",
      "secretlint --no-glob",
      "ls-lint",
      () => "fallow audit --base HEAD --format json --quiet",
    ],
    ".env{,.*}": [
      () => "dotenvx precommit .",
      "dotenvx validate --overload -fk . -f",
    ],
    ".github/workflows/*.{yml,yaml}": "actrun lint --strict",
  },
});
