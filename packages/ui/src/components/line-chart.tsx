import { useMemo } from "react"
import { areaY, defineChart, lineY } from "@tanstack/charts"
import { Chart } from "@tanstack/charts/react"
import { d3Curve } from "@tanstack/charts/d3/shape"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { curveMonotoneX } from "d3-shape"

export interface LineChartPoint {
  label: string
  value: number
}

export type LineChartTone =
  "primary" | "secondary" | "tertiary" | "quaternary" | "quinary"

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
        marks: resolvedSeries.flatMap((line, index) => {
          const lineTone =
            line.tone ??
            (index === 0
              ? "primary"
              : (["secondary", "tertiary", "quaternary", "quinary"] as const)[
                  (index - 1) % 4
                ])

          const color = chartColors[lineTone]
          const gradientId = `line-chart-${line.id.replace(/[^a-zA-Z0-9_-]/g, "-")}-fill`

          return [
            areaY(line.data, {
              x: "label",
              y1: 0,
              y2: "value",
              fill: `url(#${gradientId})`,
              curve: d3Curve(curveMonotoneX),
            }),
            lineY(line.data, {
              x: "label",
              y: "value",
              stroke: color,
              strokeWidth: 2,
              points: false,
              curve: d3Curve(curveMonotoneX),
            }),
          ]
        }),
        gradients: resolvedSeries.map((line, index) => {
          const lineTone =
            line.tone ??
            (index === 0
              ? "primary"
              : (["secondary", "tertiary", "quaternary", "quinary"] as const)[
                  (index - 1) % 4
                ])

          const color = chartColors[lineTone]
          const id = `line-chart-${line.id.replace(/[^a-zA-Z0-9_-]/g, "-")}-fill`
          const peakOpacity = index === 0 ? 0.42 : 0.24

          return {
            id,
            x1: 0,
            y1: 1,
            x2: 0,
            y2: 0,
            stops: [
              { offset: 0, color, opacity: 0 },
              { offset: 0.22, color, opacity: peakOpacity * 0.32 },
              { offset: 0.62, color, opacity: peakOpacity * 0.72 },
              { offset: 1, color, opacity: peakOpacity },
            ],
          }
        }),
        scales: {
          x: { scale: scalePoint },
          y: { scale: scaleLinear, nice: true },
        },
        clip: true,
      }),
    [resolvedSeries]
  )

  return (
    <div className="space-y-3">
      <Chart ariaLabel={ariaLabel} definition={definition} height={height} />
      {resolvedSeries.length > 1 && (
        <ul
          aria-label={`${ariaLabel} legend`}
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          {resolvedSeries.map((line, index) => {
            const lineTone =
              line.tone ??
              (index === 0
                ? "primary"
                : (["secondary", "tertiary", "quaternary", "quinary"] as const)[
                    (index - 1) % 4
                  ])
            return (
              <li
                className="flex items-center gap-2 text-xs text-muted-foreground"
                key={line.id}
              >
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
