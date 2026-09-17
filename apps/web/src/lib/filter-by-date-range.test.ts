import { describe, expect, it } from "vitest"
import { filterByDateRange } from "./filter-by-date-range"

const records = [
  { createdAt: "2026-08-24T09:15:00Z", id: "before" },
  { createdAt: "2026-08-25T10:12:00Z", id: "start" },
  { createdAt: "2026-08-29T13:45:00Z", id: "end" },
  { createdAt: "2026-08-30T15:50:00Z", id: "after" },
]

describe("filterByDateRange", () => {
  it("includes records at both endpoints of a selected range", () => {
    expect(
      filterByDateRange(records, {
        from: new Date(2026, 7, 25),
        to: new Date(2026, 7, 29),
      }).map((record) => record.id)
    ).toEqual(["start", "end"])
  })

  it("leaves records untouched when no range has been selected", () => {
    expect(filterByDateRange(records, undefined)).toBe(records)
  })
})
