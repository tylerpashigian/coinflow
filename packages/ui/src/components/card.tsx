import type { HTMLAttributes } from "react"
import { cn } from "cn"

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}
