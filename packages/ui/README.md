# UI boundary

Product code chooses content, state, behavior, and documented named decisions.
The UI package owns markup, styling, icons, primitive configuration, positioning,
focus management, and responsive component behavior.

## Composition

- Import only explicit `@workspace/ui/components/...` entries and the single
  `@workspace/ui/globals.css` stylesheet. Source paths and private adapters are not APIs.
- Do not spread props onto UI components. Do not pass styling, DOM events,
  arbitrary attributes, custom renderers, formatters, slot replacements, or DOM refs.
- Button, Badge, Text, labels, option labels, titles, and keyboard hints accept
  scalar content. Card bodies, Drawer/Popover bodies, and tab panels accept content.
  Product wrappers in those regions may arrange page/grid/spacing layout, without
  targeting descendants or changing the inherited visual treatment of UI.
- FormField accepts exactly one direct Input, Select, or DateRangePicker child.
  Its private context supplies the generated/explicit control ID, label, helper
  association, and invalid state. Explicit ARIA metadata takes precedence.
- Input's `focusHandle` exposes only `focus()`. It never exposes the input element.
  Overlay focus restoration stays inside UI; navigation drawers can initially focus
  their search control via `initialFocus="search"`.
- New visual decisions require an explicit named API, documentation, contract
  coverage, behavior tests where relevant, and reviewed browser screenshots.

## Named decisions

| Area       | Supported decisions                                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controls   | `sm`, `md`, `lg`; named icons; value callbacks; disabled/required state                                                                               |
| Typography | semantic role and heading level; size, weight, tone, alignment, truncation, casing                                                                    |
| Cards      | compact/comfortable/spacious density; default/metric/record structure; title, description, summary, details, body, footer, optional metric icon       |
| Detail lists | named title, optional description, and scan-first key/value rows for record investigation                                                                 |
| Tables     | column label/alignment/sortability; compact/comfortable density; raw sort values; row activation by ID; leading-column pinning and contextual overflow cue; none/single/multiple selection; empty message |
| Drawers    | detail (bottom below 768px, right above) or navigation (left below 1024px); density, header visibility, content/search focus                          |
| Popovers   | above/below/start/end placement; density, header visibility; semantic trigger/footer actions                                                          |
| Dates      | single/range selection, initial/controlled month, bounds; responsive date-range picker with one/two months                                            |
| Charts     | named single or multi-series data; automatic legend; five semantic series tones; point labels and numeric values                                      |

Table rows contain ordered cells corresponding to the columns. Each cell has
`text`, optional `sortValue`, and an optional semantic badge variant. The product
adapter owns domain formatting; it does not receive rendering callbacks. Sorting
is stable and cycles initial direction, reverse direction, then unsorted. Sorting
and selection can be controlled or uncontrolled. Selection clicks/keys never
activate the row. Disabled rows cannot activate or change selection.

Native anchors remain anchors: ordinary navigation invokes `onNavigate(href)`;
modified clicks retain browser behavior. Disabled navigation has no destination.

Date ranges use local calendar dates. A named DateRangePicker submits a complete
range as `yyyy-MM-dd/yyyy-MM-dd`; an incomplete range submits an empty value.
Required ranges participate in native form validation, focus the visible trigger
on failure, and cannot be cleared. Bounds disable unsupported day selection.

## Export audit

The inventory below is generated from package exports and checked against the
external-consumer contract specimens in `tests/contracts.test.mjs`.

