import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { App } from "./App"
import { server } from "./test/setup"

describe("admin overview", () => {
  it("renders the dashboard from its mocked overview contract", async () => {
    render(<App />)

    expect(
      await screen.findByRole("heading", { name: "Overview" })
    ).toBeVisible()
    expect(screen.getAllByText("$92,936,698")).toHaveLength(2)
    expect(screen.getByText("Logged in as")).toBeVisible()
    expect(
      screen.getByRole("combobox", { name: "Merchant ID" })
    ).toHaveTextContent("Coinflow Admin")
    expect(screen.getByPlaceholderText("Search")).toBeVisible()
    expect(screen.getByText("⌘ K")).toBeVisible()
    expect(screen.getByRole("button", { name: "Purchases" })).toBeDisabled()
    expect(
      screen.getByRole("img", { name: "Payments amount trend" })
    ).toBeVisible()
  })

  it("renders an overridden user scenario from the shared builder", async () => {
    server.use(
      http.get("/api/user", () =>
        HttpResponse.json({
          id: "usr_jordan",
          name: "Jordan Lee",
          email: "jordan@example.test",
        })
      )
    )
    render(<App />)

    expect(await screen.findByText("Jordan Lee")).toBeVisible()
  })

  it("focuses global search with the Mod+K shortcut", async () => {
    render(<App />)

    const search = await screen.findByPlaceholderText("Search")
    fireEvent.keyDown(document, { ctrlKey: true, key: "k" })

    expect(search).toHaveFocus()
  })

  it("switches chart metrics and requests a different timezone", async () => {
    const queries: string[] = []
    server.use(
      http.get("/api/dashboard/overview", ({ request }) => {
        queries.push(new URL(request.url).search)
        return HttpResponse.json({
          rangeLabel: "Aug 24 – Aug 30, 2026",
          summaries: {
            payments: 100_00,
            paymentCount: 10,
            newCustomers: 1,
            payouts: 50_00,
            payoutCount: 5,
          },
          paymentSeries: [],
          payoutSeries: [],
        })
      })
    )
    render(<App />)

    await screen.findByRole("img", { name: "Payments amount trend" })
    fireEvent.click(screen.getByRole("tab", { name: "Local" }))
    await waitFor(() =>
      expect(queries.some((query) => query.includes("timezone=local"))).toBe(
        true
      )
    )
    fireEvent.click(screen.getAllByRole("tab", { name: "Count" })[0])
    fireEvent.change(screen.getByRole("combobox", { name: "Date range" }), {
      target: { value: "previous" },
    })

    expect(
      await screen.findByRole("img", { name: "Payments count trend" })
    ).toBeVisible()
    expect(screen.getByText("10")).toBeVisible()
    expect(await screen.findByText("Aug 17 – Aug 23, 2026")).toBeVisible()
  })

  it("shows a helpful error if the overview request fails", async () => {
    server.use(
      http.get(
        "/api/dashboard/overview",
        () => new HttpResponse(null, { status: 500 })
      )
    )
    render(<App />)
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load dashboard overview."
    )
  })
})
