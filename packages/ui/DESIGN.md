---
name: Coinflow Merchant Dashboard UI
description: A restrained, responsive operations system for payment administration.
colors:
  canvas: "oklch(1 0 0)"
  ink: "oklch(0.145 0 0)"
  surface-muted: "oklch(0.97 0 0)"
  text-muted: "oklch(0.556 0 0)"
  divider: "oklch(0.922 0 0)"
  danger: "oklch(0.577 0.245 27.325)"
  success: "oklch(0.52 0.14 150)"
  info: "oklch(0.52 0.17 250)"
  warning: "oklch(0.56 0.14 80)"
  accent: "oklch(0.95 0.025 285)"
  accent-ink: "oklch(0.28 0.09 285)"
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
  label:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.5"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
spacing:
  control-xs: "1.25rem"
  control-sm: "1.5rem"
  control-md: "1.75rem"
  control-lg: "2.5rem"
  component: "1.25rem"
  page: "2.25rem"
components:
  button-default:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "0 0.5rem"
    height: "1.75rem"
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 0.5rem"
    height: "1.75rem"
  card-default:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1.25rem"
  input-default:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 0.5rem"
    height: "1.75rem"
---

# Design System: Coinflow Merchant Dashboard UI

## Overview

**Creative North Star: "Operator's Field Guide"**

This is a calm, exacting interface for a payment-operations workspace. It keeps the operational signal in the foreground: crisp text, white working surfaces, a narrow tonal range, and thin dividers do the organizing. Density is purposeful rather than austere—information stays close enough to scan quickly without making investigation feel compressed.

Figtree gives page titles a slightly more open, human cadence; Geist keeps controls, data, and dense records neutral and precise. Components remain visually quiet until state requires emphasis. Light lavender marks focus, selected records, and the primary chart relationship; it never competes with semantic success, warning, or failure signals.

**Key Characteristics:**
- Compact, desktop-first operational rhythm with responsive escape hatches.
- Tonal hierarchy through surfaces and borders before shadows.
- Semantic color is status-bearing; lavender marks selected context and primary trends.
- Rounded rectangles are soft enough to be approachable, never decorative.

## Colors

The palette is a quiet neutral ledger: near-white work surfaces, ink-black hierarchy, cool-gray structure, and clear semantic signals.

### Primary

- **Ledger Ink:** `colors.ink` drives primary text, solid actions, and the highest-contrast chart relationship.

### Secondary

- **Field Lavender:** `colors.accent` and `colors.accent-ink` establish keyboard focus, selected rows, and the navigation current state.
- **Lavender Trends:** `colors.chart-primary` and `colors.chart-secondary` distinguish the shared TanStack time-series tones without becoming page-level decoration.

### Tertiary

- **Operational Signals:** `colors.success`, `colors.info`, `colors.warning`, and `colors.danger` communicate record state through badges, validation, and charts.

### Neutral

- **Clean Canvas:** `colors.canvas` is the page, card, and popover foundation.
- **Muted Surface:** `colors.surface-muted` supports selected and low-priority background states.
- **Quiet Metadata:** `colors.text-muted` carries supporting text without competing with values.
- **Hairline Divider:** `colors.divider` separates dense information with minimal visual weight.

**The Signal-Only Color Rule.** Color earns its place by indicating a status, data series, focus, or selection; it is not used as ambient decoration.

## Typography

**Display Font:** Figtree Variable (with sans-serif fallback)

**Body Font:** Geist Variable (with sans-serif fallback)

**Character:** Figtree opens the top level of the hierarchy with confident but unshowy headings. Geist makes controls, labels, values, and supporting copy feel measured and legible at compact sizes.

### Hierarchy

- **Display** (600, 1.875rem, 1.25): page-level headings and high-level context.
- **Headline** (600, 1.5rem, 1.25): prominent numeric summaries and record titles.
- **Title** (600, 1.125rem, 1.375): card titles and secondary hierarchy.
- **Body** (400, 1rem, 1.625): explanatory content and standard application copy.
- **Label** (500, 0.75rem, 1.5): controls, table labels, tabs, and compact metadata.

