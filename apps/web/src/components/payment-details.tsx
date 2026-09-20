import { Card } from "@workspace/ui/components/card"
import { KeyValueList } from "@workspace/ui/components/key-value-list"
import type { Payment } from "@/data/models/payment"
import { formatCurrency, formatSentence } from "@/lib/format"
export function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <div className="space-y-5">
      <Card
        variant="record"
        density="compact"
        summary={formatCurrency(payment.amount)}
        description={`${formatSentence(payment.status)} · ${new Date(payment.createdAt).toLocaleString()}`}
        details={[
          { label: "Payment ID", value: payment.id },
          { label: "Customer", value: payment.customerName },
        ]}
      />
      <KeyValueList
        title="Payment method"
        items={[
          { label: "Method", value: payment.method },
          {
            label: "Card",
            value: `${payment.cardBrand} •••• ${payment.cardLast4}`,
          },
        ]}
      />
      <KeyValueList
        title="Review controls"
        description="Protection and authentication context"
        items={[
          {
            label: "Protection",
            value: formatSentence(payment.protection),
          },
          { label: "3DS", value: formatSentence(payment.threeDS) },
        ]}
      />
      <KeyValueList
        title="Processing and fees"
        items={[
          { label: "Processor", value: payment.processor },
          {
            label: "Orchestration",
            value: formatSentence(payment.orchestrationResult),
          },
          { label: "Coinflow fee", value: formatCurrency(payment.fee) },
          {
            label: "Processor fee",
            value: formatCurrency(payment.processorFee),
          },
        ]}
      />
    </div>
  )
}
