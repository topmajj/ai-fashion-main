import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { topic, niche, numberOfHashtags, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(
      `POST: Generating hashtags for topic: ${topic}, niche: ${niche}, number: ${numberOfHashtags}, userId: ${userId}`,
    )

    const prompt = `Generate ${numberOfHashtags} unique and relevant Instagram hashtags for a post about ${topic}${niche ? ` in the ${niche} niche` : ""}. Return only the hashtags as a comma-separated list, without numbering or additional text.`

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: prompt,
    })

    const hashtags = text
      .trim()
      .split(",")
      .map((tag) => tag.trim())

    console.log(`POST: Generated hashtags: ${hashtags.join(", ")}`)

    // Store the generated hashtags in the database
    const { data, error } = await supabase.from("instagram_hashtags").insert({
      user_id: userId,
      topic,
      niche,
      number_of_hashtags: numberOfHashtags,
      hashtags,
    })

    if (error) {
      console.error("POST: Error storing hashtags:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store hashtags", details: error }, { status: 500 })
    }

    console.log(`POST: Hashtags stored successfully for userId: ${userId}`)
    return NextResponse.json({ hashtags: hashtags.join(", ") })
  } catch (error) {
    console.error("POST: Error generating hashtags:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate hashtags", details: error }, { status: 500 })
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

    console.log(`GET: Fetching hashtags for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("instagram_hashtags")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching hashtags:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch hashtags", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} hashtags for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching hashtags:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch hashtags", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting hashtags with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("instagram_hashtags").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting hashtags:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete hashtags", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted hashtags with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting hashtags:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete hashtags", details: error }, { status: 500 })
  }
}
