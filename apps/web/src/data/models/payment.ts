/** Payment record used by the operations UI. */
export type Payment = {
  amount: number
  createdAt: string
  customerId: string
  id: string
  merchantName: string
  method: string
  status: "settled" | "failed"
}
