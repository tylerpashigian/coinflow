import { cva } from "class-variance-authority"

export const inputVariants = cva(
  "w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-6",
        md: "h-7",
        lg: "h-10 px-3 text-sm",
      },
      hasLeadingContent: { false: "", true: "pl-8" },
      hasTrailingContent: { false: "", true: "pr-8" },
    },
    defaultVariants: {
      size: "md",
      hasLeadingContent: false,
      hasTrailingContent: false,
    },
  }
)
