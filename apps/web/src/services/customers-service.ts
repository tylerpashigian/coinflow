import type { Customer } from "@/data/models/customer"

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch("/api/customers")
  if (!response.ok) throw new Error("Unable to load customers")
  return response.json() as Promise<Customer[]>
}

export async function getCustomer(id: string): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`)
  if (!response.ok) throw new Error("Unable to load customer")
  return response.json() as Promise<Customer>
}
