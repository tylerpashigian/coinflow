import type { DashboardOverview } from "@/data/models/dashboard"

export const dashboardOverview: DashboardOverview = {
  rangeLabel: "Aug 24 – Aug 30, 2026",
  summaries: {
    payments: 92_936_697_83,
    paymentCount: 3_228,
    newCustomers: 290_547,
    payouts: 44_620_041_12,
    payoutCount: 1_332,
  },
  paymentSeries: [
    [24, 12.4, 402],
    [25, 13.1, 439],
    [26, 14.2, 476],
    [27, 14.8, 492],
    [28, 17.7, 580],
    [29, 14.3, 451],
    [30, 11.8, 388],
  ].map(([day, amount, count]) => ({
    date: `2026-08-${day}`,
    amount: Math.round(amount * 100_000_000),
    count,
  })),
  payoutSeries: [
    [24, 4.8, 181],
    [25, 4.5, 169],
    [26, 4.9, 193],
    [27, 5.2, 208],
    [28, 5.4, 216],
    [29, 5.1, 201],
    [30, 4.2, 164],
  ].map(([day, amount, count]) => ({
    date: `2026-08-${day}`,
    amount: Math.round(amount * 100_000_000),
    count,
  })),
}
