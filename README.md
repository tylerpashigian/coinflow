# Coinflow assessment

React + Vite app with a shared design system and a mocked user endpoint.

## Getting started

Use Node 24.11.1+ (`nvm use`) and pnpm 10.33.4 (the version in `packageManager`).

```sh
pnpm install
pnpm dev
```

The boilerplate displays a generated fictional user after fetching `GET /api/user`.
MSW starts before React renders in development.
Press `d` to toggle the existing theme.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

For a production build with the same demo API, run
`VITE_ENABLE_MOCKS=true pnpm build`, then `pnpm --filter web preview`.
Ordinary production builds exclude the mock imports and require a real `/api/user` endpoint.

## Package boundaries

- `packages/ui` owns shadcn/Base UI, components, typography, fonts, and theme CSS.
  Only explicitly exported components and `globals.css` are public.
- `apps/web` owns application behavior, domain types, API services, data hooks, MSW handlers, and builders.
  ESLint rejects direct underlying UI-library imports and design-system internals.
- App layout can use Tailwind; typography uses the shared `Text` component.

```tsx
import { Button } from "@workspace/ui/components/button"
import { Text } from "@workspace/ui/components/text"

<Text as="h1" variant="heading">Overview</Text>
<Text variant="body">Payment activity</Text>
<Text as="span" variant="caption" tone="muted">Updated today</Text>
<Text as="label" htmlFor="name" weight="medium">Name</Text>
```

`Text` defaults to a paragraph. Its `as` prop is constrained to text elements:
`p`, `span`, `h1`–`h6`, `strong`, `em`, `small`, `label`, `code`, and `kbd`.
Native props and refs follow the chosen element; unsupported tags/attributes fail
compilation. Variants (`body`, `caption`, `subheading`, `heading`) provide size and
weight defaults, independently overridable with typed tokens. Styling does not
choose heading semantics. Compile-time regression cases live in
`packages/ui/src/text.typecheck.tsx`.

## Mock user contract

`GET /api/user` returns `{ id: string, name: string, email: string }`. This is a
frontend demo assumption, not Coinflow's API. `services/user-service.ts` owns the
API integration and response validation; `data/hooks/use-user.ts` owns the
UI-facing loading and error state. The hook is the migration point for caching or
TanStack Query, so components stay independent of either implementation detail.

`userBuilder().with({ name: "Jordan Lee" }).build()` creates deterministic data
without mutating existing builders. Browser and integration tests share handlers;
tests override responses per scenario and reset them afterward. The tests cover
Strict Mode loading, custom server data, and request failure.

To add shadcn components, use the existing monorepo configuration and explicitly
export new shared components from `packages/ui/package.json`.
