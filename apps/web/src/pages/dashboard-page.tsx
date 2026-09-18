import { Select } from "@workspace/ui/components/select"
import { useState } from "react"
import { Card } from "@workspace/ui/components/card"
import { LineChart } from "@workspace/ui/components/line-chart"
import { Tabs } from "@workspace/ui/components/tabs"
import { Text } from "@workspace/ui/components/text"
import { PageFeedback } from "@/components/page-feedback"
import { useDashboardOverview } from "@/hooks/use-dashboard-overview"
import { useStablePending } from "@/hooks/use-stable-pending"
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
  const showPending = useStablePending(overview.status === "loading")

  if (
    overview.status === "loading" ||
    (overview.status === "ready" && showPending)
  )
    return showPending ? (
      <PageFeedback message="Loading dashboard overview…" status="loading" />
    ) : null
  if (overview.status === "error")
    return (
      <PageFeedback
        message="Unable to load dashboard overview."
        status="error"
      />
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
    <section className="mx-auto max-w-[96rem] p-5 md:p-9">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-border/80 pb-7 md:flex-row md:items-end">
        <div>
          <Text role="heading" headingLevel={2} variant="heading">
            Operator overview
          </Text>
          <Text tone="muted">
            Settlement activity and customer movement across every merchant.
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Date range"
            value={range}
            onValueChange={(value) => {
              if (value === "previous" || value === "current") setRange(value)
            }}
            options={[
              { value: "previous", label: "Aug 17 – Aug 23, 2026" },
              { value: "current", label: "Aug 24 – Aug 30, 2026" },
            ]}
          />
          <Tabs
            label="Timezone"
            items={[
              { value: "local", label: "Local" },
              { value: "utc", label: "UTC" },
            ]}
            value={timezone}
            onValueChange={(value) => {
              if (value === "local" || value === "utc") setTimezone(value)
            }}
          ></Tabs>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
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
      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.85fr)]">
        <TrendCard
          tone="primary"
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
          tone="secondary"
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
  return <Card variant="metric" title={label} summary={value} footer={detail} />
}

function TrendCard({
  tone,
  data,
  metric,
  onMetricChange,
  title,
  total,
}: {
  tone: "primary" | "secondary"
  data: { label: string; value: number }[]
  metric: DashboardMetric
  onMetricChange: (value: DashboardMetric) => void
  title: string
  total: string
}) {
  return (
    <Card
      density="spacious"
      title={title}
      description="Settled volume by day"
      summary={total}
    >
      <div className="mt-5">
        <Tabs
          label={`${title} metric`}
          items={[
            { value: "amount", label: "Amount" },
            { value: "count", label: "Count" },
          ]}
          value={metric}
          onValueChange={(value) => {
            if (value === "amount" || value === "count") onMetricChange(value)
          }}
        ></Tabs>
      </div>
      <div className="mt-6 min-h-64">
        <LineChart
          ariaLabel={`${title} ${metric} trend`}
          tone={tone}
          data={data}
          height={tone === "primary" ? 320 : 264}
        />
      </div>
    </Card>
  )
}
