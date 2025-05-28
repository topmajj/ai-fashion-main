import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch all users and their current credit balances
    const { data: users, error } = await supabase.from("users").select("id, credits")

    if (error) {
      throw error
    }

    // Update each user's credits (this is just a dummy update to force a refresh)
    for (const user of users) {
      await supabase.from("users").update({ credits: user.credits }).eq("id", user.id)
    }

    return NextResponse.json({ message: "Credits refreshed successfully" })
  } catch (error) {
    console.error("Error refreshing credits:", error)
    return NextResponse.json({ error: "Failed to refresh credits" }, { status: 500 })
  }
}
