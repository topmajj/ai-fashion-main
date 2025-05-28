import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { brand, product, targetMarket, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Analyzing target audience for brand: ${brand}, product: ${product}, userId: ${userId}`)

    const { text: analysis } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes target audiences for marketing purposes.",
        },
        {
          role: "user",
          content: `Analyze the target audience for the brand "${brand}" and their product "${product}" in the ${targetMarket} market. Provide insights on demographics, psychographics, and behavior patterns.`,
        },
      ],
    })

    console.log(`POST: Generated analysis: ${analysis}`)

    // Store the generated analysis in the database
    const { data, error } = await supabase.from("target_audience_analyses").insert({
      user_id: userId,
      brand,
      product,
      target_market: targetMarket,
      analysis,
    })

    if (error) {
      console.error("POST: Error storing analysis:", error)
      return NextResponse.json({ error: "Failed to store analysis" }, { status: 500 })
    }

    console.log(`POST: Analysis stored successfully for userId: ${userId}`)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("POST: Error generating analysis:", error)
    return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 })
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

    console.log(`GET: Fetching analyses for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("target_audience_analyses")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching analyses:", error)
      return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} analyses for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching analyses:", error)
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
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

    console.log(`DELETE: Deleting analysis with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("target_audience_analyses").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting analysis:", error)
      return NextResponse.json({ error: "Failed to delete analysis" }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted analysis with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting analysis:", error)
    return NextResponse.json({ error: "Failed to delete analysis" }, { status: 500 })
  }
}
