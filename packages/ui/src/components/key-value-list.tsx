import { Text } from "./text"

export interface KeyValueListItem {
  label: string
  value: string
}

export interface KeyValueListProps {
  title: string
  description?: string
  items: readonly KeyValueListItem[]
  "data-testid"?: string
}

/**
 * A compact, scan-first record section for detail drawers and inspection views.
 */
export function KeyValueList({
  title,
  description,
  items,
  "data-testid": testId,
}: KeyValueListProps) {
  return (
    <section
      data-testid={testId}
      className="rounded-xl border border-border bg-card p-4 text-card-foreground"
    >
      <div className="mb-3">
        <Text role="heading" headingLevel={3} weight="semibold">
          {title}
        </Text>
        {description && (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        )}
      </div>
      <dl className="divide-y divide-border/80">
        {items.map((item) => (
          <div
            className="flex items-baseline justify-between gap-5 py-2.5 first:pt-0 last:pb-0"
            key={`${item.label}-${item.value}`}
          >
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="text-right text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
