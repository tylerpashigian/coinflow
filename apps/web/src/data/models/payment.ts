export type InvestigationEvent = {
  id: string
  occurredAt: string
  type: "payment" | "review" | "verification" | "note" | "customer"
  title: string
  detail?: string
  actor: "system" | "operator"
}

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
  status: "settled" | "failed" | "refunded"
  reviewState: "clear" | "flagged"
  threeDS: "passed" | "not_requested"
  transactionReference: string
  events: InvestigationEvent[]
}
