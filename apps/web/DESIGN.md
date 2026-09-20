---
name: Coinflow Merchant Dashboard Application
description: The responsive application expression of the shared payment-operations system.
colors:
  canvas: "oklch(1 0 0)"
  ink: "oklch(0.145 0 0)"
  surface-muted: "oklch(0.97 0 0)"
  divider: "oklch(0.922 0 0)"
  accent: "oklch(0.95 0.025 285)"
  chart-primary: "oklch(0.61 0.17 285)"
  chart-secondary: "oklch(0.54 0.14 305)"
typography:
  display:
    fontFamily: "Figtree Variable, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "1.25"
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.625"
rounded:
  md: "0.5rem"
  xl: "0.875rem"
spacing:
  mobile-page: "1.25rem"
  desktop-page: "2.25rem"
  section: "2rem"
components:
  app-shell:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
  metric-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1.25rem"
---

# Design System: Coinflow Merchant Dashboard Application

## Overview

**Creative North Star: "Operator's Field Guide"**

The application turns the shared system into a focused operations workspace. The persistent desktop rail establishes location without dominating the page; overview metrics, trends, filterable tables, and record drawers each stay within predictable, lightly bounded regions. The visual rhythm prioritizes rapid scanning and confident investigation.

This implementation inherits its visual tokens and primitives from `../../packages/ui`. Its current expression is neutral and compact, with light lavender serving focus, selection, current navigation, and the primary chart relationship.

**Key Characteristics:**
- Persistent context on desktop, accessible compact navigation on smaller screens.
- Dashboard information moves from an operator overview to trend evidence and drill-down.
- Data tables are dense but contained, scrollable, and visually calm.
- Detail drawers preserve the user’s list context while exposing record depth.

## Colors

The app uses the shared neutral foundation; page-level color is intentionally sparse.

### Primary

- **Ledger Ink:** `colors.ink` anchors text, navigation hierarchy, and high-emphasis actions.

### Secondary

- **Field Lavender:** `colors.accent` marks selected navigation and record context, while `colors.chart-primary` and `colors.chart-secondary` separate the shared TanStack chart series.

### Neutral

- **Clean Canvas:** `colors.canvas` keeps cards, header, rail, and data containers clear.
- **Quiet Work Surface:** `colors.surface-muted` gently distinguishes the page field from white containers.
- **Hairline Divider:** `colors.divider` preserves structure around navigation, tables, and cards.

**The Quiet Field Rule.** Broad application surfaces stay neutral so record values, status, and selected context remain easy to locate.

## Typography

**Display Font:** Figtree Variable (with sans-serif fallback)

**Body Font:** Geist Variable (with sans-serif fallback)

**Character:** Page headings are clear and purposeful; data labels, filters, and records use compact Geist typography to make dense operations work calm rather than cramped.

## Layout

The desktop rail is fixed at 18rem with the content region offset to match. Page sections use 1.25rem padding on small screens and 2.25rem at the medium breakpoint. Dashboard metric cards become a three-column grid at medium widths; trend cards become a two-column grid at extra-large widths. The rail collapses below the large breakpoint into a 3.5rem sticky mobile header and navigation drawer.

**The Context-Stays-Put Rule.** Opening a record should add detail through a responsive drawer rather than disorienting users with a context-breaking page transition.

## Elevation & Depth

The page field is subtly muted; cards, tables, and side navigation are white or dark-card surfaces bounded by fine borders. Small shadows clarify grouped containers, while drawers and popovers receive stronger separation. Depth remains structural, never ornamental.

## Shapes

The app inherits 8px controls and 14px card/table shells. The desktop rail and mobile header are rectilinear structural surfaces; action and status components preserve the shared gentle-corner language.

## Components

### Navigation

Desktop navigation is a fixed, white 18rem rail. It includes brand mark, merchant selection, command-search field, grouped links, and user identity. The mobile alternative uses a sticky header with a drawer trigger and retains accessible focus behavior.

### Cards / Containers

Metric and trend cards use shared bordered, subtly lifted containers. Dashboard cards lead with their title or value and keep controls close to the data they affect.

### Data Tables

Purchases and Customers use horizontally scrollable tables inside shared shells. Date range filters share their page header, and opening a row sets the shared lavender active state before invoking a responsive bottom/right detail drawer.

### [Signature Component] — Responsive Detail Drawer

The record drawer opens from the bottom on small screens and from the right above 768px. It preserves the table behind it, making review and return a single focused interaction.

## Do's and Don'ts

### Do:

- **Do** keep the page hierarchy summary-first and investigation-ready.
- **Do** make table rows and drawers work together as one review flow.
- **Do** retain an explicit mobile navigation pattern below desktop widths.
- **Do** use the shared UI package for every reusable visual behavior.

### Don't:

- **Don't** make each dashboard card a new visual language.
- **Don't** use a detail view that discards the user’s filtered table context.
- **Don't** introduce app-local styling that conflicts with shared tokens or components.
