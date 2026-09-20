import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { App } from "./App"
import { server } from "./test/setup"

function mockDesktopDatePickerViewport() {
  const originalMatchMedia = Object.getOwnPropertyDescriptor(
    window,
    "matchMedia"
  )

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) =>
      ({
        addEventListener: () => undefined,
        matches: query === "(min-width: 768px)",
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList,
  })

  return () => {
    if (originalMatchMedia) {
      Object.defineProperty(window, "matchMedia", originalMatchMedia)
    } else {
      delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia
    }
  }
}

describe("admin overview", () => {
  it("renders the dashboard from its mocked overview contract", async () => {
    render(<App />)

    expect(
      await screen.findByRole("heading", { name: "Operator overview" })
    ).toBeVisible()
    expect(screen.getAllByText("$92,936,698")).toHaveLength(2)
    expect(screen.getByText("Logged in as")).toBeVisible()
    expect(
      screen.getByRole("combobox", { name: "Merchant ID" })
    ).toHaveTextContent("Coinflow Admin")
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeVisible()
    expect(screen.getByText("⌘ K")).toBeVisible()
    expect(screen.getByRole("link", { name: "Purchases" })).toHaveAttribute(
      "href",
      "/purchases"
    )
    expect(
      screen.getByRole("img", { name: "payments amount activity trend" })
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

  it("provides the desktop sidebar content in an accessible mobile navigation drawer", async () => {
    render(<App />)

    await screen.findByRole("heading", { name: "Operator overview" })
    const menuTrigger = screen.getByRole("button", { name: "Open navigation" })
    expect(menuTrigger.closest("header")).toHaveClass("lg:hidden")
    expect(screen.getByText("Coinflow").closest("aside")).toHaveClass(
      "hidden",
      "lg:flex"
    )

    fireEvent.click(menuTrigger)
    const drawer = await screen.findByRole("dialog", { name: "Navigation" })

    expect(
      within(drawer).getByRole("combobox", { name: "Merchant ID" })
    ).toHaveTextContent("Coinflow Admin")
    expect(within(drawer).getByRole("searchbox", { name: "Search" })).toBeVisible()
    expect(within(drawer).getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(within(drawer).getByText("Logged in as")).toBeVisible()

    fireEvent.keyDown(document, { key: "Escape" })
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull()
    )
    expect(menuTrigger).toHaveFocus()

    fireEvent.click(menuTrigger)
    const reopenedDrawer = await screen.findByRole("dialog", {
      name: "Navigation",
    })
    fireEvent.click(within(reopenedDrawer).getByRole("link", { name: "Purchases" }))

    expect(
      await screen.findByRole("heading", { name: "Purchases" })
    ).toBeVisible()
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull()
    )
    expect(menuTrigger).toHaveFocus()

    fireEvent.click(menuTrigger)
    const homeDrawer = await screen.findByRole("dialog", { name: "Navigation" })
    fireEvent.click(within(homeDrawer).getByRole("link", { name: "Home" }))
    expect(
      await screen.findByRole("heading", { name: "Operator overview" })
    ).toBeVisible()
  })

  it("closes mobile navigation when the viewport reaches the desktop breakpoint", async () => {
    const originalMatchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia")
    const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>()
    const matches = new Map([
      ["(max-width: 1023px)", true],
      ["(min-width: 1024px)", false],
    ])

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) => ({
        addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
          const queryListeners = listeners.get(query) ?? new Set()
          queryListeners.add(listener)
          listeners.set(query, queryListeners)
        },
        get matches() {
          return matches.get(query) ?? false
        },
        media: query,
        removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.get(query)?.delete(listener),
      }) as MediaQueryList,
    })

    try {
      render(<App />)
      await screen.findByRole("heading", { name: "Operator overview" })
      fireEvent.click(screen.getByRole("button", { name: "Open navigation" }))
      expect(
        await screen.findByRole("dialog", { name: "Navigation" })
      ).toBeVisible()

      act(() => {
        matches.set("(max-width: 1023px)", false)
        matches.set("(min-width: 1024px)", true)
        listeners.forEach((queryListeners, query) => {
          const queryMatches = matches.get(query) ?? false
          queryListeners.forEach((listener) =>
            listener({ matches: queryMatches, media: query } as MediaQueryListEvent)
          )
        })
      })

      await waitFor(() =>
        expect(screen.queryByRole("dialog", { name: "Navigation" })).toBeNull()
      )
    } finally {
      if (originalMatchMedia) {
        Object.defineProperty(window, "matchMedia", originalMatchMedia)
      } else {
        delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia
      }
    }
  })

  it("switches chart metrics and requests a different timezone", async () => {
    const queries: string[] = []
    server.use(
      http.get("/api/dashboard/overview", ({ request }) => {
        const url = new URL(request.url)
        queries.push(url.search)
        return HttpResponse.json({
          rangeLabel:
            url.searchParams.get("from") === "2026-08-17"
              ? "Aug 17 – Aug 23, 2026"
              : "Aug 24 – Aug 30, 2026",
          summaries: {
            payments: 100_00,
            paymentCount: 10,
            newCustomers: 1,
            payouts: 50_00,
            payoutCount: 5,
          },
          paymentSeries: [],
          paymentBreakdown: [],
          payoutSeries: [],
          payoutBreakdown: [],
        })
      })
    )
    render(<App />)

    await screen.findByRole("img", { name: "payments amount activity trend" })
    fireEvent.click(screen.getByRole("tab", { name: "Local" }))
    await waitFor(() =>
      expect(queries.some((query) => query.includes("timezone=local"))).toBe(
        true
      )
    )
    fireEvent.click(screen.getAllByRole("tab", { name: "Count" })[0])
    fireEvent.click(screen.getByRole("combobox", { name: "Date range" }))
    fireEvent.click(
      await screen.findByRole("option", { name: "Aug 17 – Aug 23, 2026" })
    )

    expect(
      await screen.findByRole("img", { name: "payments count activity trend" })
    ).toBeVisible()
    expect(screen.getByText("10")).toBeVisible()
    fireEvent.click(screen.getByRole("tab", { name: "Payouts" }))
    expect(
      await screen.findByRole("img", { name: "payouts count activity trend" })
    ).toBeVisible()
    expect(screen.getByText("5")).toBeVisible()
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

  it("navigates to operations tables and opens their selected-record drawers", async () => {
    const restoreMatchMedia = mockDesktopDatePickerViewport()

    try {
      render(<App />)

      fireEvent.click(await screen.findByRole("link", { name: "Purchases" }))
      expect(
        await screen.findByRole("heading", { name: "Purchases" })
      ).toBeVisible()
      const purchasesDateFilter = screen.getByRole("button", {
        name: "Purchase date range",
      })
      expect(purchasesDateFilter).toBeVisible()
      fireEvent.click(purchasesDateFilter)
      expect(await screen.findAllByRole("grid")).toHaveLength(2)
      fireEvent.keyDown(document, { key: "Escape" })
      expect(screen.getByRole("link", { name: "Purchases" })).toHaveAttribute(
        "aria-current",
        "page"
      )
      const purchaseRows = await screen.findAllByRole("row")
      expect(purchaseRows[1]).toHaveTextContent("pay_8X4P")
      fireEvent.click(screen.getByRole("button", { name: /Date/ }))
      await waitFor(() =>
        expect(screen.getAllByRole("row")[1]).toHaveTextContent("pay_5C9K")
      )
      fireEvent.click(await screen.findByText("pay_8X4P"))
      expect(await screen.findByText("Payment details")).toBeVisible()
      expect(await screen.findByText("Visa •••• 4242")).toBeVisible()
      expect(window.location.pathname).toBe("/purchases/pay_8X4P")

      fireEvent.keyDown(document, { key: "Escape" })
      await waitFor(() => expect(window.location.pathname).toBe("/purchases"))
      fireEvent.click(await screen.findByRole("link", { name: "Customers" }))
      expect(
        await screen.findByRole("heading", { name: "Customers" })
      ).toBeVisible()
      expect(
        screen.getByRole("button", { name: "Customer date range" })
      ).toBeVisible()
      fireEvent.click(await screen.findByText("Nova Bennett"))
      expect(await screen.findByText("Customer details")).toBeVisible()
      expect(window.location.pathname).toBe("/customers/cus_nova")
      fireEvent.click(screen.getByRole("tab", { name: "Methods" }))
      expect(await screen.findByText("Card · Visa")).toBeVisible()
      expect(screen.getByText("•••• 4242")).toBeVisible()
    } finally {
      restoreMatchMedia()
    }
  })
})
