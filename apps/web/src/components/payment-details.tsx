import { Card } from "@workspace/ui/components/card"
import type { Payment } from "@/data/models/payment"
import { formatCurrency } from "@/lib/format"
export function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <div className="space-y-4">
      <Card
        variant="record"
        density="compact"
        summary={formatCurrency(payment.amount)}
        description={`${payment.status} · ${new Date(payment.createdAt).toLocaleString()}`}
        details={[{ label: "Payment ID", value: payment.id }]}
      />
      <Card
        density="compact"
        title="Payment method"
        details={[
          { label: "Method", value: payment.method },
          {
            label: "Card",
            value: `${payment.cardBrand} •••• ${payment.cardLast4}`,
          },
        ]}
      />
      <Card
        density="compact"
        title="Risk and authentication"
        details={[
          {
            label: "Protection",
            value: payment.protection.replaceAll("_", " "),
          },
          { label: "3DS", value: payment.threeDS.replaceAll("_", " ") },
        ]}
      />
      <Card
        density="compact"
        title="Processing"
        details={[
          { label: "Processor", value: payment.processor },
          { label: "Orchestration", value: payment.orchestrationResult },
        ]}
      />
      <Card
        density="compact"
        title="Fees"
        details={[
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
