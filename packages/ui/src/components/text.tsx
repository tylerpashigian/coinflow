import { createElement } from "react"
import { cn } from "cn"
export interface TextProps {
  children: string | number
  role?:
    | "paragraph"
    | "inline"
    | "caption"
    | "heading"
    | "emphasis"
    | "code"
    | "status"
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  variant?: "body" | "caption" | "subheading" | "heading"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  weight?: "regular" | "medium" | "semibold" | "bold"
  tone?: "default" | "muted" | "danger"
  align?: "left" | "center" | "right"
  truncate?: boolean
  casing?: "sentence" | "uppercase"
  id?: string
  "data-testid"?: string
}
const sizes = {
  xs: "text-xs leading-5",
  sm: "text-sm leading-5",
  md: "text-base leading-6",
  lg: "text-lg leading-6",
  xl: "text-2xl leading-8 tracking-[-0.02em]",
}
const weights = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
}
export function Text({
  children,
  role = "paragraph",
  headingLevel = 2,
  variant = "body",
  size,
  weight,
  tone = "default",
  align = "left",
  truncate = false,
  casing = "sentence",
  id,
  "data-testid": testId,
}: TextProps) {
  const element =
    role === "heading"
      ? `h${headingLevel}`
      : {
          paragraph: "p",
          inline: "span",
          caption: "p",
          emphasis: "em",
          code: "code",
          status: "p",
        }[role]
  return createElement(
    element,
    {
      role: role === "status" ? "status" : undefined,
      id,
      "data-testid": testId,
      "data-slot": "text",
      className: cn(
        sizes[
          size ??
            (variant === "heading"
              ? "xl"
              : variant === "caption" || role === "caption"
                ? "xs"
                : "sm")
        ],
        weights[
          weight ??
            (variant === "heading"
              ? "semibold"
              : variant === "subheading"
                ? "medium"
                : "regular")
        ],
        tone === "muted" && "text-muted-foreground",
        tone === "danger" && "text-destructive",
        align === "center" && "text-center",
        align === "right" && "text-right",
        truncate && "truncate",
        casing === "uppercase" && "tracking-wide uppercase"
      ),
    },
    children
  )
}
