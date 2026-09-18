import { useState } from "react"
import {
  DataTable,
  type TableColumn,
  type TableRowData,
} from "@workspace/ui/components/data-table"
import {
  DateRangePicker,
  type DateRange,
} from "@workspace/ui/components/date-range-picker"
import { FormField } from "@workspace/ui/components/field"
import { Text } from "@workspace/ui/components/text"
import { CustomerDetails } from "@/components/customer-details"
import { PageFeedback } from "@/components/page-feedback"
import { ResponsiveDetailDrawer } from "@/components/responsive-detail-drawer"
import type { Customer } from "@/data/models/customer"
import { useCustomers } from "@/hooks/use-customers"
import { useStablePending } from "@/hooks/use-stable-pending"
import { filterByDateRange } from "@/lib/filter-by-date-range"
import { formatShortDate } from "@/lib/format"

const columns: readonly TableColumn[] = [
  { id: "createdAt", label: "Created", initialDirection: "descending" },
  { id: "merchantName", label: "Merchant" },
  { id: "name", label: "Customer" },
  { id: "email", label: "Email" },
  { id: "protection", label: "Protection" },
  { id: "blocked", label: "Blocked" },
  { id: "threeDSProcessing", label: "3DS processing" },
  { id: "attemptLimit", label: "Attempt limit" },
  { id: "verification", label: "Verification" },
]

function tableRow(row: Customer): TableRowData {
  return {
    id: row.id,
    cells: [
      {
        text: formatShortDate(row.createdAt),
        sortValue: Date.parse(row.createdAt),
      },
      { text: String(row.merchantName) },
      { text: String(row.name) },
      { text: String(row.email) },
      {
        text: row.protection.replaceAll("_", " "),
        badge: row.protection === "approved" ? "success" : "outline",
      },
      {
        text: row.blocked ? "Blocked" : "Active",
        badge: row.blocked ? "destructive" : "success",
      },
      {
        text: row.threeDSProcessing.replaceAll("_", " "),
        badge: row.threeDSProcessing === "enabled" ? "info" : "outline",
      },
      { text: String(row.attemptLimit), sortValue: row.attemptLimit },
      {
        text: row.verification.replaceAll("_", " "),
        badge: row.verification === "not_found" ? "warning" : "info",
      },
    ],
  }
}

type CustomersPageProps = {
  onCloseDetail: () => void
  onSelectCustomer: (customer: Customer) => void
  selectedCustomer?: Customer | null
}

export function CustomersPage({
  onCloseDetail,
  onSelectCustomer,
  selectedCustomer,
}: CustomersPageProps) {
  const customers = useCustomers()
  const [dateRange, setDateRange] = useState<DateRange>()
  const showPending = useStablePending(customers.status === "loading")

  if (
    customers.status === "loading" ||
    (customers.status === "ready" && showPending)
  )
    return showPending ? (
      <PageFeedback message="Loading customers…" status="loading" />
    ) : null
  if (customers.status === "error")
    return <PageFeedback message="Unable to load customers." status="error" />

  const filteredCustomers = filterByDateRange(customers.data, dateRange)
  const latestCustomerDate = new Date(
    Math.max(
      ...customers.data.map((customer) => Date.parse(customer.createdAt))
    )
  )

  return (
    <section className="p-5 md:p-9">
      <div className="mb-8">
        <Text role="heading" headingLevel={2} variant="heading">
          Customers
        </Text>
        <Text tone="muted">
          Review customer records, activity, and saved methods.
        </Text>
      </div>
      <div className="mb-4">
        <FormField label="Customer date range">
          <DateRangePicker
            defaultMonth={latestCustomerDate}
            onValueChange={setDateRange}
            value={dateRange}
          />
        </FormField>
      </div>
      <DataTable
        ariaLabel="Customers"
        columns={columns}
        rows={filteredCustomers.map(tableRow)}
        defaultSorting={{ column: "createdAt", direction: "descending" }}
        onRowActivate={(id) => {
          const row = filteredCustomers.find((row) => row.id === id)
          if (row) onSelectCustomer(row)
        }}
      />
      <ResponsiveDetailDrawer
        open={selectedCustomer !== undefined}
        onOpenChange={(open) => !open && onCloseDetail()}
        title="Customer details"
        description="Customer identity, activity, and saved payment methods."
      >
        {selectedCustomer ? (
          <CustomerDetails customer={selectedCustomer} />
        ) : (
          <Text tone="muted">This customer could not be found.</Text>
        )}
      </ResponsiveDetailDrawer>
    </section>
  )
}
