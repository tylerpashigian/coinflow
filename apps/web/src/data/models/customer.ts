export type CustomerActivity = {
  description: string
  occurredAt: string
}

export type CustomerMethod = {
  brand: string
  last4: string
  type: string
}

/** Canonical client model used by the operations UI. */
export type Customer = {
  activities: CustomerActivity[]
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
  verification: "enforced" | "not_found"
}
