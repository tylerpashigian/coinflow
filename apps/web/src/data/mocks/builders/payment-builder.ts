import { faker } from "@faker-js/faker"
import type { Payment } from "@/data/models/payment"

const cardBrands = ["Visa", "Mastercard", "Amex"] as const
const methods = ["Card", "Apple Pay", "Google Pay"] as const
const processors = ["Adyen", "Stripe"] as const

/** Immutable payment builder shared by mock fixtures and tests. */
export function paymentBuilder(overrides: Partial<Payment> = {}) {
  const amount = faker.number.int({ min: 1_000, max: 50_000 })
  const fee = Math.round(amount * faker.number.float({ min: 0.02, max: 0.04 }))
  const payment: Payment = {
    id: `pay_${faker.string.alphanumeric({ length: 10, casing: "upper" })}`,
    customerId: `cus_${faker.string.alphanumeric({ length: 10, casing: "lower" })}`,
    customerName: faker.person.fullName(),
    merchantName: faker.company.name(),
    amount,
    method: faker.helpers.arrayElement(methods),
    cardBrand: faker.helpers.arrayElement(cardBrands),
    cardLast4: faker.string.numeric(4),
    processor: faker.helpers.arrayElement(processors),
    orchestrationResult: faker.helpers.arrayElement(["optimized", "routed"]),
    status: faker.helpers.arrayElement(["settled", "failed"]),
    protection: faker.helpers.arrayElement(["approved", "not_required"]),
    threeDS: faker.helpers.arrayElement(["passed", "not_requested"]),
    fee,
    processorFee: Math.round(fee * 0.85),
    createdAt: faker.date
      .between({
        from: "2026-08-25T00:00:00Z",
        to: "2026-08-29T23:59:59Z",
      })
      .toISOString(),
    ...overrides,
  }

  return {
    with: (values: Partial<Payment>) => paymentBuilder({ ...payment, ...values }),
    build: (): Payment => ({ ...payment }),
  }
}
