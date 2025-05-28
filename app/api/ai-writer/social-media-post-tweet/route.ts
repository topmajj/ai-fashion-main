import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { topic, tone, keywords, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating tweet for topic: ${topic}, tone: ${tone}, keywords: ${keywords}, userId: ${userId}`)

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates engaging social media tweets.",
        },
        {
          role: "user",
          content: `Generate an engaging tweet about "${topic}" with a "${tone}" tone. Include these keywords if possible: ${keywords}.`,
        },
      ],
    })

    console.log(`POST: Generated tweet: ${text}`)

    // Store the generated tweet in the database
    const { data, error } = await supabase.from("social_media_tweets").insert({
      user_id: userId,
      topic,
      tone,
      keywords,
      content: text,
    })

    if (error) {
      console.error("POST: Error storing tweet:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store tweet", details: error }, { status: 500 })
    }

    console.log(`POST: Tweet stored successfully for userId: ${userId}`)
    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("POST: Error generating tweet:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate tweet", details: error }, { status: 500 })
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

    console.log(`GET: Fetching tweets for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("social_media_tweets")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching tweets:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch tweets", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} tweets for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching tweets:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch tweets", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting tweet with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("social_media_tweets").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting tweet:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete tweet", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted tweet with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting tweet:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete tweet", details: error }, { status: 500 })
  }
}
