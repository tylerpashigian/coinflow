import type { ReactNode } from "react"
import { cn } from "cn"
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
  variant = "default",
  "data-testid": testId,
}: CardProps) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm",
        density === "compact" ? "p-4" : density === "spacious" ? "p-6" : "p-5"
      )}
    >
      {variant === "metric" ? (
        <div className="space-y-2">
          <Text tone="muted">{title ?? ""}</Text>
          <Text size="xl" weight="semibold">
            {summary ?? ""}
          </Text>
        </div>
      ) : variant === "record" ? (
        <div className="space-y-2">
          <Text size="xl" weight="semibold">
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
        <dl className="mt-2 space-y-2">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-center justify-between gap-3"
            >
              <dt className="text-sm leading-loose text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="text-right text-sm leading-loose font-medium">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {children && (
        <div className={cn((title || description || summary) && "mt-5")}>
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
