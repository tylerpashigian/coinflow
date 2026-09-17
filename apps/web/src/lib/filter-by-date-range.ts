import type { DateRange } from "@workspace/ui/components/date-range-picker"

type DatedRecord = { createdAt: string }

/** Filters ISO timestamps inclusively using the calendar dates selected by the user. */
export function filterByDateRange<T extends DatedRecord>(
  records: T[],
  range: DateRange | undefined
) {
  if (!range?.from) return records

  const from = new Date(range.from)
  from.setHours(0, 0, 0, 0)
  const to = range.to ? new Date(range.to) : undefined
  to?.setHours(23, 59, 59, 999)

  return records.filter((record) => {
    const createdAt = new Date(record.createdAt)
    return createdAt >= from && (!to || createdAt <= to)
  })
}
