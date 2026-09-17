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
import { PaymentDetails } from "@/components/payment-details"
import { PageFeedback } from "@/components/page-feedback"
import { ResponsiveDetailDrawer } from "@/components/responsive-detail-drawer"
import type { Payment } from "@/data/models/payment"
import { usePayments } from "@/hooks/use-payments"
import { useStablePending } from "@/hooks/use-stable-pending"
import { filterByDateRange } from "@/lib/filter-by-date-range"
import { formatCurrency, formatShortDate } from "@/lib/format"

const columns: DataTableProps<Payment>["columns"] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ getValue }) => formatShortDate(getValue() as string),
    sortDescFirst: true,
  },
  { accessorKey: "merchantName", header: "Merchant" },
  { accessorKey: "id", header: "Payment ID" },
  { accessorKey: "method", header: "Method" },
  { accessorKey: "processor", header: "Processor" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => formatCurrency(getValue() as number),
  },
  { accessorKey: "customerName", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = String(getValue())
      return (
        <Badge variant={status === "settled" ? "success" : "destructive"}>
          {status}
        </Badge>
      )
    },
  },
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
    accessorKey: "threeDS",
    header: "3DS",
    cell: ({ getValue }) => {
      const threeDS = String(getValue())
      return (
        <Badge variant={threeDS === "passed" ? "success" : "outline"}>
          {threeDS.replace("_", " ")}
        </Badge>
      )
    },
  },
]

type PurchasesPageProps = {
  onCloseDetail: () => void
  onSelectPayment: (payment: Payment) => void
  selectedPayment?: Payment | null
}

export function PurchasesPage({
  onCloseDetail,
  onSelectPayment,
  selectedPayment,
}: PurchasesPageProps) {
  const payments = usePayments()
  const [dateRange, setDateRange] = useState<DateRange>()
  const showPending = useStablePending(payments.status === "loading")

  if (payments.status === "loading" || (payments.status === "ready" && showPending))
    return showPending ? (
      <PageFeedback message="Loading purchases…" status="loading" />
    ) : null
  if (payments.status === "error")
    return <PageFeedback message="Unable to load purchases." status="error" />

  const filteredPayments = filterByDateRange(payments.data, dateRange)
  const latestPaymentDate = new Date(
    Math.max(...payments.data.map((payment) => Date.parse(payment.createdAt)))
  )

  return (
    <section className="p-5 md:p-9">
      <div className="mb-8">
        <Text as="h2" variant="heading">
          Purchases
        </Text>
        <Text tone="muted">Review payments and processing outcomes.</Text>
      </div>
      <FormField className="mb-4" label="Purchase date range">
        <DateRangePicker
          defaultMonth={latestPaymentDate}
          onValueChange={setDateRange}
          value={dateRange}
        />
      </FormField>
      <DataTable
        ariaLabel="Purchases"
        columns={columns}
        data={filteredPayments}
        getRowId={(payment) => payment.id}
        initialSorting={[{ id: "createdAt", desc: true }]}
        onRowClick={onSelectPayment}
      />
      <ResponsiveDetailDrawer
        open={selectedPayment !== undefined}
        onOpenChange={(open) => !open && onCloseDetail()}
        title="Payment details"
        description="Payment record and processing information."
      >
        {selectedPayment ? (
          <PaymentDetails payment={selectedPayment} />
        ) : (
          <Text tone="muted">This purchase could not be found.</Text>
        )}
      </ResponsiveDetailDrawer>
    </section>
  )
}
