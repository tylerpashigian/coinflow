import { customers, payments } from "./fixtures/entities"
import type { Customer } from "../models/customer"
import type { Payment } from "../models/payment"

const initialCustomers = structuredClone(customers)
const initialPayments = structuredClone(payments)

export const mockStore: { customers: Customer[]; payments: Payment[] } = {
  customers: structuredClone(initialCustomers),
  payments: structuredClone(initialPayments),
}

let actionSequence = 0

/** Produces deterministic identifiers and timestamps for in-session mutations. */
export function nextMockAction(prefix: string, recordId: string) {
  actionSequence += 1
  return {
    id: `${prefix}_${recordId}_${actionSequence}`,
    occurredAt: new Date(
      Date.UTC(2026, 7, 30, 15, 0, actionSequence)
    ).toISOString(),
  }
}

/** Restores deterministic fixtures between MSW test cases. */
export function resetMockStore() {
  mockStore.customers = structuredClone(initialCustomers)
  mockStore.payments = structuredClone(initialPayments)
  actionSequence = 0
}
