import { useEffect, useState } from "react"
import type {
  DashboardOverview,
  DashboardQuery,
} from "@/data/models/dashboard"
import { getDashboardOverview } from "@/services/dashboard-service"

type DashboardOverviewState =
  | { status: "loading"; data?: never }
  | { status: "ready"; data: DashboardOverview }
  | { status: "error"; data?: never }

export function useDashboardOverview(
  query: DashboardQuery
): DashboardOverviewState {
  const [state, setState] = useState<DashboardOverviewState>({
    status: "loading",
  })
  const { from, metric, to, timezone } = query

  useEffect(() => {
    getDashboardOverview({ from, metric, to, timezone }).then(
      (data) => setState({ status: "ready", data }),
      () => setState({ status: "error" })
    )
  }, [from, metric, to, timezone])

  return state
}
