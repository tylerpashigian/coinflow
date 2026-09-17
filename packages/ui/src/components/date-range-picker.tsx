import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { useFormFieldContext } from "./field-context"

type DateRangePickerProps = {
  "aria-describedby"?: React.AriaAttributes["aria-describedby"]
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  "aria-label"?: React.AriaAttributes["aria-label"]
  "aria-labelledby"?: React.AriaAttributes["aria-labelledby"]
  defaultMonth?: Date
  id?: string
  onValueChange: (range: DateRange | undefined) => void
  placeholder?: string
  value: DateRange | undefined
}

function formatDateRange(range: DateRange | undefined) {
  if (!range?.from) return null
  if (!range.to) return `${format(range.from, "MMM d, yyyy")} –`
  return `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
}

/** A controlled date-range picker composed from the shared popover and calendar. */
export function DateRangePicker({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabelProp,
  "aria-labelledby": ariaLabelledBy,
  defaultMonth,
  id,
  onValueChange,
  placeholder = "Filter by date",
  value,
}: DateRangePickerProps) {
  const field = useFormFieldContext()
  const label = formatDateRange(value)
  const hasExplicitName = ariaLabelProp !== undefined || ariaLabelledBy !== undefined

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            id={id ?? field?.controlId}
            aria-describedby={ariaDescribedBy ?? field?.describedBy}
            aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
            aria-label={ariaLabelProp ?? (field ? undefined : "Date range")}
            aria-labelledby={hasExplicitName ? ariaLabelledBy : field?.labelledBy}
            className="w-full justify-start text-left font-normal sm:w-64"
            variant="outline"
          />
        }
      >
        <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
        <span className={label ? undefined : "text-muted-foreground"}>
          {label ?? placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto gap-0 p-0">
        <Calendar
          mode="range"
          defaultMonth={defaultMonth}
          numberOfMonths={2}
          onSelect={onValueChange}
          selected={value}
        />
        {value?.from ? (
          <div className="flex justify-end border-t p-2">
            <Button onClick={() => onValueChange(undefined)} size="sm" variant="ghost">
              Clear dates
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export type { DateRange }
import * as React from "react"
