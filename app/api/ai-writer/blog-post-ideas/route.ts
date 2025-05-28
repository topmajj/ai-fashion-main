import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { topic, targetAudience, numberOfIdeas, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating blog post ideas for topic: ${topic}, userId: ${userId}`)

    const prompt = `Generate ${numberOfIdeas} blog post ideas about ${topic}${
      targetAudience ? ` for ${targetAudience}` : ""
    }. Format the output as a numbered list.`

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: prompt,
    })

    console.log(`POST: Generated ideas: ${text}`)

    // Store the generated ideas in the database
    const { data, error } = await supabase
      .from("blog_post_ideas")
      .insert({
        user_id: userId,
        topic,
        target_audience: targetAudience,
        number_of_ideas: numberOfIdeas,
        ideas: text,
      })
      .select()

    if (error) {
      console.error("POST: Error storing ideas:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store ideas", details: error }, { status: 500 })
    }

    console.log(`POST: Ideas stored successfully for userId: ${userId}`)
    return NextResponse.json({ ideas: text, id: data[0].id })
  } catch (error) {
    console.error("POST: Error generating ideas:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate ideas", details: error }, { status: 500 })
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

    console.log(`GET: Fetching ideas for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("blog_post_ideas")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching ideas:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch ideas", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} ideas for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching ideas:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch ideas", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting idea with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("blog_post_ideas").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting idea:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete idea", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted idea with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting idea:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete idea", details: error }, { status: 500 })
  }
}
