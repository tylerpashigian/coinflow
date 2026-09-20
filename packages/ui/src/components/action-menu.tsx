import { Menu as Primitive } from "@base-ui/react/menu"
import { buttonVariants } from "./button-variants"

export interface ActionMenuItem {
  id: string
  label: string
  onSelect: () => void
  tone?: "default" | "destructive"
  disabled?: boolean
}
export interface ActionMenuProps {
  label: string
  items: readonly ActionMenuItem[]
}

/** A direct shadcn Dropdown Menu foundation for contextual record actions. */
export function ActionMenu({ label, items }: ActionMenuProps) {
  return (
    <Primitive.Root>
      <Primitive.Trigger
        aria-label={label}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Manage
      </Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Positioner sideOffset={6} className="z-50">
          <Primitive.Popup className="min-w-48 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
            {items.map((item) => (
              <Primitive.Item
                key={item.id}
                disabled={item.disabled}
                onClick={item.onSelect}
                className={`flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50${item.tone === "destructive" ? "text-destructive" : ""}`}
              >
                {item.label}
              </Primitive.Item>
            ))}
          </Primitive.Popup>
        </Primitive.Positioner>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
