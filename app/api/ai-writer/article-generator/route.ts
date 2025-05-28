import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { topic, keywords, wordCount, userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const prompt = `Write an article about ${topic}${
      keywords ? ` including the following keywords: ${keywords}` : ""
    }. The article should be approximately ${wordCount} words long.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const article = completion.choices[0].message.content

    const { data, error } = await supabase
      .from("generated_articles")
      .insert({
        user_id: userId,
        topic,
        keywords,
        word_count: wordCount,
        article,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ article, id: data[0].id })
  } catch (error) {
    console.error("Error generating article:", error)
    return NextResponse.json({ error: "Failed to generate article" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const pageSize = 5

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data, error, count } = await supabase
      .from("generated_articles")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw error

    return NextResponse.json({
      articles: data,
      totalPages: Math.ceil((count || 0) / pageSize),
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, userId } = await req.json()

    if (!userId || !id) {
      return NextResponse.json({ error: "User ID and article ID are required" }, { status: 400 })
    }

    const { error } = await supabase.from("generated_articles").delete().eq("id", id).eq("user_id", userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
