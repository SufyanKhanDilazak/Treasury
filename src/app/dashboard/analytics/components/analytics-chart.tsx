"use client"

import { useMemo } from "react"
import type { Order } from "@/lib/supabase"

interface AnalyticsChartProps {
  orders: Order[]
}

export function AnalyticsChart({ orders }: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return last30Days.map((date) => {
      const dayOrders = orders.filter((order) => order.created_at.split("T")[0] === date)
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0)
      return { date, revenue }
    })
  }, [orders])

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1)

  return (
    <div className="space-y-4">
      {chartData.map((day) => (
        <div key={day.date} className="flex items-center space-x-2">
          <div className="w-20 text-xs text-muted-foreground">
            {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
          <div className="flex-1 h-4 bg-gray-200 rounded">
            <div
              className="h-full bg-purple-500 rounded"
              style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
            />
          </div>
          <div className="w-24 text-sm font-medium">PKR {day.revenue.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}