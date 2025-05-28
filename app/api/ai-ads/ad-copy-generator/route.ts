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

    console.log(`POST: Generating ad copy for product: ${product}, userId: ${userId}`)

    const { text: adCopy } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates compelling ad copy.",
        },
        {
          role: "user",
          content: `Generate compelling ad copy for a product called "${product}" described as "${description}" targeting "${targetAudience}".`,
        },
      ],
    })

    console.log(`POST: Generated ad copy: ${adCopy}`)

    // Store the generated ad copy in the database
    const { data, error } = await supabase.from("ad_copies").insert({
      user_id: userId,
      product,
      description,
      target_audience: targetAudience,
      ad_copy: adCopy,
    })

    if (error) {
      console.error("POST: Error storing ad copy:", error)
      return NextResponse.json({ error: "Failed to store ad copy" }, { status: 500 })
    }

    console.log(`POST: Ad copy stored successfully for userId: ${userId}`)
    return NextResponse.json({ adCopy })
  } catch (error) {
    console.error("POST: Error generating ad copy:", error)
    return NextResponse.json({ error: "Failed to generate ad copy" }, { status: 500 })
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

    console.log(`GET: Fetching ad copies for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("ad_copies")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching ad copies:", error)
      return NextResponse.json({ error: "Failed to fetch ad copies" }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} ad copies for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching ad copies:", error)
    return NextResponse.json({ error: "Failed to fetch ad copies" }, { status: 500 })
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

    console.log(`DELETE: Deleting ad copy with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("ad_copies").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting ad copy:", error)
      return NextResponse.json({ error: "Failed to delete ad copy" }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted ad copy with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting ad copy:", error)
    return NextResponse.json({ error: "Failed to delete ad copy" }, { status: 500 })
  }
}
