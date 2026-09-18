import { useState, type ReactNode } from "react"
import * as P from "../private/popover"
import { Popover as Primitive } from "@base-ui/react/popover"
import { buttonVariants } from "./button-variants"
import { Button } from "./button"
import { Icon } from "../private/icons"
import type { OverlayAction, OverlayTrigger } from "../private/overlay-types"
export interface PopoverProps {
  children: ReactNode
  title: string
  description?: string
  trigger: OverlayTrigger
  actions?: readonly OverlayAction[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: "above" | "below" | "start" | "end"
  density?: "compact" | "comfortable"
  headerVisibility?: "visible" | "accessible"
  "data-testid"?: string
}
export function Popover({
  children,
  title,
  description,
  trigger,
  actions,
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "below",
  density = "comfortable",
  headerVisibility = "visible",
  "data-testid": testId,
}: PopoverProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen)
  const change = (next: boolean) => {
    setLocalOpen(next)
    onOpenChange?.(next)
  }
  return (
    <P.Popover open={open ?? localOpen} onOpenChange={change}>
      <P.PopoverTrigger
        disabled={trigger.disabled}
        aria-label={trigger.iconOnly ? trigger.label : undefined}
        className={buttonVariants({
          variant: "outline",
          size: trigger.iconOnly ? "icon" : "default",
        })}
      >
        {trigger.icon && <Icon name={trigger.icon} />}{" "}
        {!trigger.iconOnly && trigger.label}
      </P.PopoverTrigger>
      <P.PopoverContent
        data-testid={testId}
        side={
          placement === "above"
            ? "top"
            : placement === "start"
              ? "left"
              : placement === "end"
                ? "right"
                : "bottom"
        }
        size={density === "compact" ? "compact" : "default"}
      >
        <div
          className={
            headerVisibility === "accessible"
              ? "sr-only"
              : "flex flex-col gap-1"
          }
        >
          <P.PopoverTitle>{title}</P.PopoverTitle>
          {description && (
            <P.PopoverDescription>{description}</P.PopoverDescription>
          )}
        </div>
        {children}
        <div className="flex justify-end gap-2">
          {actions?.map((action) => (
            <Button
              key={action.label}
              label={action.label}
              variant={action.tone}
              disabled={action.disabled}
              onPress={() => {
                action.onPress()
                if (action.close) change(false)
              }}
            />
          ))}
          <Primitive.Close
            className={buttonVariants({ variant: "ghost" })}
            aria-label={`Close ${title.toLowerCase()}`}
          >
            <Icon name="close" />
          </Primitive.Close>
        </div>
      </P.PopoverContent>
    </P.Popover>
  )
}
