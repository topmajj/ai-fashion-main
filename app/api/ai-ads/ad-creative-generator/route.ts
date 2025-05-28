import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { product, description, targetAudience, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating creative for product: ${product}, userId: ${userId}`)

    const { text: creative } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates creative ad copy.",
        },
        {
          role: "user",
          content: `Generate a creative ad for ${product}. Description: ${description}. ${
            targetAudience ? `Target audience: ${targetAudience}.` : ""
          } The ad should be engaging and persuasive.`,
        },
      ],
    })

    console.log(`POST: Generated creative: ${creative}`)

    // Store the generated creative in the database
    const { data, error } = await supabase.from("ad_creatives").insert({
      user_id: userId,
      product,
      description,
      target_audience: targetAudience,
      creative,
    })

    if (error) {
      console.error("POST: Error storing creative:", error)
      return NextResponse.json({ error: "Failed to store creative" }, { status: 500 })
    }

    console.log(`POST: Creative stored successfully for userId: ${userId}`)
    return NextResponse.json({ creative })
  } catch (error) {
    console.error("POST: Error generating creative:", error)
    return NextResponse.json({ error: "Failed to generate creative" }, { status: 500 })
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

    console.log(`GET: Fetching creatives for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("ad_creatives")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching creatives:", error)
      return NextResponse.json({ error: "Failed to fetch creatives" }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} creatives for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching creatives:", error)
    return NextResponse.json({ error: "Failed to fetch creatives" }, { status: 500 })
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

    console.log(`DELETE: Deleting creative with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("ad_creatives").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting creative:", error)
      return NextResponse.json({ error: "Failed to delete creative" }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted creative with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting creative:", error)
    return NextResponse.json({ error: "Failed to delete creative" }, { status: 500 })
  }
}
