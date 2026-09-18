import { cva } from "class-variance-authority"

export const selectTriggerVariants = cva(
  "flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs/relaxed whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      size: { sm: "h-6", md: "h-7", lg: "h-10 px-3 text-sm" },
      width: { auto: "", full: "w-full" },
    },
    defaultVariants: { size: "md", width: "auto" },
  }
)
