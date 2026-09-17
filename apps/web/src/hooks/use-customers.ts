import { useEffect, useState } from "react"
import type { Customer } from "@/data/models/customer"
import { getCustomers } from "@/services/customers-service"

type Resource<T> =
  { status: "loading" } | { status: "error" } | { status: "ready"; data: T }

export function useCustomers(): Resource<Customer[]> {
  const [state, setState] = useState<Resource<Customer[]>>({
    status: "loading",
  })
  useEffect(() => {
    getCustomers().then(
      (data) => setState({ status: "ready", data }),
      () => setState({ status: "error" })
    )
  }, [])
  return state
}
