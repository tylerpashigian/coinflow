# Coinflow assessment

React + Vite app with a shared design system and a mocked Coinflow admin overview.

## Getting started

Use Node 24.11.1+ (`nvm use`) and pnpm 10.33.4 (the version in `packageManager`).

```sh
pnpm install
pnpm dev
```

The dashboard displays deterministic fictional data from MSW before a real API is available.
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
- `apps/web` owns application behavior. `pages` compose routes, `components` hold
  reusable app UI, `hooks` own UI-facing state, `data/models` holds client models,
  `data/mocks` holds MSW handlers/fixtures/builders, and `services` owns API
  boundaries.
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

## Mock API contracts

`GET /api/user` returns the signed-in user. `GET /api/dashboard/overview` accepts
`from`, `to`, and `timezone` and returns KPI summaries plus payment/payout series.
Payment and customer list/detail contracts are also mocked at `/api/payments`,
`/api/payments/:id`, `/api/customers`, and `/api/customers/:id` for the next slice.

Services own API integration and response validation; hooks own UI-facing loading
and error state. This is a frontend demo contract, not Coinflow's production API.

Default MSW fixtures are curated and deterministic for reproducible screenshots
and tests. `userBuilder().with({ name: "Jordan Lee" }).build()` remains available
for isolated test scenarios without mutating existing builders.

To add shadcn components, use the existing monorepo configuration and explicitly
export new shared components from `packages/ui/package.json`.
