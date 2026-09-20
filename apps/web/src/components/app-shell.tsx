import { type ReactNode, useRef, useState } from "react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import { Drawer } from "@workspace/ui/components/drawer"
import { Input, type FocusHandle } from "@workspace/ui/components/input"
import { NavigationItem as UiNavigationItem } from "@workspace/ui/components/navigation-item"
import { FormField } from "@workspace/ui/components/field"
import { Select } from "@workspace/ui/components/select"
import { Text } from "@workspace/ui/components/text"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useUser } from "@/hooks/use-user"

const navigation = [
  { label: "Home", icon: "home", to: "/" },
  { label: "Liquidity", icon: "wallet" },
  {
    label: "Purchases",
    icon: "payments",
    section: "Payments & payouts",
    to: "/purchases",
  },
  { label: "Customers", icon: "customers", to: "/customers" },
  { label: "Chargebacks", icon: "analytics" },
  { label: "Chargeback analytics", icon: "chart" },
  { label: "Compliance center", icon: "analytics" },
  { label: "Exposure analytics", icon: "chart" },
  { label: "Unmatched chargebacks", icon: "analytics" },
] as const

const paymentsAndPayoutsStart = navigation.findIndex(
  (item) => "section" in item
)
const primaryNavigation = navigation.slice(0, paymentsAndPayoutsStart)
const paymentsAndPayoutsNavigation = navigation.slice(paymentsAndPayoutsStart)

type NavigationContentProps = {
  onNavigate?: () => void
  searchRef: React.RefObject<FocusHandle | null>
  user: ReturnType<typeof useUser>
}

type NavigationItemProps = {
  item: (typeof navigation)[number]
  onNavigate?: () => void
}

function NavigationItem({ item, onNavigate }: NavigationItemProps) {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const href = "to" in item ? item.to : undefined
  return (
    <UiNavigationItem
      label={item.label}
      icon={item.icon}
      href={href}
      disabled={!href}
      current={
        href === "/" ? pathname === "/" : !!href && pathname.startsWith(href)
      }
      onNavigate={(destination) => {
        void navigate({ to: destination })
        onNavigate?.()
      }}
    />
  )
}

function NavigationContent({
  onNavigate,
  searchRef,
  user,
}: NavigationContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 px-3">
        <div className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-bold text-accent-foreground shadow-sm">
          C
        </div>
        <Text role="inline" size="lg" weight="semibold">
          Coinflow
        </Text>
      </div>
      <div className="mt-9">
        <FormField label="Merchant ID">
          <Select
            defaultValue="Coinflow Admin"
            size="lg"
            options={[
              { value: "Coinflow Admin", label: "Coinflow Admin" },
              { value: "Northstar Studio", label: "Northstar Studio" },
              { value: "Acme Commerce", label: "Acme Commerce" },
            ]}
          />
        </FormField>
      </div>
      <div className="mt-3">
        <FormField label="Search">
          <Input
            leadingIcon="search"
            placeholder="Search"
            focusHandle={searchRef}
            shortcut="⌘ K"
            size="lg"
            type="search"
          />
        </FormField>
      </div>
      <nav aria-label="Primary" className="mt-7 flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 space-y-1">
          {primaryNavigation.map((item) => (
            <NavigationItem
              item={item}
              key={item.label}
              onNavigate={onNavigate}
            />
          ))}
        </div>
        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <div className="mb-2 shrink-0 px-3">
            <Text
              role="paragraph"
              variant="caption"
              tone="muted"
              casing="uppercase"
            >
              Payments & payouts
            </Text>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-1">
              {paymentsAndPayoutsNavigation.map((item) => (
                <NavigationItem
                  item={item}
                  key={item.label}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="mt-5 flex shrink-0 items-center gap-3 border-t border-border px-3 pt-5 dark:border-border">
        <div className="grid size-8 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {user.status === "ready" ? user.user.name.slice(0, 1) : "B"}
        </div>
        <div className="min-w-0">
          <Text role="paragraph" variant="caption" tone="muted">
            Logged in as
          </Text>
          <Text role="paragraph" truncate weight="medium">
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
  return "Operator overview"
}

export function AppShell({ children }: { children: ReactNode }) {
  const user = useUser()
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const desktopSearchRef = useRef<FocusHandle>(null)
  const mobileSearchRef = useRef<FocusHandle>(null)
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)

  const [focusSearch, setFocusSearch] = useState(false)
  const openMobileNavigation = (search = false) => {
    setFocusSearch(search)
    setMobileNavigationOpen(true)
  }
  const closeMobileNavigation = () => setMobileNavigationOpen(false)

  useHotkey("Mod+K", () => {
    if (isMobile) {
      openMobileNavigation(true)
      return
    }
    desktopSearchRef.current?.focus()
  })

  return (
    <div className="min-h-svh bg-muted/45 dark:bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm lg:hidden dark:bg-card/95">
        <Drawer
          title="Navigation"
          placement="navigation"
          headerVisibility="accessible"
          open={mobileNavigationOpen}
          onOpenChange={setMobileNavigationOpen}
          initialFocus={focusSearch ? "search" : "content"}
          trigger={{ label: "Open navigation", icon: "menu", iconOnly: true }}
        >
          <NavigationContent
            onNavigate={closeMobileNavigation}
            searchRef={mobileSearchRef}
            user={user}
          />
        </Drawer>
        <div className="grid size-7 place-items-center rounded-lg bg-accent text-xs font-bold text-accent-foreground">
          C
        </div>
        <Text role="inline" weight="semibold">
          {pageTitle(pathname)}
        </Text>
      </header>
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-background px-4 py-6 lg:flex lg:flex-col dark:bg-card">
        <NavigationContent searchRef={desktopSearchRef} user={user} />
      </aside>
      <main className="lg:pl-72">{children}</main>
    </div>
  )
}
