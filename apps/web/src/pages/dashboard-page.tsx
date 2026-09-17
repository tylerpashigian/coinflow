import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { Card } from "@workspace/ui/components/card"
import { LineChart } from "@workspace/ui/components/line-chart"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Text } from "@workspace/ui/components/text"
import { useDashboardOverview } from "@/hooks/use-dashboard-overview"
import type {
  DashboardMetric,
  DashboardTimezone,
} from "@/data/models/dashboard"
import {
  formatCompactNumber,
  formatCurrency,
  formatShortDate,
} from "@/lib/format"

const dateRanges = {
  previous: { from: "2026-08-17", to: "2026-08-23" },
  current: { from: "2026-08-24", to: "2026-08-30" },
} as const

export function DashboardPage() {
  const [metric, setMetric] = useState<DashboardMetric>("amount")
  const [timezone, setTimezone] = useState<DashboardTimezone>("utc")
  const [range, setRange] = useState<keyof typeof dateRanges>("current")
  const overview = useDashboardOverview({
    ...dateRanges[range],
    metric,
    timezone,
  })

  if (overview.status === "loading")
    return <Text role="status">Loading dashboard overview…</Text>
  if (overview.status === "error")
    return (
      <Text role="alert" tone="danger">
        Unable to load dashboard overview.
      </Text>
    )

  const data = overview.data
  const chartPoints = (series: typeof data.paymentSeries) =>
    series.map((point) => ({
      label: formatShortDate(point.date),
      value: metric === "amount" ? point.amount / 100 : point.count,
    }))
  const metricValue = (value: number) =>
    metric === "amount" ? formatCurrency(value) : formatCompactNumber(value)

  return (
    <section className="p-5 md:p-9">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Text as="h2" variant="heading">
            Overview
          </Text>
          <Text tone="muted">
            A high-level view of payment activity across all merchants.
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium"
            htmlFor="date-range"
          >
            <HugeiconsIcon icon={Calendar03Icon} size={17} /> {data.rangeLabel}
            <select
              aria-label="Date range"
              className="sr-only"
              id="date-range"
              value={range}
              onChange={(event) =>
                setRange(event.target.value as keyof typeof dateRanges)
              }
            >
              <option value="previous">Aug 17 – Aug 23, 2026</option>
              <option value="current">Aug 24 – Aug 30, 2026</option>
            </select>
          </label>
          <Tabs
            value={timezone}
            onValueChange={(value) => {
              if (value === "local" || value === "utc") setTimezone(value)
            }}
          >
            <TabsList aria-label="Timezone">
              <TabsTrigger value="local">Local</TabsTrigger>
              <TabsTrigger value="utc">UTC</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Payments"
          value={formatCurrency(data.summaries.payments)}
          detail={data.rangeLabel}
        />
        <SummaryCard
          label="New customers"
          value={new Intl.NumberFormat("en-US").format(
            data.summaries.newCustomers
          )}
          detail={data.rangeLabel}
        />
        <SummaryCard
          label="Payouts"
          value={formatCurrency(data.summaries.payouts)}
          detail={data.rangeLabel}
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <TrendCard
          color="#2563eb"
          data={chartPoints(data.paymentSeries)}
          metric={metric}
          onMetricChange={setMetric}
          title="Payments"
          total={metricValue(
            metric === "amount"
              ? data.summaries.payments
              : data.summaries.paymentCount
          )}
        />
        <TrendCard
          color="#7c3aed"
          data={chartPoints(data.payoutSeries)}
          metric={metric}
          onMetricChange={setMetric}
          title="Payouts"
          total={metricValue(
            metric === "amount"
              ? data.summaries.payouts
              : data.summaries.payoutCount
          )}
        />
      </div>
    </section>
  )
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <Card className="p-5">
      <Text tone="muted">{label}</Text>
      <Text as="p" size="xl" weight="semibold" className="mt-2 tracking-tight">
        {value}
      </Text>
      <Text variant="caption" tone="muted" className="mt-2">
        {detail}
      </Text>
    </Card>
  )
}

function TrendCard({
  color,
  data,
  metric,
  onMetricChange,
  title,
  total,
}: {
  color: string
  data: { label: string; value: number }[]
  metric: DashboardMetric
  onMetricChange: (value: DashboardMetric) => void
  title: string
  total: string
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Text as="h3" weight="semibold">
            {title}
          </Text>
          <Text variant="caption" tone="muted">
            Settled volume by day
          </Text>
        </div>
        <Text as="p" size="lg" weight="semibold">
          {total}
        </Text>
      </div>
      <div className="mt-5">
        <Tabs
          value={metric}
          onValueChange={(value) => {
            if (value === "amount" || value === "count") onMetricChange(value)
          }}
        >
          <TabsList aria-label={`${title} metric`}>
            <TabsTrigger value="amount">Amount</TabsTrigger>
            <TabsTrigger value="count">Count</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-5 min-h-64">
        <LineChart
          ariaLabel={`${title} ${metric} trend`}
          color={color}
          data={data}
        />
      </div>
    </Card>
  )
}
