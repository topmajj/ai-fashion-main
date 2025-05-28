import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Propagate user data
  const { data: userData, error: userError } = await supabase.from("users").select("created_at")

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // Propagate booking data
  const { data: bookingData, error: bookingError } = await supabase.from("bookings").select("created_at, amount")

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  // Propagate credit usage data
  const { data: creditUsageData, error: creditUsageError } = await supabase
    .from("credit_usage")
    .select("created_at, tool_name")

  if (creditUsageError) {
    return NextResponse.json({ error: creditUsageError.message }, { status: 500 })
  }

  // Process and aggregate the data
  const dailyStats = new Map()
  const toolUsage = new Map()

  userData.forEach((user) => {
    const date = new Date(user.created_at).toISOString().split("T")[0]
    if (!dailyStats.has(date)) {
      dailyStats.set(date, { active_users: 0, revenue: 0, new_subscriptions: 1 })
    } else {
      dailyStats.get(date).new_subscriptions += 1
    }
  })

  bookingData.forEach((booking) => {
    const date = new Date(booking.created_at).toISOString().split("T")[0]
    if (!dailyStats.has(date)) {
      dailyStats.set(date, { active_users: 1, revenue: booking.amount, new_subscriptions: 0 })
    } else {
      dailyStats.get(date).active_users += 1
      dailyStats.get(date).revenue += booking.amount
    }
  })

  creditUsageData.forEach((usage) => {
    const date = new Date(usage.created_at).toISOString().split("T")[0]
    if (!toolUsage.has(date)) {
      toolUsage.set(date, new Map())
    }
    if (!toolUsage.get(date).has(usage.tool_name)) {
      toolUsage.get(date).set(usage.tool_name, 1)
    } else {
      toolUsage.get(date).set(usage.tool_name, toolUsage.get(date).get(usage.tool_name) + 1)
    }
  })

  // Insert aggregated data into analytics tables
  for (const [date, stats] of dailyStats) {
    const { error } = await supabase.from("daily_stats").upsert({
      date,
      active_users: stats.active_users,
      revenue: stats.revenue,
      new_subscriptions: stats.new_subscriptions,
    })
    if (error) {
      console.error(`Error inserting daily stats for ${date}:`, error)
    }
  }

  for (const [date, tools] of toolUsage) {
    for (const [toolName, count] of tools) {
      const { error } = await supabase.from("tool_usage").upsert({
        date,
        tool_name: toolName,
        usage_count: count,
      })
      if (error) {
        console.error(`Error inserting tool usage for ${date} and ${toolName}:`, error)
      }
    }
  }

  return NextResponse.json({ success: true })
}
