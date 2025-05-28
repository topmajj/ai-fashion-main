import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "7")

    // Check if the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      console.error("Admin check failed:", profileError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch daily stats
    const { data: dailyStats, error: statsError } = await supabase
      .from("daily_stats")
      .select("*")
      .order("date", { ascending: true })
      .gte("date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

    if (statsError) {
      console.error("Error fetching daily stats:", statsError)
      return NextResponse.json({ error: "Failed to fetch daily stats" }, { status: 500 })
    }

    return NextResponse.json(dailyStats || [])
  } catch (error) {
    console.error("Unexpected error in daily-stats route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
