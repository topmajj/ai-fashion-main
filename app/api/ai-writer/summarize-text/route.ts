import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  console.log("POST request received for summarize-text")
  try {
    const { userId, text, length } = await req.json()
    console.log(`Received request for user ${userId}, text length: ${text.length}, summary length: ${length}`)

    if (!userId) {
      console.error("No user ID provided")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const prompt = `Summarize the following text in ${length} length:\n\n${text}`
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const summary = response.choices[0].message.content
    console.log(`Generated summary: ${summary}`)

    const { data, error } = await supabase
      .from("text_summaries")
      .insert({
        user_id: userId,
        original_text: text,
        summary: summary,
        length: length,
      })
      .select()

    if (error) {
      console.error("Error inserting summary into database:", error)
      return NextResponse.json({ error: "Failed to save summary" }, { status: 500 })
    }

    return NextResponse.json({ summary, id: data[0].id })
  } catch (error) {
    console.error("Error in summarize-text API:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}

export async function GET(req: Request) {
  console.log("GET request received for summarize-text history")
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")
  const page = Number.parseInt(url.searchParams.get("page") || "1")
  const pageSize = 5

  if (!userId) {
    console.error("No user ID provided")
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const { data, error, count } = await supabase
      .from("text_summaries")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) {
      console.error("Error fetching summaries:", error)
      return NextResponse.json({ error: "Failed to fetch summaries" }, { status: 500 })
    }

    return NextResponse.json({ summaries: data, total: count })
  } catch (error) {
    console.error("Error in GET summarize-text API:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  console.log("DELETE request received for summarize-text")
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")
  const summaryId = url.searchParams.get("summaryId")

  if (!userId || !summaryId) {
    console.error("Missing user ID or summary ID")
    return NextResponse.json({ error: "User ID and summary ID are required" }, { status: 400 })
  }

  try {
    const { error } = await supabase.from("text_summaries").delete().eq("id", summaryId).eq("user_id", userId)

    if (error) {
      console.error("Error deleting summary:", error)
      return NextResponse.json({ error: "Failed to delete summary" }, { status: 500 })
    }

    return NextResponse.json({ message: "Summary deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE summarize-text API:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}
