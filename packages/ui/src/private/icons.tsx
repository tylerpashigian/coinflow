import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  Wallet01Icon,
  CreditCardIcon,
  UserGroupIcon,
  Analytics01Icon,
  ChartLineData01Icon,
  Menu01Icon,
  Cancel01Icon,
  Search01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons"
export type IconName =
  | "home"
  | "wallet"
  | "payments"
  | "customers"
  | "analytics"
  | "chart"
  | "menu"
  | "close"
  | "search"
  | "calendar"
const icons = {
  home: Home01Icon,
  wallet: Wallet01Icon,
  payments: CreditCardIcon,
  customers: UserGroupIcon,
  analytics: Analytics01Icon,
  chart: ChartLineData01Icon,
  menu: Menu01Icon,
  close: Cancel01Icon,
  search: Search01Icon,
  calendar: Calendar03Icon,
}
export function Icon({ name }: { name: IconName }) {
  return (
    <HugeiconsIcon
      icon={icons[name]}
      size={17}
      strokeWidth={1.8}
      aria-hidden="true"
    />
  )
}
