import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist", "public/mockServiceWorker.js"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@base-ui/*",
                "radix-ui",
                "@radix-ui/*",
                "shadcn",
                "shadcn/*",
                "class-variance-authority",
                "cn",
                "@workspace/ui/src/**",
                "@workspace/ui/lib/**",
                "**/packages/ui/**",
              ],
              message:
                "Consume the design system through its public @workspace/ui exports.",
            },
          ],
        },
      ],
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
])
