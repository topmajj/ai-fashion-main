import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { keywords, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating YouTube video tags for keywords: ${keywords}, userId: ${userId}`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates relevant YouTube video tags.",
        },
        {
          role: "user",
          content: `Generate relevant YouTube video tags based on the following keywords: ${keywords}. 
          Provide the tags as a comma-separated list.`,
        },
      ],
    })

    const content = completion.choices[0].message.content || ""
    const tags = content.split(",").map((tag) => tag.trim())

    console.log(`POST: Generated tags: ${tags.join(", ")}`)

    // Store the generated tags in the database
    const { data, error } = await supabase.from("youtube_video_tags").insert({
      user_id: userId,
      keywords: keywords,
      tags: tags,
    })

    if (error) {
      console.error("POST: Error storing tags:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store tags", details: error }, { status: 500 })
    }

    console.log(`POST: Tags stored successfully for userId: ${userId}`)
    return NextResponse.json({ tags })
  } catch (error) {
    console.error("POST: Error generating tags:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate tags", details: error }, { status: 500 })
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

    console.log(`GET: Fetching tags for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("youtube_video_tags")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching tags:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch tags", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} tags for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching tags:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch tags", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting tags with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("youtube_video_tags").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting tags:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete tags", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted tags with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting tags:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete tags", details: error }, { status: 500 })
  }
}
