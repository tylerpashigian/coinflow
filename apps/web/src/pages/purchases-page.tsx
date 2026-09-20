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
import { PaymentDetails } from "@/components/payment-details"
import { PageFeedback } from "@/components/page-feedback"
import type { Payment } from "@/data/models/payment"
import { usePayments } from "@/hooks/use-payments"
import { useStablePending } from "@/hooks/use-stable-pending"
import { filterByDateRange } from "@/lib/filter-by-date-range"
import { formatCurrency, formatSentence, formatShortDate } from "@/lib/format"

const columns: readonly TableColumn[] = [
  { id: "createdAt", label: "Date", initialDirection: "descending" },
  { id: "merchantName", label: "Merchant" },
  { id: "id", label: "Payment ID" },
  { id: "method", label: "Method" },
  { id: "processor", label: "Processor" },
  { id: "amount", label: "Amount" },
  { id: "customerName", label: "Customer" },
  { id: "status", label: "Status" },
  { id: "protection", label: "Protection" },
  { id: "threeDS", label: "3DS" },
]

function tableRow(row: Payment): TableRowData {
  return {
    id: row.id,
    cells: [
      {
        text: formatShortDate(row.createdAt),
        sortValue: Date.parse(row.createdAt),
      },
      { text: String(row.merchantName) },
      { text: String(row.id) },
      { text: String(row.method) },
      { text: String(row.processor) },
      { text: formatCurrency(row.amount), sortValue: row.amount },
      { text: String(row.customerName) },
      {
        text: formatSentence(row.status),
        badge:
          row.status === "settled"
            ? "success"
            : row.status === "refunded"
              ? "info"
              : "destructive",
      },
      {
        text: formatSentence(row.protection),
        badge: row.protection === "approved" ? "success" : "outline",
      },
      {
        text: formatSentence(row.threeDS),
        badge: row.threeDS === "passed" ? "success" : "outline",
      },
    ],
  }
}

type PurchasesPageProps = {
  customerId?: string
  onCloseDetail: () => void
  onSelectPayment: (payment: Payment) => void
  onViewCustomer: (customerId: string) => void
  selectedPayment?: Payment | null
}

export function PurchasesPage({
  customerId,
  onCloseDetail,
  onSelectPayment,
  onViewCustomer,
  selectedPayment,
}: PurchasesPageProps) {
  const payments = usePayments()
  const [dateRange, setDateRange] = useState<DateRange>()
  const showPending = useStablePending(payments.status === "loading")

  if (
    payments.status === "loading" ||
    (payments.status === "ready" && showPending)
  )
    return showPending ? (
      <PageFeedback message="Loading purchases…" status="loading" />
    ) : null
  if (payments.status === "error")
    return <PageFeedback message="Unable to load purchases." status="error" />

  const filteredPayments = filterByDateRange(payments.data, dateRange).filter(
    (payment) => !customerId || payment.customerId === customerId
  )
  const relatedCustomer = customerId
    ? payments.data.find((payment) => payment.customerId === customerId)
    : undefined
  const latestPaymentDate = new Date(
    Math.max(...payments.data.map((payment) => Date.parse(payment.createdAt)))
  )

  return (
    <section className="mx-auto max-w-[112rem] p-6 md:p-10">
      <header className="mb-7 grid gap-6 border-b border-border pb-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0 space-y-1">
          <Text role="heading" headingLevel={2} variant="heading">
            Purchases
          </Text>
          <Text tone="muted">Review payments and processing outcomes.</Text>
          {relatedCustomer ? (
            <Text variant="caption" tone="muted">
              {`Filtered to ${relatedCustomer.customerName}`}
            </Text>
          ) : null}
          <Text variant="caption" tone="muted">
            {`Showing ${filteredPayments.length} payment records`}
          </Text>
        </div>
        <div className="w-full sm:w-auto lg:pb-0.5">
          <FormField label="Purchase date range" labelVisuallyHidden>
            <DateRangePicker
              defaultMonth={latestPaymentDate}
              onValueChange={setDateRange}
              value={dateRange}
            />
          </FormField>
        </div>
      </header>
      <DataTable
        ariaLabel="Purchases"
        activeRowId={selectedPayment?.id}
        columns={columns}
        rows={filteredPayments.map(tableRow)}
        density="compact"
        pinLeadingColumn
        defaultSorting={{ column: "createdAt", direction: "descending" }}
        onRowActivate={(id) => {
          const row = filteredPayments.find((row) => row.id === id)
          if (row) onSelectPayment(row)
        }}
      />
      <Drawer
        open={selectedPayment !== undefined}
        onOpenChange={(open) => !open && onCloseDetail()}
        title="Payment details"
        description="Payment record and processing information."
        placement="detail"
        size="wide"
        data-testid="responsive-detail-drawer"
      >
        {selectedPayment ? (
          <PaymentDetails
            key={selectedPayment.id}
            payment={selectedPayment}
            onPaymentUpdated={payments.refresh}
            onViewCustomer={onViewCustomer}
          />
        ) : (
          <Text tone="muted">This purchase could not be found.</Text>
        )}
      </Drawer>
    </section>
  )
}
