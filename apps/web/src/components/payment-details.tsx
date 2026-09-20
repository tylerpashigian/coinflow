import { ActionMenu } from "@workspace/ui/components/action-menu"
import { AlertDialog } from "@workspace/ui/components/alert-dialog"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import { KeyValueList } from "@workspace/ui/components/key-value-list"
import { Tabs } from "@workspace/ui/components/tabs"
import { notify } from "@workspace/ui/components/toast"
import { useState } from "react"
import type { Payment } from "@/data/models/payment"
import { refundPayment, reportPaymentFraud } from "@/services/payments-service"
import { formatCurrency, formatSentence } from "@/lib/format"

function TimelineEvent({
  title,
  detail,
  time,
}: {
  title: string
  detail: string
  time: string
}) {
  return (
    <div className="grid grid-cols-[0.75rem_1fr] gap-3">
      <span className="mt-1.5 size-2 rounded-full bg-success" />
      <div className="border-b border-border/70 pb-3">
        <div className="flex justify-between gap-3">
          <strong className="text-sm">{title}</strong>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </div>
    </div>
  )
}
type PaymentDetailsProps = {
  payment: Payment
  onPaymentUpdated: (payment: Payment) => Promise<void> | void
  onViewCustomer: (customerId: string) => void
}

export function PaymentDetails({
  payment,
  onPaymentUpdated,
  onViewCustomer,
}: PaymentDetailsProps) {
  const [current, setCurrent] = useState(payment)
  const [action, setAction] = useState<"refund" | "fraud" | null>(null)
  const [pending, setPending] = useState(false)
  const settled = current.status === "settled"
  const confirm = async () => {
    if (!action) return
    setPending(true)
    try {
      const next =
        action === "refund"
          ? await refundPayment(current.id)
          : await reportPaymentFraud(current.id)
      setCurrent(next)
      await onPaymentUpdated(next)
      notify({
        type: "success",
        title:
          action === "refund"
            ? "Refund requested"
            : "Payment flagged for review",
      })
      setAction(null)
    } catch {
      notify({
        type: "error",
        title: "Payment could not be updated",
        description: "Try again.",
      })
    } finally {
      setPending(false)
    }
  }
  const item = (
    id: string,
    label: string,
    onSelect: () => void,
    tone?: "default" | "destructive"
  ) => ({ id, label, onSelect, tone })
  const copyTransactionReference = async () => {
    try {
      await navigator.clipboard.writeText(current.transactionReference)
      notify({
        type: "success",
        title: "Transaction reference copied",
      })
    } catch {
      notify({
        type: "error",
        title: "Transaction reference could not be copied",
        description: "Copy it from the Processing tab instead.",
      })
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums">
            {formatCurrency(current.amount)}
          </p>
          <div className="mt-1 flex gap-2">
            <Badge variant={settled ? "success" : "destructive"}>
              {formatSentence(current.status)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(current.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <ActionMenu
          label="Payment actions"
          items={[
            item("refund", "Refund payment", () => setAction("refund")),
            item(
              "flag-fraud",
              "Flag as fraud",
              () => setAction("fraud"),
              "destructive"
            ),
            item("view-customer", "View customer", () =>
              onViewCustomer(current.customerId)
            ),
            item(
              "copy-transaction-reference",
              "Copy transaction reference",
              copyTransactionReference
            ),
          ]}
        />
      </div>
      <Tabs
        label="Payment investigation"
        variant="line"
        items={[
          {
            value: "overview",
            label: "Overview",
            content: (
              <div className="space-y-4">
                <Card
                  variant="record"
                  density="compact"
                  summary={`${current.cardBrand} •••• ${current.cardLast4}`}
                  description={`${current.method} · ${current.merchantName}`}
                  details={[
                    { label: "Payment ID", value: current.id },
                    { label: "Customer", value: current.customerName },
                  ]}
                />
                <KeyValueList
                  title="Payment outcome"
                  description="The customer-facing result and protection signals"
                  items={[
                    {
                      label: "Chargeback protection",
                      value: formatSentence(current.protection),
                    },
                    {
                      label: "3DS authentication",
                      value: formatSentence(current.threeDS),
                    },
                    {
                      label: "Processor result",
                      value: formatSentence(current.orchestrationResult),
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            value: "timeline",
            label: "Timeline",
            content: (
              <section>
                <p className="mb-4 text-sm text-muted-foreground">
                  A chronological evidence trail for this transaction.
                </p>
                <div className="space-y-4">
                  <TimelineEvent
                    title={`Payment ${formatSentence(current.status)}`}
                    detail={`${current.method} · ${formatCurrency(current.amount)} · ${current.processor}`}
                    time="Now"
                  />
                  <TimelineEvent
                    title={
                      current.threeDS === "passed"
                        ? "Authentication passed"
                        : "Authentication not requested"
                    }
                    detail="Authentication outcome recorded"
                    time="1 min earlier"
                  />
                  <TimelineEvent
                    title="Payment created"
                    detail={`Checkout started for ${current.customerName}`}
                    time="2 min earlier"
                  />
                </div>
              </section>
            ),
          },
          {
            value: "processing",
            label: "Processing",
            content: (
              <div className="space-y-4">
                <KeyValueList
                  title="Routing"
                  description="Secondary operational context"
                  items={[
                    { label: "Processor", value: current.processor },
                    {
                      label: "Orchestration",
                      value: formatSentence(current.orchestrationResult),
                    },
                    {
                      label: "Transaction reference",
                      value: current.transactionReference,
                    },
                  ]}
                />
                <KeyValueList
                  title="Totals and fees"
                  items={[
                    {
                      label: "Gross amount",
                      value: formatCurrency(current.amount),
                    },
                    {
                      label: "Coinflow fee",
                      value: formatCurrency(current.fee),
                    },
                    {
                      label: "Processor fee",
                      value: formatCurrency(current.processorFee),
                    },
                    {
                      label: "Net",
                      value: formatCurrency(
                        current.amount - current.fee - current.processorFee
                      ),
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
      <AlertDialog
        open={action !== null}
        onOpenChange={(open) => !open && setAction(null)}
        title={
          action === "refund" ? "Request a refund?" : "Flag payment for review?"
        }
        description={
          action === "refund"
            ? "This demo will update the in-session payment record."
            : "This demo will update the in-session review signal."
        }
        confirmLabel={action === "refund" ? "Request refund" : "Flag payment"}
        onConfirm={confirm}
        pending={pending}
        tone="destructive"
      />
    </div>
  )
}
