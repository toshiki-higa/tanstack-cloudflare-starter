import assert from "node:assert/strict";

import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import router from "@tanstack/eslint-plugin-router";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import solidV2 from "eslint-plugin-solid/configs/v2";
import ultraciteFmt from "ultracite/oxfmt";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import tanstack from "ultracite/oxlint/tanstack";
import vitest from "ultracite/oxlint/vitest";
import { defineConfig } from "vite-plus";

// Narrow the type before configuring
assert.ok(core.ignorePatterns, "Ultracite core must provide ignorePatterns");

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/*.server.*", "**/server/**"],
        },
      },
    }),
    tailwindcss(),
    solid({ ssr: true }),
  ],
  build: {
    rolldownOptions: {
      external: ["cloudflare:workers"],
    },
  },
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "src/**/*.test.ts"],
    reporters: ["agent"],
    silent: "passed-only",
  },
  lint: {
    extends: [core, vitest, tanstack, antiSlop],
    ignorePatterns: [...core.ignorePatterns],
    jsPlugins: [
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

      // Conflicts with anti-slop/no-reflect-apply (Fix for >7.10.7)
      "unicorn/prefer-reflect-apply": "off",
    },
  },
  fmt: ultraciteFmt,
  staged: {
    "*.{js,ts,tsx}": "vp check --fix",
    "*": ["secretlint --no-glob", "ls-lint"],
    ".env{,.*}": [
      () => "dotenvx precommit .",
      () => "dotenvx validate -f .env.development --overload",
    ],
    ".github/workflows/*.{yml,yaml}": "actrun lint --strict",
  },
});
