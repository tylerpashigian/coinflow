import type { Customer } from "@/data/models/customer"

// In production, transport-specific network models would be converted here into
// canonical client models. Keeping that boundary prevents API changes leaking into UI code.
function isCustomer(value: unknown): value is Customer {
  if (!value || typeof value !== "object") return false
  const customer = value as Record<string, unknown>
  return (
    typeof customer.id === "string" &&
    typeof customer.name === "string" &&
    typeof customer.email === "string" &&
    typeof customer.createdAt === "string" &&
    Array.isArray(customer.activities) &&
    Array.isArray(customer.methods)
  )
}

async function parseCustomerResponse(response: Response): Promise<Customer> {
  const data: unknown = await response.json()
  if (!isCustomer(data))
    throw new Error("Received an invalid customer response")
  return data
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch("/api/customers")
  if (!response.ok) throw new Error("Unable to load customers")
  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isCustomer)) {
    throw new Error("Received an invalid customers response")
  }
  return data
}

export async function getCustomer(id: string): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`)
  if (!response.ok) throw new Error("Unable to load customer")
  return parseCustomerResponse(response)
}
