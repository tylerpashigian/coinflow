import { Text } from "@workspace/ui/components/text"
import { useUser } from "@/data/hooks/use-user"

export function UserInfo() {
  const state = useUser()

  return (
    <Text role="status" tone={state.status === "error" ? "danger" : "default"}>
      {state.status === "loading" && "Loading user…"}
      {state.status === "ready" && `Signed in as ${state.user.name}`}
      {state.status === "error" && "Unable to load user information."}
    </Text>
  )
}
