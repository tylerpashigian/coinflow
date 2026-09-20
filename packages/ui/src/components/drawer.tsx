import { useEffect, useRef, useState, type ReactNode } from "react"
import * as P from "../private/drawer"
import { Icon } from "../private/icons"
import { buttonVariants } from "./button-variants"
import { Button } from "./button"
import { useMediaQuery } from "../private/use-media-query"
import type { OverlayAction, OverlayTrigger } from "../private/overlay-types"
export type { OverlayAction, OverlayTrigger } from "../private/overlay-types"
export interface DrawerProps {
  children: ReactNode
  title: string
  description?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: OverlayTrigger
  actions?: readonly OverlayAction[]
  placement?: "detail" | "navigation"
  density?: "compact" | "comfortable"
  /** Wider detail surface for record investigation; navigation keeps its standard width. */
  size?: "default" | "wide"
  headerVisibility?: "visible" | "accessible"
  initialFocus?: "content" | "search"
  "data-testid"?: string
}
export function Drawer({
  children,
  title,
  description,
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
  actions,
  placement = "detail",
  density = "comfortable",
  size = "default",
  headerVisibility = "visible",
  initialFocus = "content",
  "data-testid": testId,
}: DrawerProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen)
  const desktopNavigation = useMediaQuery("(min-width: 1024px)")
  const visible =
    (open ?? localOpen) && !(placement === "navigation" && desktopNavigation)
  const desktopDetail = useMediaQuery("(min-width: 768px)")
  const returnFocus = useRef<HTMLElement | null>(null)
  const content = useRef<HTMLDivElement>(null)
  const previous = useRef(false)
  const change = (next: boolean) => {
    setLocalOpen(next)
    onOpenChange?.(next)
  }
  useEffect(() => {
    if (visible && !previous.current)
      returnFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
    if (!visible && previous.current) {
      const target = returnFocus.current
      requestAnimationFrame(() => {
        if (target?.isConnected) target.focus()
      })
    }
    previous.current = visible
  }, [visible])
  useEffect(() => {
    if (placement !== "navigation") return
    const media = window.matchMedia?.("(min-width: 1024px)")
    const close = () => {
      if (media?.matches) {
        setLocalOpen(false)
        onOpenChange?.(false)
      }
    }
    media?.addEventListener("change", close)
    return () => media?.removeEventListener("change", close)
  }, [placement, onOpenChange])
  return (
    <P.Drawer
      open={visible}
      onOpenChange={change}
      showSwipeHandle={placement === "detail" && !desktopDetail}
      swipeDirection={
        placement === "navigation" ? "left" : desktopDetail ? "right" : "down"
      }
    >
      {trigger && (
        <P.DrawerTrigger
          disabled={trigger.disabled}
          aria-label={trigger.iconOnly ? trigger.label : undefined}
          className={buttonVariants({
            variant: "ghost",
            size: trigger.iconOnly ? "icon" : "default",
          })}
        >
          {trigger.icon && <Icon name={trigger.icon} />}{" "}
          {!trigger.iconOnly && trigger.label}
        </P.DrawerTrigger>
      )}
      <P.DrawerContent
        data-testid={testId}
        className={
          size === "wide" && placement === "detail"
            ? "sm:[--drawer-content-width:32rem]"
            : undefined
        }
        initialFocus={() =>
          initialFocus === "search"
            ? (content.current?.querySelector<HTMLInputElement>(
                'input[type="search"]'
              ) ?? content.current)
            : content.current
        }
      >
        <P.DrawerHeader visuallyHidden={headerVisibility === "accessible"}>
          <P.DrawerTitle>{title}</P.DrawerTitle>
          {description && (
            <P.DrawerDescription>{description}</P.DrawerDescription>
          )}
        </P.DrawerHeader>
        {(placement === "navigation" || desktopDetail) && (
          <div className="absolute top-4 right-4 z-10">
            <P.DrawerClose
              aria-label={`Close ${title.toLowerCase()}`}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <Icon name="close" />
            </P.DrawerClose>
          </div>
        )}
        <div
          ref={content}
          tabIndex={-1}
          className={
            density === "compact"
              ? "min-h-0 flex-1 overflow-y-auto p-2 outline-none"
              : "min-h-0 flex-1 overflow-y-auto p-4 outline-none"
          }
        >
          {children}
        </div>
        {actions && (
          <P.DrawerFooter>
            {actions.map((action) => (
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
          </P.DrawerFooter>
        )}
      </P.DrawerContent>
    </P.Drawer>
  )
}
