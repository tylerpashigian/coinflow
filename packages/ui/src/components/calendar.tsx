import { useState } from "react"
import { Calendar as PrivateCalendar } from "../private/calendar"
export interface DateRange {
  from: Date | undefined
  to?: Date
}
export interface SingleCalendarProps {
  mode: "single"
  value?: Date
  defaultValue?: Date
  onValueChange?: (value: Date | undefined) => void
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  required?: boolean
  "aria-label"?: string
  "data-testid"?: string
}
export interface RangeCalendarProps {
  mode: "range"
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (value: DateRange | undefined) => void
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  required?: boolean
  "aria-label"?: string
  "data-testid"?: string
}
export type CalendarProps = SingleCalendarProps | RangeCalendarProps
export function Calendar(props: CalendarProps) {
  const [local, setLocal] = useState<Date | DateRange | undefined>(
    props.defaultValue
  )
  const value = Object.prototype.hasOwnProperty.call(props, "value")
    ? props.value
    : local
  const disabled = props.disabled
    ? true
    : [
        ...(props.minDate ? [{ before: props.minDate }] : []),
        ...(props.maxDate ? [{ after: props.maxDate }] : []),
      ]
  return (
    <div data-testid={props["data-testid"]}>
      {props.mode === "single" ? (
        <PrivateCalendar
          mode="single"
          selected={value as Date | undefined}
          onSelect={(next: Date | undefined) => {
            setLocal(next)
            props.onValueChange?.(next)
          }}
          month={props.month}
          defaultMonth={props.defaultMonth}
          onMonthChange={props.onMonthChange}
          disabled={disabled}
          required={props.required}
          aria-label={props["aria-label"]}
        />
      ) : (
        <PrivateCalendar
          mode="range"
          selected={value as DateRange | undefined}
          onSelect={(next: DateRange | undefined) => {
            setLocal(next)
            props.onValueChange?.(next)
          }}
          month={props.month}
          defaultMonth={props.defaultMonth}
          onMonthChange={props.onMonthChange}
          disabled={disabled}
          required={props.required}
          aria-label={props["aria-label"]}
        />
      )}
    </div>
  )
}
