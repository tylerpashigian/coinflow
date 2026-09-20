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
import { Drawer } from "@workspace/ui/components/drawer"
import { CustomerDetails } from "@/components/customer-details"
import { PageFeedback } from "@/components/page-feedback"
import type { Customer } from "@/data/models/customer"
import { useCustomers } from "@/hooks/use-customers"
import { useStablePending } from "@/hooks/use-stable-pending"
import { filterByDateRange } from "@/lib/filter-by-date-range"
import { formatSentence, formatShortDate } from "@/lib/format"

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
        text: formatSentence(row.protection),
        badge: row.protection === "approved" ? "success" : "outline",
      },
      {
        text: row.blocked ? "Blocked" : "Active",
        badge: row.blocked ? "destructive" : "success",
      },
      {
        text: formatSentence(row.threeDSProcessing),
        badge: row.threeDSProcessing === "enabled" ? "info" : "outline",
      },
      { text: String(row.attemptLimit), sortValue: row.attemptLimit },
      {
        text: formatSentence(row.verification),
        badge: row.verification === "enforced" ? "success" : "info",
      },
    ],
  }
}

type CustomersPageProps = {
  onCloseDetail: () => void
  onSelectCustomer: (customer: Customer) => void
  onViewRelatedPayments: (customer: Customer) => void
  selectedCustomer?: Customer | null
}

export function CustomersPage({
  onCloseDetail,
  onSelectCustomer,
  onViewRelatedPayments,
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
    <section className="mx-auto max-w-[112rem] p-5 md:p-9">
      <header className="mb-5 grid gap-5 border-b border-border/80 pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <Text role="heading" headingLevel={2} variant="heading">
            Customers
          </Text>
          <Text tone="muted">
            Review customer records, activity, and saved methods.
          </Text>
          <Text variant="caption" tone="muted">
            {`Showing ${filteredCustomers.length} customer records`}
          </Text>
        </div>
        <div className="w-full sm:w-auto">
          <FormField label="Customer date range" labelVisuallyHidden>
            <DateRangePicker
              defaultMonth={latestCustomerDate}
              onValueChange={setDateRange}
              value={dateRange}
            />
          </FormField>
        </div>
      </header>
      <DataTable
        ariaLabel="Customers"
        activeRowId={selectedCustomer?.id}
        columns={columns}
        rows={filteredCustomers.map(tableRow)}
        density="compact"
        pinLeadingColumn
        defaultSorting={{ column: "createdAt", direction: "descending" }}
        onRowActivate={(id) => {
          const row = filteredCustomers.find((row) => row.id === id)
          if (row) onSelectCustomer(row)
        }}
      />
      <Drawer
        open={selectedCustomer !== undefined}
        onOpenChange={(open) => !open && onCloseDetail()}
        title="Customer details"
        description="Customer identity, activity, and saved payment methods."
        placement="detail"
        size="wide"
        data-testid="responsive-detail-drawer"
      >
        {selectedCustomer ? (
          <CustomerDetails
            key={selectedCustomer.id}
            customer={selectedCustomer}
            onCustomerUpdated={async () => {
              await customers.refresh()
            }}
            onViewRelatedPayments={onViewRelatedPayments}
          />
        ) : (
          <Text tone="muted">This customer could not be found.</Text>
        )}
      </Drawer>
    </section>
  )
}
