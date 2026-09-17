import { useEffect, useState } from "react"
import type { User } from "@/data/models/user"
import { getUser } from "@/services/user-service"

export type UserQueryState =
  | { status: "loading"; user?: never }
  | { status: "ready"; user: User }
  | { status: "error"; user?: never }

/**
 * Owns the UI-facing lifecycle for user data.
 *
 * This is the seam for caching or migration to TanStack Query later; components
 * remain independent of the mechanism used by the service layer.
 */
export function useUser(): UserQueryState {
  const [state, setState] = useState<UserQueryState>({ status: "loading" })

  useEffect(() => {
    getUser().then(
      (user) => setState({ status: "ready", user }),
      () => setState({ status: "error" })
    )
  }, [])

  return state
}
