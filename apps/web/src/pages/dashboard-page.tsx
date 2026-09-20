import { Select } from "@workspace/ui/components/select"
import { useState } from "react"
import { Card } from "@workspace/ui/components/card"
import {
  LineChart,
  type LineChartSeries,
} from "@workspace/ui/components/line-chart"
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

type DashboardDomain = "payments" | "payouts"

export function DashboardPage() {
  const [metric, setMetric] = useState<DashboardMetric>("amount")
  const [domain, setDomain] = useState<DashboardDomain>("payments")
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
  const selectedSeries =
    domain === "payments" ? data.paymentSeries : data.payoutSeries
  const selectedBreakdown =
    domain === "payments" ? data.paymentBreakdown : data.payoutBreakdown
  const selectedTotal =
    domain === "payments"
      ? metric === "amount"
        ? data.summaries.payments
        : data.summaries.paymentCount
      : metric === "amount"
        ? data.summaries.payouts
        : data.summaries.payoutCount
  const chartSeries: LineChartSeries[] = [
    {
      id: "total",
      label: `All ${domain}`,
      data: chartPoints(selectedSeries),
      tone: "primary",
    },
    ...selectedBreakdown.map((series, index) => ({
      id: series.id,
      label: series.label,
      data: chartPoints(series.points),
      tone: (["secondary", "tertiary", "quaternary", "quinary"] as const)[
        index % 4
      ],
    })),
  ]

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
          icon="payments"
          detail={data.rangeLabel}
        />
        <SummaryCard
          label="New customers"
          value={new Intl.NumberFormat("en-US").format(
            data.summaries.newCustomers
          )}
          icon="customers"
          detail={data.rangeLabel}
        />
        <SummaryCard
          label="Payouts"
          value={formatCurrency(data.summaries.payouts)}
          icon="wallet"
          detail={data.rangeLabel}
        />
      </div>
      <div className="mt-7">
        <ActivityChart
          domain={domain}
          metric={metric}
          onDomainChange={setDomain}
          onMetricChange={setMetric}
          series={chartSeries}
          total={metricValue(selectedTotal)}
        />
      </div>
    </section>
  )
}

function SummaryCard({
  label,
  value,
  icon,
  detail,
}: {
  label: string
  value: string
  icon: "payments" | "customers" | "wallet"
  detail: string
}) {
  return (
    <Card
      variant="metric"
      title={label}
      summary={value}
      footer={detail}
      metricIcon={icon}
    />
  )
}

function ActivityChart({
  domain,
  metric,
  onDomainChange,
  onMetricChange,
  series,
  total,
}: {
  domain: DashboardDomain
  metric: DashboardMetric
  onDomainChange: (value: DashboardDomain) => void
  onMetricChange: (value: DashboardMetric) => void
  series: readonly LineChartSeries[]
  total: string
}) {
  return (
    <Card density="spacious">
      <div className="flex flex-col gap-5 border-b border-border/70 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <Text role="heading" headingLevel={3} weight="semibold">
            {domain === "payments" ? "Payment activity" : "Payout activity"}
          </Text>
          <Text variant="caption" tone="muted">
            Aggregate volume and method mix by day
          </Text>
        </div>
        <Tabs
          label="Activity domain"
          items={[
            { value: "payments", label: "Payments" },
            { value: "payouts", label: "Payouts" },
          ]}
          value={domain}
          onValueChange={(value) => {
            if (value === "payments" || value === "payouts")
              onDomainChange(value)
          }}
        />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Text tone="muted">{metric === "amount" ? "Settled volume" : "Settled transactions"}</Text>
          <Text size="xl" weight="semibold">
            {total}
          </Text>
        </div>
        <Tabs
          label="Activity measure"
          items={[
            { value: "amount", label: "Amount" },
            { value: "count", label: "Count" },
          ]}
          value={metric}
          onValueChange={(value) => {
            if (value === "amount" || value === "count") onMetricChange(value)
          }}
        />
      </div>
      <div className="mt-6 min-h-80">
        <LineChart
          ariaLabel={`${domain} ${metric} activity trend`}
          series={series}
          height={360}
        />
      </div>
    </Card>
  )
}
