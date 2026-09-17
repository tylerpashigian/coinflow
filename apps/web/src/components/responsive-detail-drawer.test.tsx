import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ResponsiveDetailDrawer } from "./responsive-detail-drawer"

function renderDetailDrawer(onOpenChange = vi.fn()) {
  render(
    <ResponsiveDetailDrawer
      description="Payment record and processing information."
      onOpenChange={onOpenChange}
      open
      title="Payment details"
    >
      Payment content
    </ResponsiveDetailDrawer>
  )

  return onOpenChange
}

describe("ResponsiveDetailDrawer", () => {
  it("shows a swipe handle on mobile", async () => {
    renderDetailDrawer()

    await screen.findByRole("dialog", { name: "Payment details" })
    expect(document.querySelector("[data-slot=drawer-swipe-handle]")).toBeVisible()
    expect(
      screen.queryByRole("button", { name: "Close payment details" })
    ).toBeNull()
  })

  it("shows a close button on desktop", async () => {
    const originalMatchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia")
    const mediaQuery = {
      addEventListener: () => undefined,
      matches: true,
      removeEventListener: () => undefined,
    } as unknown as MediaQueryList

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => mediaQuery,
    })

    try {
      const onOpenChange = renderDetailDrawer()
      const closeButton = await screen.findByRole("button", {
        name: "Close payment details",
      })

      expect(document.querySelector("[data-slot=drawer-swipe-handle]")).toBeNull()
      fireEvent.click(closeButton)
      await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
    } finally {
      if (originalMatchMedia) {
        Object.defineProperty(window, "matchMedia", originalMatchMedia)
      } else {
        delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia
      }
    }
  })
})
