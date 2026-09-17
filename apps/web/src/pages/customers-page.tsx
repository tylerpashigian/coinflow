import { useState } from "react"
import {
  DataTable,
  type DataTableProps,
} from "@workspace/ui/components/data-table"
import {
  DateRangePicker,
  type DateRange,
} from "@workspace/ui/components/date-range-picker"
import { Badge } from "@workspace/ui/components/badge"
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

const columns: DataTableProps<Customer>["columns"] = [
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => formatShortDate(getValue() as string),
    sortDescFirst: true,
  },
  { accessorKey: "merchantName", header: "Merchant" },
  { accessorKey: "name", header: "Customer" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "protection",
    header: "Protection",
    cell: ({ getValue }) => {
      const protection = String(getValue())
      return (
        <Badge variant={protection === "approved" ? "success" : "outline"}>
          {protection.replace("_", " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "blocked",
    header: "Blocked",
    cell: ({ getValue }) => (
      <Badge variant={getValue() ? "destructive" : "success"}>
        {getValue() ? "Blocked" : "Active"}
      </Badge>
    ),
  },
  {
    accessorKey: "threeDSProcessing",
    header: "3DS processing",
    cell: ({ getValue }) => {
      const processing = String(getValue())
      return (
        <Badge variant={processing === "enabled" ? "info" : "outline"}>
          {processing}
        </Badge>
      )
    },
  },
  { accessorKey: "attemptLimit", header: "Attempt limit" },
  {
    accessorKey: "verification",
    header: "Verification",
    cell: ({ getValue }) => {
      const verification = String(getValue())
      return (
        <Badge variant={verification === "not_found" ? "warning" : "info"}>
          {verification.replace("_", " ")}
        </Badge>
      )
    },
  },
]

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

  if (customers.status === "loading" || (customers.status === "ready" && showPending))
    return showPending ? (
      <PageFeedback message="Loading customers…" status="loading" />
    ) : null
  if (customers.status === "error")
    return <PageFeedback message="Unable to load customers." status="error" />

  const filteredCustomers = filterByDateRange(customers.data, dateRange)
  const latestCustomerDate = new Date(
    Math.max(...customers.data.map((customer) => Date.parse(customer.createdAt)))
  )

  return (
    <section className="p-5 md:p-9">
      <div className="mb-8">
        <Text as="h2" variant="heading">
          Customers
        </Text>
        <Text tone="muted">
          Review customer records, activity, and saved methods.
        </Text>
      </div>
      <FormField className="mb-4" label="Customer date range">
        <DateRangePicker
          defaultMonth={latestCustomerDate}
          onValueChange={setDateRange}
          value={dateRange}
        />
      </FormField>
      <DataTable
        ariaLabel="Customers"
        columns={columns}
        data={filteredCustomers}
        getRowId={(customer) => customer.id}
        initialSorting={[{ id: "createdAt", desc: true }]}
        onRowClick={onSelectCustomer}
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
