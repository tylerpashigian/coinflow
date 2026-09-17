import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { DateRangePicker } from "@workspace/ui/components/date-range-picker"
import { FormField } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

describe("FormField", () => {
  it("associates supported controls with their labels, feedback, and invalid state", () => {
    render(
      <>
        <FormField description="Used in reporting." label="Merchant ID">
          <Input />
        </FormField>
        <FormField error="Choose a merchant." label="Merchant">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose a merchant" />
            </SelectTrigger>
          </Select>
        </FormField>
        <FormField error="Choose a complete range." label="Purchase date range">
          <DateRangePicker onValueChange={() => undefined} value={undefined} />
        </FormField>
      </>
    )

    const merchantId = screen.getByRole("textbox", { name: "Merchant ID" })
    const merchant = screen.getByRole("combobox", { name: "Merchant" })
    const dateRange = screen.getByRole("button", {
      name: "Purchase date range",
    })

    expect(merchantId).toHaveAttribute("aria-describedby")
    expect(screen.getByText("Used in reporting.").id).toBe(
      merchantId.getAttribute("aria-describedby")
    )
    expect(merchant).toHaveAttribute("aria-invalid", "true")
    expect(dateRange).toHaveAttribute("aria-invalid", "true")
    expect(screen.getAllByRole("alert")).toHaveLength(2)
  })

  it("replaces helper text with an announced controlled error", () => {
    render(
      <FormField
        description="This helper should be replaced."
        error="A merchant is required."
        label="Merchant ID"
      >
        <Input />
      </FormField>
    )

    const input = screen.getByRole("textbox", { name: "Merchant ID" })
    const error = screen.getByRole("alert")

    expect(screen.queryByText("This helper should be replaced.")).toBeNull()
    expect(error).toHaveTextContent("A merchant is required.")
    expect(input.getAttribute("aria-describedby")).toBe(error.id)
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("preserves explicitly supplied ARIA metadata", () => {
    render(
      <FormField description="Generated helper text." label="Merchant ID">
        <Input
          aria-describedby="external-description"
          aria-label="Custom merchant input"
          aria-invalid={false}
          id="merchant-input"
        />
      </FormField>
    )

    const input = screen.getByRole("textbox", { name: "Custom merchant input" })

    expect(input).toHaveAttribute("id", "merchant-input")
    expect(input).toHaveAttribute("aria-describedby", "external-description")
    expect(input).toHaveAttribute("aria-invalid", "false")
    expect(input).not.toHaveAttribute("aria-labelledby")
  })
})
