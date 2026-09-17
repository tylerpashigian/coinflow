import { type ReactNode, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { useHotkey } from "@tanstack/react-hotkeys"
import {
  Analytics01Icon,
  ChartLineData01Icon,
  CreditCardIcon,
  Home01Icon,
  Search01Icon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"
import { Input } from "@workspace/ui/components/input"
import { Kbd } from "@workspace/ui/components/kbd"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Text } from "@workspace/ui/components/text"
import { useUser } from "@/hooks/use-user"

const navigation = [
  { label: "Home", icon: Home01Icon, active: true },
  { label: "Liquidity", icon: Wallet01Icon },
  { label: "Purchases", icon: CreditCardIcon, section: "Payments & payouts" },
  { label: "Customers", icon: UserGroupIcon },
  { label: "Chargebacks", icon: Analytics01Icon },
  { label: "Chargeback analytics", icon: ChartLineData01Icon },
  { label: "Compliance center", icon: Analytics01Icon },
  { label: "Exposure analytics", icon: ChartLineData01Icon },
  { label: "Unmatched chargebacks", icon: Analytics01Icon },
]

export function AppShell({ children }: { children: ReactNode }) {
  const user = useUser()
  const searchRef = useRef<HTMLInputElement>(null)

  useHotkey("Mod+K", () => {
    searchRef.current?.focus()
  })

  return (
    <div className="min-h-svh bg-[#f7f8fb] text-slate-950 dark:bg-background dark:text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-4 py-6 lg:flex lg:flex-col dark:border-border dark:bg-card">
        <div className="flex items-center gap-2 px-3">
          <div className="grid size-8 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white">
            C
          </div>
          <Text as="span" size="lg" weight="semibold">
            Coinflow
          </Text>
        </div>
        <div className="mt-8">
          <Text
            as="label"
            className="mb-1 block px-1"
            htmlFor="merchant-id"
            variant="caption"
            tone="muted"
          >
            Merchant ID
          </Text>
          <Select defaultValue="Coinflow Admin">
            <SelectTrigger
              className="h-10 w-full bg-white px-3 text-sm font-medium dark:bg-input/30"
              id="merchant-id"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Coinflow Admin">Coinflow Admin</SelectItem>
              <SelectItem value="Northstar Studio">Northstar Studio</SelectItem>
              <SelectItem value="Acme Commerce">Acme Commerce</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <label className="mt-3 block" htmlFor="global-search">
          <Input
            className="h-10 bg-white px-3 text-sm placeholder:text-slate-400 dark:bg-input/30"
            id="global-search"
            leftComponent={
              <HugeiconsIcon
                icon={Search01Icon}
                size={17}
                strokeWidth={2}
              />
            }
            placeholder="Search"
            ref={searchRef}
            rightComponent={<Kbd>⌘ K</Kbd>}
            type="search"
          />
        </label>
        <nav aria-label="Primary" className="mt-6 space-y-1">
          {navigation.map((item) => (
            <div key={item.label}>
              {item.section ? (
                <Text
                  as="p"
                  variant="caption"
                  tone="muted"
                  className="mt-6 mb-2 px-3 tracking-wide uppercase"
                >
                  {item.section}
                </Text>
              ) : null}
              <button
                aria-current={item.active ? "page" : undefined}
                aria-disabled={!item.active}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${item.active ? "bg-slate-100 font-semibold text-slate-950 dark:bg-accent dark:text-accent-foreground" : "cursor-not-allowed text-slate-400"}`}
                disabled={!item.active}
                type="button"
              >
                <HugeiconsIcon icon={item.icon} size={17} strokeWidth={1.8} />
                {item.label}
              </button>
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t border-slate-100 px-3 pt-5 dark:border-border">
          <div className="grid size-8 place-items-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
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
      </aside>
      <main className="lg:pl-72">{children}</main>
    </div>
  )
}
