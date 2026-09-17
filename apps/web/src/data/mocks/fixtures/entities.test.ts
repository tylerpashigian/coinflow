import { describe, expect, it } from "vitest"
import { customers, payments } from "./entities"

describe("operations mock fixtures", () => {
  it("builds a realistic collection size with resolvable customer references", () => {
    expect(customers.length).toBeGreaterThanOrEqual(10)
    expect(customers.length).toBeLessThanOrEqual(20)
    expect(payments.length).toBeGreaterThanOrEqual(10)
    expect(payments.length).toBeLessThanOrEqual(20)

    const customerIds = new Set(customers.map((customer) => customer.id))
    expect(payments.every((payment) => customerIds.has(payment.customerId))).toBe(
      true
    )
  })
})
