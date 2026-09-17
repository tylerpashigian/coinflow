import { type ReactNode, useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Link, useRouterState } from "@tanstack/react-router"
import {
  Analytics01Icon,
  Cancel01Icon,
  ChartLineData01Icon,
  CreditCardIcon,
  Home01Icon,
  Menu01Icon,
  Search01Icon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { Input } from "@workspace/ui/components/input"
import { FormField } from "@workspace/ui/components/field"
import { Kbd } from "@workspace/ui/components/kbd"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Text } from "@workspace/ui/components/text"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useUser } from "@/hooks/use-user"

const navigation = [
  { label: "Home", icon: Home01Icon, to: "/" },
  { label: "Liquidity", icon: Wallet01Icon },
  {
    label: "Purchases",
    icon: CreditCardIcon,
    section: "Payments & payouts",
    to: "/purchases",
  },
  { label: "Customers", icon: UserGroupIcon, to: "/customers" },
  { label: "Chargebacks", icon: Analytics01Icon },
  { label: "Chargeback analytics", icon: ChartLineData01Icon },
  { label: "Compliance center", icon: Analytics01Icon },
  { label: "Exposure analytics", icon: ChartLineData01Icon },
  { label: "Unmatched chargebacks", icon: Analytics01Icon },
]

const paymentsAndPayoutsStart = navigation.findIndex((item) => item.section)
const primaryNavigation = navigation.slice(0, paymentsAndPayoutsStart)
const paymentsAndPayoutsNavigation = navigation.slice(paymentsAndPayoutsStart)

type NavigationContentProps = {
  closeAction?: ReactNode
  onNavigate?: () => void
  searchRef: React.RefObject<HTMLInputElement | null>
  user: ReturnType<typeof useUser>
}

type NavigationItemProps = {
  item: (typeof navigation)[number]
  onNavigate?: () => void
}

function NavigationItem({ item, onNavigate }: NavigationItemProps) {
  if (item.to) {
    return (
      <Link
        to={item.to}
        activeProps={{
          "aria-current": "page",
          className:
            "bg-accent font-semibold text-foreground dark:text-accent-foreground",
        }}
        activeOptions={{ exact: item.to === "/" }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        onClick={onNavigate}
      >
        <HugeiconsIcon icon={item.icon} size={17} strokeWidth={1.8} />
        {item.label}
      </Link>
    )
  }

  return (
    <button
      aria-disabled="true"
      className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground"
      disabled
      type="button"
    >
      <HugeiconsIcon icon={item.icon} size={17} strokeWidth={1.8} />
      {item.label}
    </button>
  )
}

function NavigationContent({
  closeAction,
  onNavigate,
  searchRef,
  user,
}: NavigationContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 px-3">
        <div className="grid size-8 place-items-center rounded-lg bg-foreground text-sm font-bold text-white">
          C
        </div>
        <Text as="span" size="lg" weight="semibold">
          Coinflow
        </Text>
        {closeAction ? <div className="ml-auto">{closeAction}</div> : null}
      </div>
      <FormField className="mt-8" label="Merchant ID">
        <Select defaultValue="Coinflow Admin">
          <SelectTrigger className="h-10 w-full bg-white px-3 text-sm font-medium dark:bg-input/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Coinflow Admin">Coinflow Admin</SelectItem>
            <SelectItem value="Northstar Studio">Northstar Studio</SelectItem>
            <SelectItem value="Acme Commerce">Acme Commerce</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
      <FormField className="mt-3" label="Search">
        <Input
          leftComponent={
            <HugeiconsIcon icon={Search01Icon} size={17} strokeWidth={2} />
          }
          placeholder="Search"
          ref={searchRef}
          rightComponent={<Kbd>⌘ K</Kbd>}
          type="search"
        />
      </FormField>
      <nav aria-label="Primary" className="mt-6 flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 space-y-1">
          {primaryNavigation.map((item) => (
            <NavigationItem item={item} key={item.label} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <Text
            as="p"
            variant="caption"
            tone="muted"
            className="mb-2 shrink-0 px-3 tracking-wide uppercase"
          >
            Payments & payouts
          </Text>
          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="space-y-1">
              {paymentsAndPayoutsNavigation.map((item) => (
                <NavigationItem item={item} key={item.label} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="mt-5 flex shrink-0 items-center gap-3 border-t border-border px-3 pt-5 dark:border-border">
        <div className="grid size-8 place-items-center rounded-full bg-muted-foreground text-sm font-semibold text-muted">
          {user.status === "ready" ? user.user.name.slice(0, 1) : "B"}
        </div>
        <div className="min-w-0">
          <Text as="p" variant="caption" tone="muted">
            Logged in as
          </Text>
          <Text as="p" className="truncate" weight="medium">
            {user.status === "ready" ? user.user.name : "Loading…"}
          </Text>
        </div>
      </div>
    </div>
  )
}

function pageTitle(pathname: string) {
  if (pathname.startsWith("/purchases")) return "Purchases"
  if (pathname.startsWith("/customers")) return "Customers"
  return "Overview"
}

export function AppShell({ children }: { children: ReactNode }) {
  const user = useUser()
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const desktopSearchRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(max-width: 1023px)")
    if (!mediaQuery) return

    const closeOnDesktop = () => {
      if (!mediaQuery.matches) setMobileNavigationOpen(false)
    }

    mediaQuery.addEventListener("change", closeOnDesktop)
    return () => mediaQuery.removeEventListener("change", closeOnDesktop)
  }, [])

  const openMobileNavigation = (focusSearch = false) => {
    setMobileNavigationOpen(true)
    if (focusSearch) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => mobileSearchRef.current?.focus())
      )
    }
  }

  const closeMobileNavigation = () => {
    setMobileNavigationOpen(false)
    requestAnimationFrame(() => menuTriggerRef.current?.focus())
  }

  useHotkey("Mod+K", () => {
    if (isMobile) {
      openMobileNavigation(true)
      return
    }
    desktopSearchRef.current?.focus()
  })

  return (
    <div className="min-h-svh bg-muted/30 text-foreground dark:bg-background dark:text-foreground">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-white px-4 dark:bg-card lg:hidden">
        <Drawer
          open={mobileNavigationOpen}
          onOpenChange={(open) => {
            if (open) openMobileNavigation()
            else closeMobileNavigation()
          }}
          swipeDirection="left"
        >
          <DrawerTrigger
            render={
              <Button
                aria-label="Open navigation"
                ref={menuTriggerRef}
                size="icon"
                variant="ghost"
              >
                <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
              </Button>
            }
          />
          <DrawerContent className="bg-white dark:bg-card">
            <DrawerHeader className="sr-only">
              <DrawerTitle>Navigation</DrawerTitle>
            </DrawerHeader>
            <div className="min-h-0 flex-1 px-4 py-6">
              <NavigationContent
                closeAction={
                  <DrawerClose
                    render={
                      <Button aria-label="Close navigation" size="icon" variant="ghost">
                        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                      </Button>
                    }
                  />
                }
                onNavigate={closeMobileNavigation}
                searchRef={mobileSearchRef}
                user={user}
              />
            </div>
          </DrawerContent>
        </Drawer>
        <div className="grid size-7 place-items-center rounded-lg bg-foreground text-xs font-bold text-white">
          C
        </div>
        <Text as="span" weight="semibold">
          {pageTitle(pathname)}
        </Text>
      </header>
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-white px-4 py-6 lg:flex lg:flex-col dark:bg-card">
        <NavigationContent searchRef={desktopSearchRef} user={user} />
      </aside>
      <main className="lg:pl-72">{children}</main>
    </div>
  )
}
