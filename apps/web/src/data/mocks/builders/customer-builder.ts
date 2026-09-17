import { faker } from "@faker-js/faker"
import type { Customer } from "@/data/models/customer"

const merchants = [
  "Northstar Studio",
  "Acme Commerce",
  "Ridgeway Goods",
] as const

const cardBrands = ["Visa", "Mastercard", "Amex"] as const

/** Immutable customer builder shared by mock fixtures and tests. */
export function customerBuilder(overrides: Partial<Customer> = {}) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const name = `${firstName} ${lastName}`
  const createdAt = faker.date
    .between({ from: "2026-08-25T00:00:00Z", to: "2026-08-29T23:59:59Z" })
    .toISOString()
  const customer: Customer = {
    id: `cus_${faker.string.alphanumeric({ length: 10, casing: "lower" })}`,
    name,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    merchantName: faker.helpers.arrayElement(merchants),
    createdAt,
    protection: faker.helpers.arrayElement(["approved", "not_required"]),
    blocked: faker.datatype.boolean({ probability: 0.1 }),
    threeDSProcessing: faker.helpers.arrayElement(["enabled", "disabled"]),
    attemptLimit: faker.number.int({ min: 3, max: 8 }),
    verification: faker.helpers.arrayElement(["enforced", "not_found"]),
    methods: [
      {
        type: "Card",
        brand: faker.helpers.arrayElement(cardBrands),
        last4: faker.string.numeric(4),
      },
    ],
    activities: [
      { description: "Customer created", occurredAt: createdAt },
    ],
    ...overrides,
  }

  return {
    with: (values: Partial<Customer>) => customerBuilder({ ...customer, ...values }),
    build: (): Customer => ({ ...customer }),
  }
}
