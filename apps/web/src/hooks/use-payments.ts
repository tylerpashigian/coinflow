import { useCallback, useEffect, useState } from "react"
import type { Payment } from "@/data/models/payment"
import { getPayments } from "@/services/payments-service"

type LoadState<T> =
  { status: "loading" } | { status: "error" } | { status: "ready"; data: T }

export type Resource<T> = LoadState<T> & { refresh: () => Promise<void> }

export function usePayments(): Resource<Payment[]> {
  const [state, setState] = useState<LoadState<Payment[]>>({
    status: "loading",
  })
  const refresh = useCallback(
    () =>
      getPayments().then(
        (data) => setState({ status: "ready", data }),
        () => setState({ status: "error" })
      ),
    []
  )

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { ...state, refresh }
}
