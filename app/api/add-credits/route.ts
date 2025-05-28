import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Add 50 credits to all users
    const { data, error } = await supabase.rpc("add_credits_to_all_users", { credit_amount: 50 })

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "Credits added successfully", data })
  } catch (error) {
    console.error("Error adding credits:", error)
    return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
  }
}
