import type {
  DashboardSeriesPoint,
  DashboardOverview,
  DashboardQuery,
} from "@/data/models/dashboard"

/**
 * This assessment uses mock responses shaped like client models. In a production
 * integration, this layer would keep network DTOs separate from canonical client
 * models and map validated responses explicitly before returning them to hooks.
 * That isolates API-version changes, inconsistent backend naming, and transport
 * concerns from the UI-facing model.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isSeriesPoint(value: unknown): value is DashboardSeriesPoint {
  return (
    isRecord(value) &&
    typeof value.date === "string" &&
    isNumber(value.amount) &&
    isNumber(value.count)
  )
}

function isDashboardOverview(value: unknown): value is DashboardOverview {
  if (!isRecord(value) || !isRecord(value.summaries)) return false

  const { summaries } = value
  return (
    typeof value.rangeLabel === "string" &&
    isNumber(summaries.newCustomers) &&
    isNumber(summaries.paymentCount) &&
    isNumber(summaries.payments) &&
    isNumber(summaries.payoutCount) &&
    isNumber(summaries.payouts) &&
    Array.isArray(value.paymentSeries) &&
    value.paymentSeries.every(isSeriesPoint) &&
    Array.isArray(value.payoutSeries) &&
    value.payoutSeries.every(isSeriesPoint)
  )
}

export async function getDashboardOverview(
  query: DashboardQuery
): Promise<DashboardOverview> {
  const parameters = new URLSearchParams({
    from: query.from,
    to: query.to,
    timezone: query.timezone,
  })
  const response = await fetch(`/api/dashboard/overview?${parameters}`)
  if (!response.ok) throw new Error("Unable to load dashboard overview")
  const data: unknown = await response.json()
  if (!isDashboardOverview(data)) {
    throw new Error("Invalid dashboard overview response")
  }
  return data as DashboardOverview
}
