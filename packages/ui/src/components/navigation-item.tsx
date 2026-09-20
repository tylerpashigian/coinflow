import { cn } from "cn"
import { Icon, type IconName } from "../private/icons"
export interface NavigationItemProps {
  label: string
  icon?: IconName
  href?: string
  current?: boolean
  disabled?: boolean
  onNavigate?: (href: string) => void
  "data-testid"?: string
}
export function NavigationItem({
  label,
  icon,
  href,
  current = false,
  disabled = false,
  onNavigate,
  "data-testid": testId,
}: NavigationItemProps) {
  return (
    <a
      href={disabled ? undefined : href}
      role={disabled || !href ? "link" : undefined}
      aria-disabled={disabled || !href || undefined}
      aria-current={current ? "page" : undefined}
      tabIndex={disabled || !href ? -1 : undefined}
      data-testid={testId}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        current && "bg-accent font-semibold text-accent-foreground",
        (disabled || !href) && "pointer-events-none opacity-55"
      )}
      onClick={(event) => {
        if (disabled || !href) {
          event.preventDefault()
          return
        }
        if (
          onNavigate &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey &&
          !event.shiftKey
        ) {
          event.preventDefault()
          onNavigate(href)
        }
      }}
    >
      {icon && <Icon name={icon} />} {label}
    </a>
  )
}
