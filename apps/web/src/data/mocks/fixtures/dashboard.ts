import type { DashboardOverview } from "@/data/models/dashboard"

const paymentSeries = [
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
}))

const payoutSeries = [
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
}))

function breakdown(
  series: typeof paymentSeries,
  definitions: readonly {
    id: string
    label: string
    shares: readonly number[]
  }[]
) {
  return definitions.map(({ id, label, shares }) => ({
    id,
    label,
    points: series.map((point, index) => ({
      ...point,
      amount: Math.round(point.amount * shares[index]),
      count: Math.round(point.count * shares[index]),
    })),
  }))
}

export const dashboardOverview: DashboardOverview = {
  rangeLabel: "Aug 24 – Aug 30, 2026",
  summaries: {
    payments: 92_936_697_83,
    paymentCount: 3_228,
    newCustomers: 290_547,
    payouts: 44_620_041_12,
    payoutCount: 1_332,
  },
  paymentSeries,
  paymentBreakdown: breakdown(paymentSeries, [
    {
      id: "card",
      label: "Card",
      shares: [0.52, 0.5, 0.55, 0.49, 0.53, 0.51, 0.48],
    },
    {
      id: "bank",
      label: "Bank",
      shares: [0.27, 0.29, 0.24, 0.3, 0.26, 0.28, 0.31],
    },
    {
      id: "crypto",
      label: "Crypto",
      shares: [0.14, 0.13, 0.14, 0.15, 0.13, 0.14, 0.13],
    },
    {
      id: "wallet",
      label: "Wallet",
      shares: [0.07, 0.08, 0.07, 0.06, 0.08, 0.07, 0.08],
    },
  ]),
  payoutSeries,
  payoutBreakdown: breakdown(payoutSeries, [
    {
      id: "standard",
      label: "Standard",
      shares: [0.47, 0.44, 0.49, 0.46, 0.45, 0.48, 0.43],
    },
    {
      id: "same-day",
      label: "Same day",
      shares: [0.3, 0.32, 0.28, 0.31, 0.33, 0.29, 0.34],
    },
    {
      id: "rtp",
      label: "ASAP (RTP)",
      shares: [0.15, 0.16, 0.15, 0.14, 0.14, 0.16, 0.15],
    },
    {
      id: "card",
      label: "Card",
      shares: [0.08, 0.08, 0.08, 0.09, 0.08, 0.07, 0.08],
    },
  ]),
}
