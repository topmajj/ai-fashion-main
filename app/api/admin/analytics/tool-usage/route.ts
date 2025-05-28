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

    // Fetch tool usage stats
    const { data: toolUsage, error: usageError } = await supabase
      .from("tool_usage")
      .select("*")
      .order("date", { ascending: true })
      .gte("date", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

    if (usageError) {
      console.error("Error fetching tool usage:", usageError)
      return NextResponse.json({ error: "Failed to fetch tool usage" }, { status: 500 })
    }

    // Aggregate tool usage data
    const defaultTools = {
      "Virtual Try-On": 0,
      "AI Writer": 0,
      "Fashion Design": 0,
      "Image Variation": 0,
      "Headshot Generator": 0,
    }

    const aggregatedData = (toolUsage || []).reduce(
      (acc, curr) => {
        acc[curr.tool_name] = (acc[curr.tool_name] || 0) + curr.usage_count
        return acc
      },
      { ...defaultTools },
    )

    return NextResponse.json(aggregatedData)
  } catch (error) {
    console.error("Unexpected error in tool-usage route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
