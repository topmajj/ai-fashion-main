import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function GET(req: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the session from the request headers
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      console.log("No authorization header found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.log("Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const taskId = url.searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("image_variation_tasks").select("*").eq("id", taskId).single()

    if (error) {
      console.error("Error fetching task:", error)
      return NextResponse.json({ error: "Failed to fetch task status" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in image variation status API route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred in the API route",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
