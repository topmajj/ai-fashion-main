import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { topic, keywords, tone, numberOfHeadlines, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating Facebook headlines for topic: ${topic}, userId: ${userId}`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates compelling Facebook headlines.",
        },
        {
          role: "user",
          content: `Generate ${numberOfHeadlines} compelling Facebook headlines for the following:
          Topic: ${topic}
          Keywords: ${keywords}
          Tone: ${tone}

          The headlines should be concise, attention-grabbing, and suitable for Facebook posts.`,
        },
      ],
    })

    const content = completion.choices[0].message.content || ""

    console.log(`POST: Generated headlines: ${content}`)

    // Store the generated headlines in the database
    const { data, error } = await supabase.from("facebook_headlines").insert({
      user_id: userId,
      topic,
      keywords,
      tone,
      headlines: content,
    })

    if (error) {
      console.error("POST: Error storing headlines:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store headlines", details: error }, { status: 500 })
    }

    console.log(`POST: Headlines stored successfully for userId: ${userId}`)
    return NextResponse.json({ content })
  } catch (error) {
    console.error("POST: Error generating headlines:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate headlines", details: error }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = 10

    if (!userId) {
      console.error("GET: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`GET: Fetching headlines for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("facebook_headlines")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching headlines:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch headlines", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} headlines for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching headlines:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch headlines", details: error }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    const userId = url.searchParams.get("userId")

    if (!id || !userId) {
      console.error("DELETE: ID or User ID is missing")
      return NextResponse.json({ error: "ID and User ID are required" }, { status: 400 })
    }

    console.log(`DELETE: Deleting headline with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("facebook_headlines").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting headline:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete headline", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted headline with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting headline:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete headline", details: error }, { status: 500 })
  }
}
