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
    customer.activities.every(isInvestigationEvent) &&
    Array.isArray(customer.methods) &&
    ["enforced", "not_found", "pending"].includes(
      String(customer.verification)
    ) &&
    Array.isArray(customer.notes) &&
    customer.notes.every(isCustomerNote)
  )
}

function isInvestigationEvent(value: unknown): boolean {
  if (!value || typeof value !== "object") return false
  const event = value as Record<string, unknown>
  return (
    typeof event.id === "string" &&
    typeof event.occurredAt === "string" &&
    typeof event.title === "string" &&
    ["payment", "review", "verification", "note", "customer"].includes(
      String(event.type)
    ) &&
    ["system", "operator"].includes(String(event.actor)) &&
    (event.detail === undefined || typeof event.detail === "string")
  )
}

function isCustomerNote(value: unknown): boolean {
  if (!value || typeof value !== "object") return false
  const note = value as Record<string, unknown>
  return (
    typeof note.id === "string" &&
    typeof note.body === "string" &&
    typeof note.createdAt === "string"
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

async function mutateCustomer(
  id: string,
  path: string,
  init: RequestInit = {}
) {
  const response = await fetch(`/api/customers/${id}/${path}`, init)
  if (!response.ok) throw new Error("Unable to update customer")
  return parseCustomerResponse(response)
}
export const setCustomerBlocked = (id: string, blocked: boolean) =>
  mutateCustomer(id, "block", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocked }),
  })
export const requestCustomerVerification = (id: string) =>
  mutateCustomer(id, "verification-requests", { method: "POST" })
export const addCustomerNote = (id: string, body: string) =>
  mutateCustomer(id, "notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  })
