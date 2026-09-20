import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { paymentBuilder } from "@/data/mocks/builders/payment-builder"
import { PaymentDetails } from "./payment-details"

const { notify } = vi.hoisted(() => ({ notify: vi.fn() }))

vi.mock("@workspace/ui/components/toast", () => ({ notify }))

const payment = paymentBuilder({
  id: "pay_8X4P",
  customerId: "cus_nova",
  customerName: "Nova Bennett",
  status: "settled",
  transactionReference: "txn_8X4P",
}).build()

function renderDetails(overrides: Partial<React.ComponentProps<typeof PaymentDetails>> = {}) {
  return render(
    <PaymentDetails
      payment={payment}
      onPaymentUpdated={vi.fn()}
      onViewCustomer={vi.fn()}
      {...overrides}
    />
  )
}

async function selectAction(label: string) {
  fireEvent.click(screen.getByRole("button", { name: "Payment actions" }))
  fireEvent.click(await screen.findByRole("menuitem", { name: label }))
}

afterEach(() => {
  notify.mockReset()
  vi.restoreAllMocks()
})

describe("PaymentDetails actions", () => {
  it("opens the payment customer through the provided route callback", async () => {
    const onViewCustomer = vi.fn()
    renderDetails({ onViewCustomer })

    await selectAction("View customer")

    expect(onViewCustomer).toHaveBeenCalledWith("cus_nova")
  })

  it("copies the canonical transaction reference and announces success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    renderDetails()

    await selectAction("Copy transaction reference")

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("txn_8X4P")
    )
    expect(notify).toHaveBeenCalledWith({
      type: "success",
      title: "Transaction reference copied",
    })
  })

  it("reports clipboard failures without claiming the reference was copied", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
    })
    renderDetails()

    await selectAction("Copy transaction reference")

    await waitFor(() =>
      expect(notify).toHaveBeenCalledWith({
        type: "error",
        title: "Transaction reference could not be copied",
        description: "Copy it from the Processing tab instead.",
      })
    )
  })

  it("refreshes parent payment data after a refund", async () => {
    const onPaymentUpdated = vi.fn()
    renderDetails({ onPaymentUpdated })

    await selectAction("Refund payment")
    fireEvent.click(screen.getByRole("button", { name: "Request refund" }))

    await waitFor(() => expect(onPaymentUpdated).toHaveBeenCalledTimes(1))
    expect(await screen.findByText("Refunded")).toBeVisible()
  })
})
