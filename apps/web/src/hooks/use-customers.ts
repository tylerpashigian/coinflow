import { useCallback, useEffect, useState } from "react"
import type { Customer } from "@/data/models/customer"
import { getCustomers } from "@/services/customers-service"

type LoadState<T> =
  { status: "loading" } | { status: "error" } | { status: "ready"; data: T }

export type Resource<T> = LoadState<T> & { refresh: () => Promise<void> }

export function useCustomers(): Resource<Customer[]> {
  const [state, setState] = useState<LoadState<Customer[]>>({
    status: "loading",
  })
  const refresh = useCallback(
    () =>
      getCustomers().then(
        (data) => setState({ status: "ready", data }),
        () => setState({ status: "error" })
      ),
    []
  )

  useEffect(() => {
    getCustomers().then(
      (data) => setState({ status: "ready", data }),
      () => setState({ status: "error" })
    )
  }, [])

  return { ...state, refresh }
}
