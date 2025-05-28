import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { productDescription, targetAudience, industry, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating product names for description: ${productDescription}, userId: ${userId}`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates creative product names.",
        },
        {
          role: "user",
          content: `Generate 5 creative product names for the following:
          Product Description: ${productDescription}
          Target Audience: ${targetAudience}
          Industry: ${industry}

          The names should be catchy, memorable, and relevant to the product description and target audience.`,
        },
      ],
    })

    const content = completion.choices[0].message.content || ""
    const names = content
      .split("\n")
      .filter((name) => name.trim() !== "")
      .map((name) => name.replace(/^\d+\.\s*/, "").trim())

    console.log(`POST: Generated names: ${names.join(", ")}`)

    // Store the generated names in the database
    const { data, error } = await supabase.from("product_name_generators").insert({
      user_id: userId,
      product_description: productDescription,
      target_audience: targetAudience,
      industry: industry,
      names: names,
    })

    if (error) {
      console.error("POST: Error storing product names:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store product names", details: error }, { status: 500 })
    }

    console.log(`POST: Product names stored successfully for userId: ${userId}`)
    return NextResponse.json({ names })
  } catch (error) {
    console.error("POST: Error generating product names:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate product names", details: error }, { status: 500 })
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

    console.log(`GET: Fetching product names for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("product_name_generators")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching product names:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch product names", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} product names for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching product names:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch product names", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting product name with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("product_name_generators").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting product name:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete product name", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted product name with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting product name:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete product name", details: error }, { status: 500 })
  }
}
