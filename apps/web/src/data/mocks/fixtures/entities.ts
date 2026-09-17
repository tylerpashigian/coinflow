import type { Customer } from "@/data/models/customer"
import type { Payment } from "@/data/models/payment"

export const customers: Customer[] = [
  {
    id: "cus_nova",
    name: "Nova Bennett",
    email: "nova@northstar.dev",
    merchantName: "Northstar Studio",
    createdAt: "2026-08-29T13:45:00Z",
    verification: "enforced",
  },
]

export const payments: Payment[] = [
  {
    id: "pay_8X4P",
    customerId: "cus_nova",
    merchantName: "Northstar Studio",
    amount: 25_00,
    method: "Apple Pay",
    status: "settled",
    createdAt: "2026-08-30T15:50:00Z",
  },
]
