import type { ReactNode } from "react"
import * as P from "../private/tabs"
export interface TabItem {
  value: string
  label: string
  disabled?: boolean
  content?: ReactNode
}
export interface TabsProps {
  items: readonly TabItem[]
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "line"
  "data-testid"?: string
}
export function Tabs({
  items,
  label,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  variant = "default",
  "data-testid": testId,
}: TabsProps) {
  return (
    <P.Tabs
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(v) => onValueChange?.(String(v))}
      orientation={orientation}
      data-testid={testId}
    >
      <P.TabsList aria-label={label} variant={variant}>
        {items.map((item) => (
          <P.TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </P.TabsTrigger>
        ))}
      </P.TabsList>
      {items.map(
        (item) =>
          item.content !== undefined && (
            <P.TabsContent key={item.value} value={item.value}>
              <div className="mt-4 space-y-2">{item.content}</div>
            </P.TabsContent>
          )
      )}
    </P.Tabs>
  )
}
