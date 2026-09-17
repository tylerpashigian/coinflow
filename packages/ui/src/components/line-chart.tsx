import { useMemo } from "react"
import { defineChart, lineY } from "@tanstack/charts"
import { Chart } from "@tanstack/charts/react"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

export type LineChartPoint = {
  label: string
  value: number
}

type LineChartProps = {
  ariaLabel: string
  color: string
  data: readonly LineChartPoint[]
}

/** Shared responsive TanStack Charts presentation for simple time-series data. */
export function LineChart({ ariaLabel, color, data }: LineChartProps) {
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          lineY(data, { x: "label", y: "value", stroke: color, points: true }),
        ],
        scales: {
          x: { scale: scalePoint },
          y: { scale: scaleLinear, nice: true },
        },
      }),
    [color, data]
  )

  return <Chart ariaLabel={ariaLabel} definition={definition} height={264} />
}
