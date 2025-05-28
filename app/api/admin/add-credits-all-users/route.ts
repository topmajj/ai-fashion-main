import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is an admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (userError || !userData?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await req.json()

    // Add credits to all users
    const { data, error } = await supabase.rpc("add_credits_to_all_users", { credit_amount: amount })

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "Credits added successfully", data })
  } catch (error) {
    console.error("Error adding credits:", error)
    return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
  }
}
