import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { videoTitle, keywords, tone, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating YouTube video description for video: ${videoTitle}, userId: ${userId}`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates compelling YouTube video descriptions.",
        },
        {
          role: "user",
          content: `Generate a compelling YouTube video description for the following video:
          Video Title: ${videoTitle}
          Keywords: ${keywords}
          Tone: ${tone}

          The description should be engaging, include the keywords, and match the specified tone.`,
        },
      ],
    })

    const content = completion.choices[0].message.content || ""

    console.log(`POST: Generated description: ${content}`)

    // Store the generated description in the database
    const { data, error } = await supabase.from("youtube_video_descriptions").insert({
      user_id: userId,
      video_title: videoTitle,
      keywords: keywords,
      tone: tone,
      description: content,
    })

    if (error) {
      console.error("POST: Error storing description:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store description", details: error }, { status: 500 })
    }

    console.log(`POST: Description stored successfully for userId: ${userId}`)
    return NextResponse.json({ content })
  } catch (error) {
    console.error("POST: Error generating description:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate description", details: error }, { status: 500 })
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

    console.log(`GET: Fetching descriptions for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("youtube_video_descriptions")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching descriptions:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch descriptions", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} descriptions for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching descriptions:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch descriptions", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting description with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("youtube_video_descriptions").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting description:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete description", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted description with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting description:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete description", details: error }, { status: 500 })
  }
}
