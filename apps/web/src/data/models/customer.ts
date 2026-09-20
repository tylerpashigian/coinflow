import type { InvestigationEvent } from "./payment"

export type CustomerMethod = {
  brand: string
  last4: string
  type: string
}

/** Canonical client model used by the operations UI. */
export type Customer = {
  activities: InvestigationEvent[]
  attemptLimit: number
  blocked: boolean
  createdAt: string
  email: string
  id: string
  merchantName: string
  methods: CustomerMethod[]
  name: string
  protection: "approved" | "not_required"
  threeDSProcessing: "enabled" | "disabled"
  verification: "enforced" | "not_found" | "pending"
  notes: readonly { id: string; body: string; createdAt: string }[]
}
