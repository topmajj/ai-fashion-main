import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  console.log("POST request received for product description generation")
  try {
    const { productName, productFeatures, targetAudience, userId } = await req.json()

    if (!userId) {
      console.error("No user ID provided")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`Generating product description for user ${userId}`)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates product descriptions." },
        {
          role: "user",
          content: `Generate a product description for ${productName}. Features: ${productFeatures}. Target audience: ${targetAudience}`,
        },
      ],
    })

    const description = completion.choices[0].message.content

    console.log("Storing generated description in the database")
    const { data, error } = await supabase
      .from("product_descriptions")
      .insert({
        user_id: userId,
        product_name: productName,
        product_features: productFeatures,
        target_audience: targetAudience,
        description: description,
      })
      .select()

    if (error) {
      console.error("Error inserting into database:", error)
      return NextResponse.json({ error: "Failed to store description" }, { status: 500 })
    }

    console.log("Product description generated and stored successfully")
    return NextResponse.json({ description, id: data[0].id })
  } catch (error) {
    console.error("Error in product description generation:", error)
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  console.log("GET request received for product descriptions")
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")
  const page = Number.parseInt(url.searchParams.get("page") || "1")
  const pageSize = 5

  if (!userId) {
    console.error("No user ID provided")
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    console.log(`Fetching product descriptions for user ${userId}, page ${page}`)
    const { data, error, count } = await supabase
      .from("product_descriptions")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) {
      console.error("Error fetching from database:", error)
      return NextResponse.json({ error: "Failed to fetch descriptions" }, { status: 500 })
    }

    console.log(`Fetched ${data.length} product descriptions`)
    return NextResponse.json({ descriptions: data, total: count })
  } catch (error) {
    console.error("Error in fetching product descriptions:", error)
    return NextResponse.json({ error: "Failed to fetch descriptions" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  console.log("DELETE request received for product description")
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  const userId = url.searchParams.get("userId")

  if (!id || !userId) {
    console.error("No ID or user ID provided")
    return NextResponse.json({ error: "ID and User ID are required" }, { status: 400 })
  }

  try {
    console.log(`Deleting product description ${id} for user ${userId}`)
    const { error } = await supabase.from("product_descriptions").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("Error deleting from database:", error)
      return NextResponse.json({ error: "Failed to delete description" }, { status: 500 })
    }

    console.log("Product description deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in deleting product description:", error)
    return NextResponse.json({ error: "Failed to delete description" }, { status: 500 })
  }
}
