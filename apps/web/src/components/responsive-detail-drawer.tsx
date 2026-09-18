import type { ReactNode } from "react"
import { Drawer } from "@workspace/ui/components/drawer"
interface ResponsiveDetailDrawerProps {
  children: ReactNode
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
  return (
    <Drawer
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      placement="detail"
      data-testid="responsive-detail-drawer"
    >
      {children}
    </Drawer>
  )
}
