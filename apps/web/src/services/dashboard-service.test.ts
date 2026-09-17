import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { server } from "@/test/setup"
import { getDashboardOverview } from "./dashboard-service"

describe("getDashboardOverview", () => {
  it("rejects malformed API responses at the integration boundary", async () => {
    server.use(
      http.get("/api/dashboard/overview", () =>
        HttpResponse.json({ summaries: {} })
      )
    )

    await expect(
      getDashboardOverview({
        from: "2026-08-24",
        to: "2026-08-30",
        timezone: "utc",
        metric: "amount",
      })
    ).rejects.toThrow("Invalid dashboard overview response")
  })

  it("rejects a response with malformed nested dashboard data", async () => {
    server.use(
      http.get("/api/dashboard/overview", () =>
        HttpResponse.json({
          rangeLabel: "Aug 24 – Aug 30, 2026",
          summaries: {
            payments: "not-a-number",
            paymentCount: 1,
            newCustomers: 1,
            payouts: 1,
            payoutCount: 1,
          },
          paymentSeries: [],
          payoutSeries: [],
        })
      )
    )

    await expect(
      getDashboardOverview({
        from: "2026-08-24",
        to: "2026-08-30",
        timezone: "utc",
        metric: "amount",
      })
    ).rejects.toThrow("Invalid dashboard overview response")
  })
})
