/** Customer record used by the operations UI. */
export type Customer = {
  createdAt: string
  email: string
  id: string
  merchantName: string
  name: string
  verification: "enforced" | "not_found"
}
