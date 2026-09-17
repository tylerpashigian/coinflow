import { useEffect, useState } from "react"
import type { Payment } from "@/data/models/payment"
import { getPayments } from "@/services/payments-service"

type Resource<T> =
  { status: "loading" } | { status: "error" } | { status: "ready"; data: T }

export function usePayments(): Resource<Payment[]> {
  const [state, setState] = useState<Resource<Payment[]>>({ status: "loading" })
  useEffect(() => {
    getPayments().then(
      (data) => setState({ status: "ready", data }),
      () => setState({ status: "error" })
    )
  }, [])
  return state
}
