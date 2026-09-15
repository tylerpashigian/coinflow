import { createElement, type ComponentPropsWithRef } from "react"
import { cn } from "cn"

const sizes = {
  xs: "text-xs leading-relaxed",
  sm: "text-sm leading-loose",
  md: "text-base leading-relaxed",
  lg: "text-lg leading-snug",
  xl: "text-2xl leading-tight",
} as const

const weights = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const

export type TextSize = keyof typeof sizes
export type TextWeight = keyof typeof weights
export type TextElement =
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "strong"
  | "em"
  | "small"
  | "label"
  | "code"
  | "kbd"

const variants = {
  body: { size: "sm", weight: "regular" },
  caption: { size: "xs", weight: "regular" },
  subheading: { size: "sm", weight: "medium" },
  heading: { size: "xl", weight: "semibold" },
} as const satisfies Record<string, { size: TextSize; weight: TextWeight }>

export type TextVariant = keyof typeof variants

type TextStyleProps = {
  variant?: TextVariant
  size?: TextSize
  weight?: TextWeight
  tone?: "default" | "muted" | "danger"
}

// Inference comes only from `as`, so other props cannot widen the element.
export type TextProps<Element extends TextElement = "p"> = TextStyleProps &
  (Element extends "p" ? { as?: Element } : { as: Element }) &
  Omit<ComponentPropsWithRef<NoInfer<Element>>, keyof TextStyleProps | "as">

export function Text<Element extends TextElement = "p">({
  as,
  variant = "body",
  size,
  weight,
  tone = "default",
  className,
  ...props
}: TextProps<Element>) {
  const defaults = variants[variant]
  return createElement(as ?? "p", {
    ...props,
    "data-slot": "text",
    className: cn(
      sizes[size ?? defaults.size],
      weights[weight ?? defaults.weight],
      tone === "muted" && "text-muted-foreground",
      tone === "danger" && "text-destructive",
      className
    ),
  })
}
