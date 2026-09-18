import { useMemo } from "react"
import { defineChart, lineY } from "@tanstack/charts"
import { Chart } from "@tanstack/charts/react"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

export interface LineChartPoint {
  label: string
  value: number
}

export interface LineChartProps {
  ariaLabel: string
  tone?: "primary" | "secondary"
  data: readonly LineChartPoint[]
}

/** Shared responsive TanStack Charts presentation for simple time-series data. */
export function LineChart({
  ariaLabel,
  tone = "primary",
  data,
}: LineChartProps) {
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          lineY(data, {
            x: "label",
            y: "value",
            stroke: tone === "primary" ? "var(--chart-1)" : "var(--chart-2)",
            points: true,
          }),
        ],
        scales: {
          x: { scale: scalePoint },
          y: { scale: scaleLinear, nice: true },
        },
      }),
    [tone, data]
  )

  return <Chart ariaLabel={ariaLabel} definition={definition} height={264} />
}
