import { Card } from "@workspace/ui/components/card"
import { Tabs } from "@workspace/ui/components/tabs"
import type { Customer } from "@/data/models/customer"
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
            <Card
              density="compact"
              title={customer.name}
              description={customer.email}
              details={[
                { label: "Merchant", value: customer.merchantName },
                {
                  label: "Protection",
                  value: customer.protection.replaceAll("_", " "),
                },
                { label: "3DS processing", value: customer.threeDSProcessing },
                {
                  label: "Attempt limit",
                  value: String(customer.attemptLimit),
                },
              ]}
            />
          ),
        },
        {
          value: "activity",
          label: "Activity",
          content: customer.activities.map((activity) => (
            <Card
              key={activity.occurredAt}
              density="compact"
              title={activity.description}
              description={new Date(activity.occurredAt).toLocaleString()}
            />
          )),
        },
        {
          value: "methods",
          label: "Methods",
          content: customer.methods.map((method) => (
            <Card
              key={`${method.brand}-${method.last4}`}
              density="compact"
              title={method.type}
              description={`${method.brand} •••• ${method.last4}`}
            />
          )),
        },
      ]}
    />
  )
}
