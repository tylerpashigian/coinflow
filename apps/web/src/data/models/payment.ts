/** Canonical client model used by the operations UI. */
export type Payment = {
  amount: number
  cardBrand: string
  cardLast4: string
  createdAt: string
  customerId: string
  customerName: string
  fee: number
  id: string
  merchantName: string
  method: string
  orchestrationResult: "optimized" | "routed"
  processor: string
  processorFee: number
  protection: "approved" | "not_required"
  status: "settled" | "failed"
  threeDS: "passed" | "not_requested"
}
