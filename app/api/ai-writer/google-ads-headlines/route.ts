import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  const { productName, keyFeatures, targetAudience, numberOfHeadlines, userId } = await req.json()

  if (!productName || !keyFeatures || !targetAudience || !numberOfHeadlines || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const prompt = `Generate ${numberOfHeadlines} Google Ads headlines for a product with the following details:
    Product Name: ${productName}
    Key Features: ${keyFeatures}
    Target Audience: ${targetAudience}
    
    The headlines should be catchy, concise, and highlight the product's unique selling points. Each headline should be no more than 30 characters long.`

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: prompt,
    })

    const headlines = text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .slice(0, numberOfHeadlines)

    const { data, error } = await supabase
      .from("google_ads_headlines")
      .insert({
        user_id: userId,
        product_name: productName,
        key_features: keyFeatures,
        target_audience: targetAudience,
        number_of_headlines: numberOfHeadlines,
        content: headlines.join("\n"),
      })
      .select()

    if (error) throw error

    return NextResponse.json({ headlines, id: data[0].id })
  } catch (error) {
    console.error("Error generating Google Ads headlines:", error)
    return NextResponse.json({ error: "Failed to generate Google Ads headlines" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = 10

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  try {
    const {
      data: headlines,
      error,
      count,
    } = await supabase
      .from("google_ads_headlines")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw error

    const totalPages = Math.ceil((count || 0) / pageSize)

    return NextResponse.json({ data: headlines, totalPages })
  } catch (error) {
    console.error("Error fetching Google Ads headlines:", error)
    return NextResponse.json({ error: "Failed to fetch Google Ads headlines" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const userId = searchParams.get("userId")

  if (!id || !userId) {
    return NextResponse.json({ error: "Missing id or userId" }, { status: 400 })
  }

  try {
    const { error } = await supabase.from("google_ads_headlines").delete().eq("id", id).eq("user_id", userId)

    if (error) throw error

    return NextResponse.json({ message: "Google Ads headline deleted successfully" })
  } catch (error) {
    console.error("Error deleting Google Ads headline:", error)
    return NextResponse.json({ error: "Failed to delete Google Ads headline" }, { status: 500 })
  }
}
