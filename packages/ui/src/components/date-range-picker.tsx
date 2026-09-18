import { registerFieldControl } from "../private/field-controls"
import { useRef, useState } from "react"
import { Popover } from "@base-ui/react/popover"
import { format } from "date-fns"
import { Calendar } from "../private/calendar"
import { Icon } from "../private/icons"
import { useMediaQuery } from "../private/use-media-query"
import { useFormFieldContext } from "./field-context"
import { inputVariants } from "./input-variants"
import { Button } from "./button"
import type { DateRange } from "./calendar"
export type { DateRange } from "./calendar"
export interface DateRangePickerProps {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  defaultMonth?: Date
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  id?: string
  name?: string
  disabled?: boolean
  required?: boolean
  size?: "sm" | "md" | "lg"
  "aria-describedby"?: string
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling"
  "aria-label"?: string
  "aria-labelledby"?: string
  "data-testid"?: string
}
export function DateRangePicker(props: DateRangePickerProps) {
  const [local, setLocal] = useState(props.defaultValue)
  const value = Object.prototype.hasOwnProperty.call(props, "value")
    ? props.value
    : local
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [validationAttempted, setValidationAttempted] = useState(false)
  const complete = Boolean(value?.from && value?.to)
  const field = useFormFieldContext()
  const wide = useMediaQuery("(min-width: 768px)")
  const label = value?.from
    ? `${format(value.from, "MMM d, yyyy")} –${value.to ? ` ${format(value.to, "MMM d, yyyy")}` : ""}`
    : (props.placeholder ?? "Filter by date")
  const change = (next: DateRange | undefined) => {
    setLocal(next)
    props.onValueChange?.(next)
  }
  return (
    <Popover.Root>
      <Popover.Trigger
        ref={triggerRef}
        id={props.id ?? field?.controlId}
        disabled={props.disabled}
        aria-required={props.required}
        aria-describedby={props["aria-describedby"] ?? field?.describedBy}
        aria-invalid={
          props["aria-invalid"] ??
          (field?.invalid ||
            (props.required && validationAttempted && !complete) ||
            undefined)
        }
        aria-label={props["aria-label"] ?? (field ? undefined : "Date range")}
        aria-labelledby={
          props["aria-label"] || props["aria-labelledby"]
            ? props["aria-labelledby"]
            : field?.labelledBy
        }
        data-testid={props["data-testid"]}
        className={`${inputVariants({ size: props.size ?? "md" })} flex items-center gap-2 text-left`}
      >
        <Icon name="calendar" />
        <span className={value?.from ? undefined : "text-muted-foreground"}>
          {label}
        </span>
      </Popover.Trigger>
      {(props.name || props.required) && (
        <input
          type="text"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          name={props.name}
          required={props.required}
          disabled={props.disabled}
          value={
            value?.from && value.to
              ? `${format(value.from, "yyyy-MM-dd")}/${format(value.to, "yyyy-MM-dd")}`
              : ""
          }
          onChange={() => {}}
          onInvalid={(event) => {
            event.preventDefault()
            setValidationAttempted(true)
            triggerRef.current?.focus()
          }}
        />
      )}
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="start"
          sideOffset={4}
          className="z-50"
        >
          <Popover.Popup className="max-w-[calc(100vw-1rem)] rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
            <Popover.Title className="sr-only">Choose date range</Popover.Title>
            <Calendar
              mode="range"
              selected={value}
              onSelect={change}
              defaultMonth={props.defaultMonth}
              numberOfMonths={wide ? 2 : 1}
              required={props.required}
              disabled={[
                ...(props.minDate ? [{ before: props.minDate }] : []),
                ...(props.maxDate ? [{ after: props.maxDate }] : []),
              ]}
            />
            {value?.from && !props.required && (
              <div className="flex justify-end border-t p-2">
                <Button
                  label="Clear dates"
                  variant="ghost"
                  size="sm"
                  onPress={() => change(undefined)}
                />
              </div>
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

registerFieldControl(DateRangePicker)
