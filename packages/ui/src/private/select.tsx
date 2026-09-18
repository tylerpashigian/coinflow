import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UnfoldMoreIcon,
  Tick02Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { useFormFieldContext } from "../components/field-context"
import { selectTriggerVariants } from "../components/select-variants"

export type SelectProps = {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  name?: string
  required?: boolean
  items?: Record<string, React.ReactNode>
}
function Select({ onValueChange, ...props }: SelectProps) {
  return (
    <SelectPrimitive.Root
      {...props}
      onValueChange={(value) => {
        if (value !== null) onValueChange?.(value)
      }}
    />
  )
}

function SelectGroup({ children }: { children: React.ReactNode }) {
  return (
    <SelectPrimitive.Group data-slot="select-group" className="scroll-my-1 p-1">
      {children}
    </SelectPrimitive.Group>
  )
}
function SelectValue({ placeholder }: { placeholder?: string }) {
  return (
    <SelectPrimitive.Value
      placeholder={placeholder}
      data-slot="select-value"
      className="flex flex-1 text-left"
    />
  )
}
type SelectTriggerProps = {
  children: React.ReactNode
  id?: string
  disabled?: boolean
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  "aria-label"?: string
  "aria-labelledby"?: string
  "data-testid"?: string
  size?: "sm" | "md" | "lg"
  width?: "auto" | "full"
}
function SelectTrigger({
  size = "md",
  width = "auto",
  children,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: SelectTriggerProps) {
  const field = useFormFieldContext()
  const hasExplicitName =
    ariaLabel !== undefined || ariaLabelledBy !== undefined
  return (
    <SelectPrimitive.Trigger
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      aria-label={ariaLabel}
      aria-labelledby={hasExplicitName ? ariaLabelledBy : field?.labelledBy}
      data-slot="select-trigger"
      className={selectTriggerVariants({ size, width })}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <HugeiconsIcon
            icon={UnfoldMoreIcon}
            strokeWidth={2}
            className="pointer-events-none size-3.5 text-muted-foreground"
          />
        }
      />
    </SelectPrimitive.Trigger>
  )
}
type SelectContentProps = {
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
  align?: "start" | "center" | "end"
  alignOffset?: number
  alignItemWithTrigger?: boolean
}
function SelectContent({
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className="relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-closed:animate-out"
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}
function SelectLabel({ children }: { children: React.ReactNode }) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className="px-2 py-1.5 text-xs text-muted-foreground"
    >
      {children}
    </SelectPrimitive.GroupLabel>
  )
}
function SelectItem({
  children,
  ...props
}: {
  children: React.ReactNode
  value: string
  disabled?: boolean
}) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className="relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex items-center justify-center" />
        }
      >
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}
function SelectSeparator() {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className="pointer-events-none -mx-1 my-1 h-px bg-border/50"
    />
  )
}
function SelectScrollUpButton() {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className="top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1"
    >
      <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollUpArrow>
  )
}
function SelectScrollDownButton() {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className="bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1"
    >
      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollDownArrow>
  )
}
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
