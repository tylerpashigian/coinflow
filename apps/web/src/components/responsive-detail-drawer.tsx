import { useEffect, useRef } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

type ResponsiveDetailDrawerProps = {
  children: React.ReactNode
  description: string
  onOpenChange: (open: boolean) => void
  open: boolean
  title: string
}

export function ResponsiveDetailDrawer({
  children,
  description,
  onOpenChange,
  open,
  title,
}: ResponsiveDetailDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) returnFocusRef.current = document.activeElement as HTMLElement
  }, [open])

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) requestAnimationFrame(() => returnFocusRef.current?.focus())
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      swipeDirection={isDesktop ? "right" : "down"}
    >
      <DrawerContent data-testid="responsive-detail-drawer">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
