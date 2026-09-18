# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Product engineers building the Coinflow merchant-dashboard interview demo. They need reliable, accessible primitives for presenting payment operations information without reimplementing UI behavior per screen.

## Product Purpose

This package is the shared design-system boundary for the Coinflow merchant-dashboard demo. It makes the application’s interface consistent while keeping application content, state, and domain behavior out of the component layer.

## Positioning

The package exposes intentionally narrow, named component contracts rather than arbitrary styling or primitive-library access. It owns responsive behavior, focus management, icons, typography, themes, and visual implementation behind those contracts.

## Operating Context

The package is consumed by `apps/web` through explicit `@workspace/ui/components/*` exports and `@workspace/ui/globals.css`. It supports an internal payment-operations dashboard with metrics, charts, tabular records, filters, drawers, and form controls.

## Capabilities and Constraints

- Public components and their allowed props are documented in `README.md`; private adapters and source paths are not public APIs.
- Product code supplies content, state, and domain behavior. The UI package owns markup, styling, primitive configuration, positioning, focus management, and responsive component behavior.
- The system includes light and dark themes and uses Geist Variable and Figtree Variable fonts.
- New visual decisions require an explicit named API, documentation, contract coverage, behavior tests where relevant, and reviewed browser screenshots.

## Brand Commitments

The shared system supports a take-home interview redesign based on Coinflow’s real product and name. Coinflow’s public product information is a reference, not authorization to invent production claims, customer data, or product behavior absent from the assignment.

## Evidence on Hand

- Component source and public-contract documentation: `src/` and `README.md`.
- Consumer application: `../../apps/web`.
- The repository’s data fixtures are deterministic and fictional; they are not production API or customer evidence.
- The assignment references `Merchant Dashboard Screenshots/`; no assets were located at that path during initialization.

## Product Principles

- Make common operational tasks dependable through constrained, reusable interfaces.
- Keep the system/application boundary explicit and enforceable.
- Preserve accessibility and responsive behavior as component responsibilities.
- Treat real-product references as context while keeping demo claims honest.

