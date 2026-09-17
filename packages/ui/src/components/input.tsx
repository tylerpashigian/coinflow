import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

type InputProps = React.ComponentProps<"input"> & {
  /** Optional leading content, such as a search or field-type icon. */
  leftComponent?: React.ReactNode
  /** Optional trailing content, such as a keyboard shortcut or status icon. */
  rightComponent?: React.ReactNode
}

function Input({
  className,
  leftComponent,
  rightComponent,
  type,
  ...props
}: InputProps) {
  const input = (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
        leftComponent && "pl-8",
        rightComponent && "pr-8"
      )}
      {...props}
    />
  )

  if (!leftComponent && !rightComponent) {
    return input
  }

  return (
    <div className="relative flex w-full items-center">
      {input}
      {leftComponent ? (
        <span className="pointer-events-none absolute left-2 flex items-center text-muted-foreground">
          {leftComponent}
        </span>
      ) : null}
      {rightComponent ? (
        <span className="pointer-events-none absolute right-2 flex items-center text-muted-foreground">
          {rightComponent}
        </span>
      ) : null}
    </div>
  )
}

export { Input }
