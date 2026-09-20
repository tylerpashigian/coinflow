import { describe, expect, it } from "vitest"
import {
  addCustomerNote,
  getCustomer,
  requestCustomerVerification,
  setCustomerBlocked,
} from "./customers-service"

describe("customer mutation services", () => {
  it("returns canonical customer records with investigation evidence", async () => {
    const blocked = await setCustomerBlocked("cus_nova", true)
    expect(blocked.blocked).toBe(true)
    expect(blocked.activities[0]).toMatchObject({
      type: "customer",
      title: "Customer blocked",
      actor: "operator",
    })

    const verification = await requestCustomerVerification("cus_nova")
    expect(verification.verification).toBe("pending")
    expect(verification.activities[0]).toMatchObject({
      type: "verification",
      title: "Verification requested",
      actor: "operator",
    })

    const noted = await addCustomerNote("cus_nova", "  Follow up tomorrow.  ")
    expect(noted.notes[0]).toMatchObject({ body: "Follow up tomorrow." })
    expect(noted.activities[0]).toMatchObject({
      type: "note",
      detail: "Follow up tomorrow.",
      actor: "operator",
    })
  })

  it("rejects invalid mutation input and unknown records", async () => {
    await expect(addCustomerNote("cus_nova", "   ")).rejects.toThrow(
      "Unable to update customer"
    )
    await expect(setCustomerBlocked("cus_missing", true)).rejects.toThrow(
      "Unable to update customer"
    )
  })

  it("resets the in-memory store after each test", async () => {
    const customer = await getCustomer("cus_nova")
    expect(customer.blocked).toBe(false)
    expect(customer.notes).toHaveLength(0)
  })
})
