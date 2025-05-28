import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { topic, keywords, brevity, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(
      `POST: Generating titles for topic: ${topic}, keywords: ${keywords}, brevity: ${brevity}, userId: ${userId}`,
    )

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates catchy blog post titles.",
        },
        {
          role: "user",
          content: `Generate 5 ${brevity} catchy blog post titles about ${topic}${
            keywords ? ` incorporating these keywords: ${keywords}` : ""
          }.`,
        },
      ],
    })

    const titles = completion.choices[0].message.content?.split("\n").filter((title) => title.trim() !== "") || []

    console.log(`POST: Generated titles: ${JSON.stringify(titles)}`)

    // Store the generated titles in the database
    const { data, error } = await supabase.from("generated_titles").insert({
      user_id: userId,
      topic,
      keywords,
      brevity,
      titles,
    })

    if (error) {
      console.error("POST: Error storing titles:", error)
      return NextResponse.json({ error: "Failed to store titles", details: error }, { status: 500 })
    }

    console.log(`POST: Titles stored successfully for userId: ${userId}`)
    return NextResponse.json({ titles })
  } catch (error) {
    console.error("POST: Error generating titles:", error)
    return NextResponse.json({ error: "Failed to generate titles", details: error }, { status: 500 })
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

    console.log(`GET: Fetching titles for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("generated_titles")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching titles:", error)
      return NextResponse.json({ error: "Failed to fetch titles", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} titles for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching titles:", error)
    return NextResponse.json({ error: "Failed to fetch titles", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting title with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("generated_titles").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting title:", error)
      return NextResponse.json({ error: "Failed to delete title", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted title with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting title:", error)
    return NextResponse.json({ error: "Failed to delete title", details: error }, { status: 500 })
  }
}
