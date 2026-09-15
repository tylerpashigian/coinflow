import { Button } from "@workspace/ui/components/button"
import { Text } from "@workspace/ui/components/text"
import { UserInfo } from "./features/user/user-info"

export function App() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4">
        <div>
          <Text as="h1" variant="subheading">
            Project ready!
          </Text>
          <Text>You may now add components and start building.</Text>
          <Text>We&apos;ve already added the button component for you.</Text>
          <Button className="mt-2">Button</Button>
        </div>
        <UserInfo />
        <Text variant="caption" tone="muted" className="font-mono">
          (Press{" "}
          <Text as="kbd" variant="caption">
            d
          </Text>{" "}
          to toggle dark mode)
        </Text>
      </div>
    </div>
  )
}
