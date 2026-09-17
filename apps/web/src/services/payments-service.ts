import type { Payment } from "@/data/models/payment"

export async function getPayments(): Promise<Payment[]> {
  const response = await fetch("/api/payments")
  if (!response.ok) throw new Error("Unable to load payments")
  return response.json() as Promise<Payment[]>
}

export async function getPayment(id: string): Promise<Payment> {
  const response = await fetch(`/api/payments/${id}`)
  if (!response.ok) throw new Error("Unable to load payment")
  return response.json() as Promise<Payment>
}
