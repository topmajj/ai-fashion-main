"use client"

import * as React from "react"
import { Bar, Line } from "recharts"

import { cn } from "@/lib/utils"

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Record<string, { label: string; color: string }>
}

const ChartContext = React.createContext<ChartProps["config"] | undefined>(undefined)

function ChartRoot({ config, className, children, ...props }: ChartProps) {
  return (
    <ChartContext.Provider value={config}>
      <div className={cn("recharts-wrapper", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

function ChartTooltip({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("recharts-tooltip border border-border bg-background p-2 shadow-sm", className)} {...props} />
  )
}

function ChartTooltipLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("recharts-tooltip-label font-medium", className)} {...props} />
}

function ChartTooltipItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("recharts-tooltip-item mt-1 flex items-center", className)} {...props} />
}

function ChartTooltipItemLabel({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("recharts-tooltip-item-label", className)} {...props} />
}

function ChartTooltipItemName({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("recharts-tooltip-item-name ml-1", className)} {...props} />
}

function ChartTooltipItemValue({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("recharts-tooltip-item-value ml-1", className)} {...props} />
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: string | number
    dataKey: string
    payload: Record<string, any>
  }>
  label?: string
}

function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  const config = React.useContext(ChartContext)

  if (!active || !payload?.length || !config) {
    return null
  }

  return (
    <ChartTooltip>
      <ChartTooltipLabel>{label}</ChartTooltipLabel>
      {payload.map((item) => {
        const dataKey = item.dataKey
        const itemConfig = config[dataKey]
        const itemColor = itemConfig?.color

        return (
          <ChartTooltipItem key={`item-${dataKey}`}>
            <span
              className="size-2 rounded-full"
              style={{
                backgroundColor: itemColor,
              }}
            />
            <ChartTooltipItemName>{itemConfig?.label}</ChartTooltipItemName>
            <ChartTooltipItemValue>{item.value}</ChartTooltipItemValue>
          </ChartTooltipItem>
        )
      })}
    </ChartTooltip>
  )
}

// Export the LineChart component from recharts
export { Line as LineChart }

// Export the BarChart component from recharts
export { Bar as BarChart }

export {
  ChartRoot as ChartContainer,
  ChartTooltip,
  ChartTooltipLabel,
  ChartTooltipItem,
  ChartTooltipItemLabel,
  ChartTooltipItemName,
  ChartTooltipItemValue,
  ChartTooltipContent,
}
