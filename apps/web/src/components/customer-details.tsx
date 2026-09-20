import { useMemo, useState } from "react"
import { ActionMenu } from "@workspace/ui/components/action-menu"
import { AlertDialog } from "@workspace/ui/components/alert-dialog"
import { Card } from "@workspace/ui/components/card"
import { KeyValueList } from "@workspace/ui/components/key-value-list"
import { Tabs } from "@workspace/ui/components/tabs"
import { notify } from "@workspace/ui/components/toast"
import type { Customer } from "@/data/models/customer"
import type { InvestigationEvent } from "@/data/models/payment"
import { formatSentence } from "@/lib/format"
import {
  addCustomerNote,
  requestCustomerVerification,
  setCustomerBlocked,
} from "@/services/customers-service"

type CustomerAction = "block" | "verification" | "note" | null

type CustomerDetailsProps = {
  customer: Customer
  onCustomerUpdated: (customer: Customer) => Promise<void> | void
  onViewRelatedPayments: (customer: Customer) => void
}

function Event({ event }: { event: InvestigationEvent }) {
  return (
    <div className="grid grid-cols-[0.75rem_1fr] gap-3">
      <span
        className={`mt-1.5 size-2 rounded-full ${event.actor === "operator" ? "bg-chart-1" : "bg-muted-foreground/50"}`}
      />
      <div className="border-b border-border/80 pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <strong className="text-sm font-semibold">{event.title}</strong>
          <span className="text-xs text-muted-foreground">
            {new Date(event.occurredAt).toLocaleString()}
          </span>
        </div>
        {event.detail ? (
          <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          Recorded by{" "}
          {event.actor === "operator" ? "an operator" : "the system"}
        </p>
      </div>
    </div>
  )
}

export function CustomerDetails({
  customer,
  onCustomerUpdated,
  onViewRelatedPayments,
}: CustomerDetailsProps) {
  const [current, setCurrent] = useState(customer)
  const [action, setAction] = useState<CustomerAction>(null)
  const [note, setNote] = useState("")
  const [pending, setPending] = useState(false)

  const events = useMemo(
    () =>
      [...current.activities].sort(
        (left, right) =>
          Date.parse(right.occurredAt) - Date.parse(left.occurredAt)
      ),
    [current.activities]
  )
  const auditEvents = events.filter((event) => event.actor === "operator")
  const latestVerificationEvent = events.find(
    (event) => event.type === "verification"
  )

  const closeAction = (open: boolean) => {
    if (!open && !pending) {
      setAction(null)
      setNote("")
    }
  }

  const confirmAction = async () => {
    if (!action) return
    setPending(true)
    try {
      const next =
        action === "block"
          ? await setCustomerBlocked(current.id, !current.blocked)
          : action === "verification"
            ? await requestCustomerVerification(current.id)
            : await addCustomerNote(current.id, note.trim())
      setCurrent(next)
      await onCustomerUpdated(next)
      notify({
        type: "success",
        title:
          action === "block"
            ? next.blocked
              ? "Customer blocked"
              : "Customer unblocked"
            : action === "verification"
              ? "Verification requested"
              : "Internal note added",
      })
      setAction(null)
      setNote("")
    } catch {
      notify({
        type: "error",
        title: "Customer could not be updated",
        description: "Try again.",
      })
    } finally {
      setPending(false)
    }
  }

  const actionCopy =
    action === "block"
      ? {
          title: current.blocked ? "Unblock customer?" : "Block customer?",
          description: current.blocked
            ? "This restores the customer’s ability to transact in this demo."
            : "This prevents the customer from transacting in this demo.",
          confirmLabel: current.blocked ? "Unblock customer" : "Block customer",
          tone: current.blocked
            ? ("default" as const)
            : ("destructive" as const),
        }
      : action === "verification"
        ? {
            title: "Request verification?",
            description:
              "This marks verification as pending and records the request in the customer history.",
            confirmLabel: "Request verification",
            tone: "default" as const,
          }
        : {
            title: "Add internal note",
            description:
              "Notes are visible to operators in this customer’s audit history.",
            confirmLabel: "Add note",
            tone: "default" as const,
          }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold tracking-[-0.01em]">
            {current.name}
          </p>
          <p className="text-sm text-muted-foreground">{current.email}</p>
        </div>
        <ActionMenu
          label="Customer actions"
          items={[
            {
              id: "toggle-block",
              label: current.blocked ? "Unblock customer" : "Block customer",
              tone: current.blocked ? "default" : "destructive",
              onSelect: () => setAction("block"),
            },
            {
              id: "request-verification",
              label: "Request verification",
              disabled: current.verification === "pending",
              onSelect: () => setAction("verification"),
            },
            {
              id: "add-internal-note",
              label: "Add internal note",
              onSelect: () => setAction("note"),
            },
            {
              id: "view-related-payments",
              label: "View related payments",
              onSelect: () => onViewRelatedPayments(current),
            },
          ]}
        />
      </div>
      <Tabs
        label="Customer investigation"
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
                  summary={current.merchantName}
                  description={`Customer since ${new Date(current.createdAt).toLocaleDateString()}`}
                  details={[
                    {
                      label: "Account status",
                      value: current.blocked ? "Blocked" : "Active",
                    },
                    {
                      label: "Verification",
                      value: formatSentence(current.verification),
                    },
                  ]}
                />
                <KeyValueList
                  title="Review controls"
                  description="Current customer protection settings"
                  items={[
                    {
                      label: "Protection",
                      value: formatSentence(current.protection),
                    },
                    {
                      label: "3DS processing",
                      value: formatSentence(current.threeDSProcessing),
                    },
                    {
                      label: "Attempt limit",
                      value: String(current.attemptLimit),
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            value: "activity",
            label: "Activity",
            content: (
              <section>
                <p className="mb-4 text-sm text-muted-foreground">
                  Payments, reviews, and operator events for this customer.
                </p>
                <div className="space-y-4">
                  {events.map((event) => (
                    <Event event={event} key={event.id} />
                  ))}
                </div>
              </section>
            ),
          },
          {
            value: "methods",
            label: "Methods",
            content: (
              <KeyValueList
                title="Saved methods"
                description="Payment instruments associated with this customer"
                items={current.methods.map((method) => ({
                  label: `${formatSentence(method.type)} · ${method.brand}`,
                  value: `•••• ${method.last4}`,
                }))}
              />
            ),
          },
          {
            value: "verification",
            label: "Verification",
            content: (
              <KeyValueList
                title="Verification outcome"
                description="Plain-language identity and policy result"
                items={[
                  {
                    label: "Status",
                    value: formatSentence(current.verification),
                  },
                  {
                    label: "Last event",
                    value: latestVerificationEvent
                      ? latestVerificationEvent.title
                      : "No verification event recorded",
                  },
                  {
                    label: "Next step",
                    value:
                      current.verification === "enforced"
                        ? "No action required"
                        : current.verification === "pending"
                          ? "Await verification outcome"
                          : "Request verification",
                  },
                ]}
              />
            ),
          },
          {
            value: "audit",
            label: "Audit log",
            content: (
              <section className="space-y-5">
                <KeyValueList
                  title="Internal notes"
                  description="Notes visible only to operations teammates"
                  items={
                    current.notes.length
                      ? current.notes.map((item) => ({
                          label: new Date(item.createdAt).toLocaleString(),
                          value: item.body,
                        }))
                      : [{ label: "Notes", value: "No internal notes yet" }]
                  }
                />
                <div>
                  <p className="text-sm font-medium">Operator history</p>
                  <div className="mt-4 space-y-4">
                    {auditEvents.length ? (
                      auditEvents.map((event) => (
                        <Event event={event} key={event.id} />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No operator actions recorded yet.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            ),
          },
        ]}
      />
      <AlertDialog
        open={action !== null}
        onOpenChange={closeAction}
        title={actionCopy.title}
        description={actionCopy.description}
        confirmLabel={actionCopy.confirmLabel}
        onConfirm={confirmAction}
        pending={pending}
        tone={actionCopy.tone}
        input={
          action === "note"
            ? {
                label: "Internal note",
                value: note,
                onValueChange: setNote,
                placeholder: "Add context for the next operator",
                required: true,
              }
            : undefined
        }
      />
    </div>
  )
}
