import type { Payment } from "@/data/models/payment"

// In production, transport-specific network models would be converted here into
// canonical client models. Keeping that boundary prevents API changes leaking into UI code.
function isPayment(value: unknown): value is Payment {
  if (!value || typeof value !== "object") return false
  const payment = value as Record<string, unknown>
  return (
    typeof payment.id === "string" &&
    typeof payment.amount === "number" &&
    typeof payment.createdAt === "string" &&
    typeof payment.customerName === "string" &&
    typeof payment.merchantName === "string" &&
    typeof payment.status === "string" &&
    typeof payment.processor === "string"
  )
}

async function parsePaymentResponse(response: Response): Promise<Payment> {
  const data: unknown = await response.json()
  if (!isPayment(data)) throw new Error("Received an invalid payment response")
  return data
}

export async function getPayments(): Promise<Payment[]> {
  const response = await fetch("/api/payments")
  if (!response.ok) throw new Error("Unable to load payments")
  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isPayment)) {
    throw new Error("Received an invalid payments response")
  }
  return data
}

export async function getPayment(id: string): Promise<Payment> {
  const response = await fetch(`/api/payments/${id}`)
  if (!response.ok) throw new Error("Unable to load payment")
  return parsePaymentResponse(response)
}
