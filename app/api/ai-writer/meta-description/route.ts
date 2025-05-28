import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { pageTitle, keywords, pageContent, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating meta description for page title: ${pageTitle}, userId: ${userId}`)

    const { text: content } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates SEO-friendly meta descriptions.",
        },
        {
          role: "user",
          content: `Generate a concise and engaging meta description for a web page with the following details:
          Title: "${pageTitle}"
          Keywords: ${keywords}
          Content summary: ${pageContent}
          
          The meta description should be no longer than 160 characters.`,
        },
      ],
    })

    console.log(`POST: Generated meta description: ${content}`)

    // Store the generated meta description in the database
    const { data, error } = await supabase.from("meta_descriptions").insert({
      user_id: userId,
      page_title: pageTitle,
      keywords,
      page_content: pageContent,
      content,
    })

    if (error) {
      console.error("POST: Error storing meta description:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store meta description", details: error }, { status: 500 })
    }

    console.log(`POST: Meta description stored successfully for userId: ${userId}`)
    return NextResponse.json({ content })
  } catch (error) {
    console.error("POST: Error generating meta description:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate meta description", details: error }, { status: 500 })
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

    console.log(`GET: Fetching meta descriptions for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("meta_descriptions")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching meta descriptions:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch meta descriptions", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} meta descriptions for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching meta descriptions:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch meta descriptions", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting meta description with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("meta_descriptions").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting meta description:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete meta description", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted meta description with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting meta description:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete meta description", details: error }, { status: 500 })
  }
}
