import { Card } from "@workspace/ui/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Text } from "@workspace/ui/components/text"
import type { Customer } from "@/data/models/customer"

export function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Customer details">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="methods">Methods</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4 space-y-4">
        <Card className="space-y-2 p-4">
          <Text weight="semibold">{customer.name}</Text>
          <Text tone="muted">{customer.email}</Text>
          <Detail label="Merchant" value={customer.merchantName} />
          <Detail
            label="Protection"
            value={customer.protection.replace("_", " ")}
          />
          <Detail label="3DS processing" value={customer.threeDSProcessing} />
          <Detail label="Attempt limit" value={String(customer.attemptLimit)} />
        </Card>
      </TabsContent>
      <TabsContent value="activity" className="mt-4 space-y-2">
        {customer.activities.map((activity) => (
          <Card key={activity.occurredAt} className="p-4">
            <Text weight="medium">{activity.description}</Text>
            <Text tone="muted">
              {new Date(activity.occurredAt).toLocaleString()}
            </Text>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value="methods" className="mt-4 space-y-2">
        {customer.methods.map((method) => (
          <Card key={`${method.brand}-${method.last4}`} className="p-4">
            <Text weight="medium">{method.type}</Text>
            <Text tone="muted">
              {method.brand} •••• {method.last4}
            </Text>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
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
