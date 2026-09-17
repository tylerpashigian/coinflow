/** Client-side model for the admin overview and its query controls. */
export type DashboardMetric = "amount" | "count"
export type DashboardTimezone = "local" | "utc"

export type DashboardQuery = {
  from: string
  metric: DashboardMetric
  timezone: DashboardTimezone
  to: string
}

export type DashboardSeriesPoint = {
  amount: number
  count: number
  date: string
}

export type DashboardOverview = {
  rangeLabel: string
  summaries: {
    newCustomers: number
    paymentCount: number
    payments: number
    payoutCount: number
    payouts: number
  }
  paymentSeries: DashboardSeriesPoint[]
  payoutSeries: DashboardSeriesPoint[]
}
