import { faker } from "@faker-js/faker"
import { customerBuilder } from "@/data/mocks/builders/customer-builder"
import { paymentBuilder } from "@/data/mocks/builders/payment-builder"
import type { Customer } from "@/data/models/customer"
import type { Payment } from "@/data/models/payment"

const collectionSize = () => faker.number.int({ min: 10, max: 20 })

const knownCustomers: Customer[] = [
  customerBuilder({
    id: "cus_nova",
    name: "Nova Bennett",
    email: "nova@northstar.dev",
    merchantName: "Northstar Studio",
    createdAt: "2026-08-29T13:45:00Z",
    protection: "approved",
    blocked: false,
    threeDSProcessing: "enabled",
    attemptLimit: 5,
    verification: "enforced",
    methods: [{ type: "Card", brand: "Visa", last4: "4242" }],
    activities: [
      { id: "evt_nova_payment", type: "payment", title: "Payment settled", occurredAt: "2026-08-30T15:50:00Z", actor: "system" },
      { id: "evt_nova_created", type: "customer", title: "Customer created", occurredAt: "2026-08-29T13:45:00Z", actor: "system" },
    ],
  }).build(),
  customerBuilder({
    id: "cus_milo",
    name: "Milo Hart",
    email: "milo@northstar.dev",
    merchantName: "Northstar Studio",
    createdAt: "2026-08-25T10:12:00Z",
    protection: "not_required",
    blocked: false,
    threeDSProcessing: "disabled",
    attemptLimit: 3,
    verification: "not_found",
    methods: [{ type: "Card", brand: "Mastercard", last4: "4444" }],
    activities: [
      { id: "evt_milo_created", type: "customer", title: "Customer created", occurredAt: "2026-08-25T10:12:00Z", actor: "system" },
    ],
  }).build(),
]

export const customers: Customer[] = [
  ...knownCustomers,
  ...Array.from(
    { length: collectionSize() - knownCustomers.length },
    (_, index) =>
      customerBuilder({
        id: `cus_${String(index + knownCustomers.length + 1).padStart(4, "0")}`,
      }).build()
  ),
]

const knownPayments: Payment[] = [
  paymentBuilder({
    id: "pay_8X4P",
    customerId: "cus_nova",
    customerName: "Nova Bennett",
    merchantName: "Northstar Studio",
    amount: 25_00,
    method: "Apple Pay",
    cardBrand: "Visa",
    cardLast4: "4242",
    processor: "Stripe",
    orchestrationResult: "optimized",
    status: "settled",
    protection: "approved",
    threeDS: "passed",
    fee: 73,
    processorFee: 61,
    createdAt: "2026-08-30T15:50:00Z",
  }).build(),
  paymentBuilder({
    id: "pay_7J2M",
    customerId: "cus_milo",
    customerName: "Milo Hart",
    merchantName: "Northstar Studio",
    amount: 8900,
    method: "Card",
    cardBrand: "Mastercard",
    cardLast4: "4444",
    processor: "Adyen",
    orchestrationResult: "routed",
    status: "settled",
    protection: "not_required",
    threeDS: "not_requested",
    fee: 254,
    processorFee: 228,
    createdAt: "2026-08-28T16:20:00Z",
  }).build(),
  paymentBuilder({
    id: "pay_5C9K",
    customerId: "cus_milo",
    customerName: "Milo Hart",
    merchantName: "Northstar Studio",
    amount: 4200,
    method: "Card",
    cardBrand: "Mastercard",
    cardLast4: "4444",
    processor: "Stripe",
    orchestrationResult: "optimized",
    status: "failed",
    protection: "not_required",
    threeDS: "not_requested",
    fee: 0,
    processorFee: 0,
    createdAt: "2026-08-24T09:15:00Z",
  }).build(),
]

export const payments: Payment[] = [
  ...knownPayments,
  ...Array.from(
    { length: collectionSize() - knownPayments.length },
    (_, index) => {
      const customer = faker.helpers.arrayElement(customers)
      return paymentBuilder({
        id: `pay_${String(index + knownPayments.length + 1).padStart(4, "0")}`,
        customerId: customer.id,
        customerName: customer.name,
        merchantName: customer.merchantName,
      }).build()
    }
  ),
]
