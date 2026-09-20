# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

For this demo, Coinflow operations/admin teammates who need to monitor merchant payment activity, investigate purchases, and review customer records.

## Product Purpose

This is a take-home interview redesign of a Coinflow merchant dashboard. It presents a high-level payment-activity overview plus purchase and customer workflows, using deterministic mock data until a real API is available.

## Positioning

The dashboard is an operations workspace: it combines merchant-level payment summaries, trends, filterable transaction and customer records, and focused detail views in one internal web experience.

## Operating Context

Users move between Overview, Purchases, and Customers. They select date ranges, choose timezone and metric views, sort records, and open payment or customer details. The application composes the shared UI system from `../../packages/ui`; browser-ready development uses Vite and MSW mocks.

## Capabilities and Constraints

- The app consumes only explicit `@workspace/ui` component exports and the shared stylesheet; application code owns content, state, API boundaries, and domain formatting.
- Before a `packages/ui` component is added or materially changed for this app, identify its one-to-one shadcn foundation and obtain explicit confirmation. If no corresponding shadcn component exists, keep the behavior in `apps/web` unless the user approves a documented exception; the existing TanStack Charts integration is an approved exception.
- Mocked responses are deterministic for reproducible screenshots and tests. They do not represent Coinflow’s production API.
- Normal production builds expect a real `/api/user` endpoint; mock behavior is enabled only for development or `VITE_ENABLE_MOCKS=true` builds.
- The current routes are dashboard overview, purchases, and customers; data is intentionally fictional.

## Brand Commitments

This demo is based on Coinflow’s real company and product. Preserve the Coinflow name and use its public site, https://coinflow.cash/about-us/, as product context. Do not fabricate production features, customers, metrics, compliance claims, or API behavior beyond assignment evidence.

## Evidence on Hand

- Existing dashboard routes, components, fixtures, tests, and mock API contracts under `src/`.
- Shared design system at `../../packages/ui`.
- The repository README identifies the work as a mocked Coinflow admin overview.
- The user described an assignment reference named `Merchant Dashboard Screenshots/`; no assets were located at that path during initialization.

## Product Principles

- Help operations users find and interpret payment information quickly.
- Make record investigation direct, structured, and reversible.
- Keep demo data and claims transparent rather than implying production access.
- Reuse the shared system instead of creating page-local visual behavior.
- Preserve responsive, keyboard-accessible workflows.