**The Workmanlike Type Rule.** Use weight and tone to establish hierarchy before increasing size; large type belongs to page or summary moments, not routine controls.

## Layout

The application uses a fixed 18rem desktop navigation rail and a fluid content area. Page content uses 1.25rem padding on narrow screens and 2.25rem from the medium breakpoint; major sections use a 2rem gap, cards use 1rem–1.25rem gaps, and card interiors use 1rem–1.5rem padding. Dashboard metrics switch to three columns at the medium breakpoint; trend cards split into two columns at extra-large widths. Below the large breakpoint, navigation moves into a compact sticky header and drawer.

**The Scan-First Grid Rule.** A screen should reveal its current context, controls, and most important values before it asks the user to inspect secondary detail.

## Elevation & Depth

The system is flat with faint structural borders and subtle lift. Cards and data tables use a small shadow; overlays use a medium shadow plus a one-pixel tonal ring. Depth identifies containment and temporary layers rather than creating a floating-card aesthetic.

**The Structural Lift Rule.** Borders establish ordinary containment. Shadows are reserved for bounded surfaces that need separation from their immediate surroundings.

## Shapes

Controls use gently curved small or medium corners (0.375rem–0.5rem). Cards, data tables, and popovers use larger but still compact corners (0.625rem–0.875rem). Badges are fully pill-shaped. Borders are thin and low contrast; forms remain rectangular and direct rather than inflated or sculptural.

## Components

### Buttons

Restrained action controls with a compact text-first rhythm.

- **Shape:** medium corner radius (`rounded.md`); 1.75rem default height with 1.5rem and 2rem small/large alternatives.
- **Primary:** solid Ledger Ink with a Clean Canvas label.
- **Secondary / Outline / Ghost:** muted surface, hairline outline, or transparent background; each preserves readable ink text.
- **Hover / Focus:** hover shifts tonal fill; focus uses the ring token in a two-pixel, low-opacity halo.

### Cards / Containers

Quiet white containers for summaries, records, charts, and contextual detail.

- **Corner Style:** large to extra-large (`rounded.lg`–`rounded.xl`).
- **Background:** Clean Canvas with a softened Hairline Divider border.
- **Shadow Strategy:** small structural lift only.
- **Internal Padding:** 1rem, 1.25rem, or 1.5rem by density.

### Inputs / Fields

Compact, low-noise fields for filtering, searching, and data entry.

- **Style:** subdued fill, hairline border, and medium corner radius.
- **Focus:** ring and border resolve to the ring token; invalid fields resolve to danger.
- **Supporting Detail:** labels, descriptions, and errors occupy their own clear vertical rhythm.

### Navigation

The desktop rail is a quiet white workspace edge; the current item receives muted-surface fill and stronger weight. Navigation items use a 0.5rem corner radius, 0.75rem horizontal padding, and 0.625rem vertical padding. On smaller viewports it becomes an accessible navigation drawer from a sticky header.

### Data Tables

Tables are horizontally scrollable containers with the same rounded, bordered, subtly lifted treatment as cards. Rows separate with fine dividers, respond with muted hover fill, use semantic badges for dense status scanning, and use the lavender active-row state when a contextual detail drawer is open.

### Charts

`LineChart` is the shared TanStack Charts presentation. It exposes only semantic series tone, labeled numeric points, and a named height decision—product routes do not implement or style their own chart primitives.

### Badges

Badges are small, full-pill semantic markers. They use 10px medium-weight labels, 20px height, and low-opacity semantic fills rather than heavy solid labels.

## Do's and Don'ts

### Do:

- **Do** make data, status, and task completion the visual focal points.
- **Do** use thin borders and tonal contrast before adding elevation.
- **Do** reserve semantic hues for status, validation, and data relationships.
- **Do** preserve a compact responsive path from desktop rail to mobile navigation drawer.

### Don't:

- **Don't** use shadows as everyday ornament or stack multiple lifted containers.
- **Don't** apply saturated color to broad page surfaces without a meaningful state or data role.
- **Don't** expand routine controls into oversized, consumer-app forms.
- **Don't** make navigation or decorative treatment compete with record data.