| Entry                          | Public component | Approved prop names                                                                                                                                                                                                                                     |
| ------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ./components/button            | Button           | `label`, `icon`, `iconOnly`, `variant`, `size`, `type`, `onPress`, `disabled`, `id`, `name`, `aria-describedby`, `data-testid`                                                                                                                          |
| ./components/badge             | Badge            | `children`, `variant`, `aria-label`, `aria-labelledby`, `id`, `data-testid`                                                                                                                                                                             |
| ./components/card              | Card             | `children`, `density`, `title`, `description`, `summary`, `footer`, `details`, `metricIcon`, `variant`, `data-testid`                                                                                                                                   |
| ./components/data-table        | DataTable        | `ariaLabel`, `columns`, `rows`, `density`, `emptyMessage`, `onRowActivate`, `sorting`, `defaultSorting`, `onSortingChange`, `selection`, `selectedIds`, `defaultSelectedIds`, `activeRowId`, `pinLeadingColumn`, `overflowHint`, `onSelectionChange`, `data-testid` |
| ./components/date-range-picker | DateRangePicker  | `value`, `defaultValue`, `onValueChange`, `defaultMonth`, `minDate`, `maxDate`, `placeholder`, `id`, `name`, `disabled`, `required`, `size`, `aria-describedby`, `aria-invalid`, `aria-label`, `aria-labelledby`, `data-testid`                         |
| ./components/drawer            | Drawer           | `children`, `title`, `description`, `open`, `defaultOpen`, `onOpenChange`, `trigger`, `actions`, `placement`, `density`, `size`, `headerVisibility`, `initialFocus`, `data-testid`                                                                      |
| ./components/field             | FormField        | `children`, `description`, `error`, `label`, `labelVisuallyHidden`, `orientation`, `data-testid`                                                                                                                                                        |
| ./components/input             | Input            | `id`, `name`, `value`, `defaultValue`, `placeholder`, `type`, `disabled`, `required`, `readOnly`, `onValueChange`, `focusHandle`, `aria-describedby`, `aria-invalid`, `aria-label`, `aria-labelledby`, `data-testid`, `size`, `leadingIcon`, `shortcut` |
| ./components/key-value-list    | KeyValueList     | `title`, `description`, `items`, `data-testid`                                                                                                                                                                                                         |
| ./components/kbd               | Kbd              | `children`, `data-testid`                                                                                                                                                                                                                               |
| ./components/line-chart        | LineChart        | `ariaLabel`, `tone`, `data`, `series`, `height`                                                                                                                                                                                                         |
| ./components/calendar          | Calendar         | `mode`, `value`, `defaultValue`, `onValueChange`, `month`, `defaultMonth`, `onMonthChange`, `minDate`, `maxDate`, `disabled`, `required`, `aria-label`, `data-testid`                                                                                   |
| ./components/popover           | Popover          | `children`, `title`, `description`, `trigger`, `actions`, `open`, `defaultOpen`, `onOpenChange`, `placement`, `density`, `headerVisibility`, `data-testid`                                                                                              |
| ./components/select            | Select           | `options`, `value`, `defaultValue`, `onValueChange`, `placeholder`, `disabled`, `required`, `name`, `id`, `size`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `data-testid`                                                    |
| ./components/tabs              | Tabs             | `items`, `label`, `value`, `defaultValue`, `onValueChange`, `orientation`, `variant`, `data-testid`                                                                                                                                                     |
| ./components/text              | Text             | `children`, `role`, `headingLevel`, `variant`, `size`, `weight`, `tone`, `align`, `truncate`, `casing`, `id`, `data-testid`                                                                                                                             |
| ./components/navigation-item   | NavigationItem   | `label`, `icon`, `href`, `current`, `disabled`, `onNavigate`, `data-testid`                                                                                                                                                                             |

Public supporting types: `ButtonProps`, `BadgeVariant`, `BadgeProps`, `CardDetail`, `CardProps`, `KeyValueListItem`, `KeyValueListProps`, `TableCellValue`, `TableColumn`, `TableRowData`, `TableSort`, `DataTableProps`, `DateRange`, `DateRangePickerProps`, `OverlayAction`, `OverlayTrigger`, `DrawerProps`, `FormFieldProps`, `FocusHandle`, `InputProps`, `KbdProps`, `LineChartPoint`, `LineChartSeries`, `LineChartTone`, `LineChartProps`, `SingleCalendarProps`, `RangeCalendarProps`, `CalendarProps`, `PopoverProps`, `SelectOption`, `SelectProps`, `TabItem`, `TabsProps`, `TextProps`, `NavigationItemProps`.

`globals.css` is the only non-TypeScript export. It supplies the UI-owned theme and component styling.

Removed public surfaces: Table and all table parts; Label; Separator;
KbdGroup; Select parts; Tabs parts; Drawer portal/backdrop/swipe handle and
composition parts; Popover composition parts; CalendarDayButton; polymorphic
TextElement/TextProps; primitive PublicProps/variant contracts; TanStack column,
sorting, and updater types. Checkbox remains private. Public compound names were
replaced with high-level components at their existing documented entry paths.
