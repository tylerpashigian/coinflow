import { useMemo } from "react"
import { defineChart, lineY } from "@tanstack/charts"
import { Chart } from "@tanstack/charts/react"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

export interface LineChartPoint {
  label: string
  value: number
}

export type LineChartTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary"

export interface LineChartSeries {
  id: string
  label: string
  data: readonly LineChartPoint[]
  tone?: LineChartTone
}

export interface LineChartProps {
  ariaLabel: string
  tone?: LineChartTone
  /** Single-series data retained for compact trend usage. */
  data?: readonly LineChartPoint[]
  /** Named series for comparison charts; a legend is rendered automatically. */
  series?: readonly LineChartSeries[]
  /** Height in pixels. Use this rather than styling a chart per consuming route. */
  height?: number
}

const chartColors: Record<LineChartTone, string> = {
  primary: "var(--chart-1)",
  secondary: "var(--chart-2)",
  tertiary: "var(--chart-3)",
  quaternary: "var(--chart-4)",
  quinary: "var(--chart-5)",
}

const legendColors: Record<LineChartTone, string> = {
  primary: "bg-chart-1",
  secondary: "bg-chart-2",
  tertiary: "bg-chart-3",
  quaternary: "bg-chart-4",
  quinary: "bg-chart-5",
}

/** Shared responsive TanStack Charts presentation for single or named multi-series data. */
export function LineChart({
  ariaLabel,
  tone = "primary",
  data,
  series,
  height = 264,
}: LineChartProps) {
  const resolvedSeries =
    series ??
    (data
      ? [
          {
            id: "series",
            label: "Series",
            data,
            tone,
          },
        ]
      : [])
  const definition = useMemo(
    () =>
      defineChart({
        marks: resolvedSeries.map((line, index) =>
          lineY(line.data, {
            x: "label",
            y: "value",
            stroke: chartColors[
              line.tone ??
                (index === 0
                  ? "primary"
                  : (["secondary", "tertiary", "quaternary", "quinary"] as const)[
                      (index - 1) % 4
                    ])
            ],
            points: true,
          })
        ),
        scales: {
          x: { scale: scalePoint },
          y: { scale: scaleLinear, nice: true },
        },
      }),
    [resolvedSeries]
  )

  return (
    <div className="space-y-3">
      <Chart ariaLabel={ariaLabel} definition={definition} height={height} />
      {resolvedSeries.length > 1 && (
        <ul aria-label={`${ariaLabel} legend`} className="flex flex-wrap gap-x-4 gap-y-2">
          {resolvedSeries.map((line, index) => {
            const lineTone =
              line.tone ??
              (index === 0
                ? "primary"
                : (["secondary", "tertiary", "quaternary", "quinary"] as const)[
                    (index - 1) % 4
                  ])
            return (
              <li className="flex items-center gap-2 text-xs text-muted-foreground" key={line.id}>
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${legendColors[lineTone]}`}
                />
                {line.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
