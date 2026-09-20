import type { ReactNode } from "react"
import { cn } from "cn"
import { Icon, type IconName } from "../private/icons"
import { Text } from "./text"
export interface CardDetail {
  label: string
  value: string
}
export interface CardProps {
  children?: ReactNode
  density?: "compact" | "comfortable" | "spacious"
  title?: string
  description?: string
  summary?: string
  footer?: string
  details?: readonly CardDetail[]
  /** A system icon that differentiates an otherwise comparable metric. */
  metricIcon?: IconName
  variant?: "default" | "metric" | "record"
  "data-testid"?: string
}
export function Card({
  children,
  density = "comfortable",
  title,
  description,
  summary,
  footer,
  details,
  metricIcon,
  variant = "default",
  "data-testid": testId,
}: CardProps) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground",
        density === "compact" ? "p-4" : density === "spacious" ? "p-6" : "p-5"
      )}
    >
      {variant === "metric" ? (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <Text tone="muted">{title ?? ""}</Text>
            <Text size="xl" weight="semibold">
              {summary ?? ""}
            </Text>
          </div>
          {metricIcon && (
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Icon name={metricIcon} />
            </div>
          )}
        </div>
      ) : variant === "record" ? (
        <div className="space-y-2">
          <Text size="lg" weight="semibold">
            {summary ?? ""}
          </Text>
          {description && <Text tone="muted">{description}</Text>}
        </div>
      ) : (
        (title || description || summary) && (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              {title && (
                <Text role="heading" headingLevel={3} weight="semibold">
                  {title}
                </Text>
              )}
              {description && (
                <Text variant="caption" tone="muted">
                  {description}
                </Text>
              )}
            </div>
            {summary && (
              <Text size="lg" weight="semibold">
                {summary ?? ""}
              </Text>
            )}
          </div>
        )
      )}
      {details && (
        <dl className="mt-3 space-y-1">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center justify-between gap-3"
            >
              <dt className="text-sm leading-5 text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="text-right text-sm leading-5 font-medium">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {children && (
        <div className={cn((title || description || summary) && "mt-4")}>
          {children}
        </div>
      )}
      {footer && (
        <div className="mt-2">
          <Text variant="caption" tone="muted">
            {footer}
          </Text>
        </div>
      )}
    </div>
  )
}
