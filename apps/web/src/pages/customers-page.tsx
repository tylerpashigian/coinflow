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
import { Button } from "@workspace/ui/components/button"
import { Toolbar, type ToolbarItem } from "@workspace/ui/components/toolbar"
import { notify } from "@workspace/ui/components/toast"
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
        badge:
          row.verification === "enforced"
            ? "success"
            : row.verification === "pending"
              ? "warning"
              : "outline",
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
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<
    readonly string[]
  >([])
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
  const hasSelectedCustomers = selectedCustomerIds.length > 0
  const toolbarItems: readonly ToolbarItem[] = [
    {
      id: "clear-selection",
      icon: "close",
      label: "Clear selection",
      onPress: () => setSelectedCustomerIds([]),
    },
    {
      id: "delete-customers",
      icon: "trash",
      label: "Delete selected customers",
      onPress: () => {
        notify({ type: "success", title: "Mocked delete complete" })
      },
      tone: "destructive",
    },
  ]

  return (
    <section
      className={`mx-auto max-w-[112rem] p-6 md:p-10 ${
        isEditing && hasSelectedCustomers ? "pb-24 md:pb-28" : ""
      }`}
    >
      <header className="mb-7 grid gap-6 border-b border-border pb-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0 space-y-1">
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
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-end lg:pb-0.5">
          <Button
            label="Edit Customers"
            onPress={() => {
              if (isEditing) setSelectedCustomerIds([])
              setIsEditing((editing) => !editing)
            }}
            variant={isEditing ? "secondary" : "outline"}
          />
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
        selectType={isEditing ? "multi" : undefined}
        selectedIds={selectedCustomerIds}
        onSelectionChange={setSelectedCustomerIds}
        density="compact"
        pinLeadingColumn
        defaultSorting={{ column: "createdAt", direction: "descending" }}
        onRowActivate={(id) => {
          const row = filteredCustomers.find((row) => row.id === id)
          if (row) onSelectCustomer(row)
        }}
      />
      <Toolbar
        ariaLabel="Customer bulk actions"
        items={toolbarItems}
        open={isEditing && hasSelectedCustomers}
        summary={`${selectedCustomerIds.length} ${
          selectedCustomerIds.length === 1 ? "customer" : "customers"
        } selected`}
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
