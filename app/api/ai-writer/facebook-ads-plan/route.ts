import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { prompt } = await req.json()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates Facebook ad plans." },
        { role: "user", content: prompt },
      ],
    })

    const generatedPlan = completion.choices[0].message.content

    const { data, error } = await supabase
      .from("facebook_ads_plans")
      .insert([{ user_id: user.id, prompt: prompt, plan: generatedPlan }])
      .select()

    if (error) throw error

    return NextResponse.json({ plan: generatedPlan })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while generating the Facebook ad plan." }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("facebook_ads_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ history: data })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while fetching the history." }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
  }

  try {
    const { error } = await supabase.from("facebook_ads_plans").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ message: "Facebook ad plan deleted successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while deleting the Facebook ad plan." }, { status: 500 })
  }
}
