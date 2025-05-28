import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { toolName } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const today = new Date().toISOString().split("T")[0]

  // Update daily_stats
  const { error: dailyStatsError } = await supabase.rpc("increment_daily_stats", {
    p_date: today,
    p_active_users: 1,
    p_revenue: 0,
    p_new_subscriptions: 0,
    p_session_duration: 0,
  })

  if (dailyStatsError) {
    return NextResponse.json({ error: dailyStatsError.message }, { status: 500 })
  }

  // Update tool_usage
  const { error: toolUsageError } = await supabase.rpc("increment_tool_usage", {
    p_date: today,
    p_tool_name: toolName,
    p_usage_count: 1,
  })

  if (toolUsageError) {
    return NextResponse.json({ error: toolUsageError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
