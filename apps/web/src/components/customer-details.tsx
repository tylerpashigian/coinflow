import { Card } from "@workspace/ui/components/card"
import { KeyValueList } from "@workspace/ui/components/key-value-list"
import { Tabs } from "@workspace/ui/components/tabs"
import type { Customer } from "@/data/models/customer"
import { formatSentence } from "@/lib/format"
export function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <Tabs
      label="Customer details"
      defaultValue="overview"
      items={[
        {
          value: "overview",
          label: "Overview",
          content: (
            <div className="space-y-5">
              <Card
                variant="record"
                density="compact"
                summary={customer.name}
                description={customer.email}
                details={[{ label: "Merchant", value: customer.merchantName }]}
              />
              <KeyValueList
                title="Review controls"
                description="Current customer protection settings"
                items={[
                  {
                    label: "Protection",
                    value: formatSentence(customer.protection),
                  },
                  {
                    label: "3DS processing",
                    value: formatSentence(customer.threeDSProcessing),
                  },
                  {
                    label: "Attempt limit",
                    value: String(customer.attemptLimit),
                  },
                  {
                    label: "Verification",
                    value: formatSentence(customer.verification),
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
            <KeyValueList
              title="Recent activity"
              description="Latest customer events"
              items={customer.activities.map((activity) => ({
                label: new Date(activity.occurredAt).toLocaleString(),
                value: activity.description,
              }))}
            />
          ),
        },
        {
          value: "methods",
          label: "Methods",
          content: (
            <KeyValueList
              title="Saved methods"
              description="Payment methods associated with this customer"
              items={customer.methods.map((method) => ({
                label: formatSentence(method.type),
                value: `${method.brand} •••• ${method.last4}`,
              }))}
            />
          ),
        },
      ]}
    />
  )
}
