import { Card } from "@workspace/ui/components/card"
import { Text } from "@workspace/ui/components/text"
import type { Payment } from "@/data/models/payment"
import { formatCurrency } from "@/lib/format"

export function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Text as="p" size="xl" weight="semibold">
          {formatCurrency(payment.amount)}
        </Text>
        <Text tone="muted">
          {payment.status} · {new Date(payment.createdAt).toLocaleString()}
        </Text>
        <Detail label="Payment ID" value={payment.id} />
      </Card>
      <DetailsCard title="Payment method">
        <Detail label="Method" value={payment.method} />
        <Detail
          label="Card"
          value={`${payment.cardBrand} •••• ${payment.cardLast4}`}
        />
      </DetailsCard>
      <DetailsCard title="Risk and authentication">
        <Detail
          label="Protection"
          value={payment.protection.replace("_", " ")}
        />
        <Detail label="3DS" value={payment.threeDS.replace("_", " ")} />
      </DetailsCard>
      <DetailsCard title="Processing">
        <Detail label="Processor" value={payment.processor} />
        <Detail label="Orchestration" value={payment.orchestrationResult} />
      </DetailsCard>
      <DetailsCard title="Fees">
        <Detail label="Coinflow fee" value={formatCurrency(payment.fee)} />
        <Detail
          label="Processor fee"
          value={formatCurrency(payment.processorFee)}
        />
      </DetailsCard>
    </div>
  )
}

function DetailsCard({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <Card className="space-y-2 p-4">
      <Text weight="semibold">{title}</Text>
      {children}
    </Card>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Text tone="muted">{label}</Text>
      <Text className="text-right" weight="medium">
        {value}
      </Text>
    </div>
  )
}
