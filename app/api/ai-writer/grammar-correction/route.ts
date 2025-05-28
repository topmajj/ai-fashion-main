import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { text, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating grammar correction for userId: ${userId}`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that corrects grammar and improves writing.",
        },
        {
          role: "user",
          content: `Please correct the grammar and improve the following text:\n\n${text}`,
        },
      ],
    })

    const correctedText = completion.choices[0].message.content || ""

    console.log(`POST: Generated correction: ${correctedText}`)

    // Store the generated correction in the database
    const { data, error } = await supabase.from("grammar_corrections").insert({
      user_id: userId,
      original_text: text,
      corrected_text: correctedText,
    })

    if (error) {
      console.error("POST: Error storing correction:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store correction", details: error }, { status: 500 })
    }

    console.log(`POST: Correction stored successfully for userId: ${userId}`)
    return NextResponse.json({ correctedText })
  } catch (error) {
    console.error("POST: Error generating correction:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate correction", details: error }, { status: 500 })
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

    console.log(`GET: Fetching corrections for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("grammar_corrections")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching corrections:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch corrections", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} corrections for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching corrections:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch corrections", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting correction with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("grammar_corrections").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting correction:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete correction", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted correction with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting correction:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete correction", details: error }, { status: 500 })
  }
}
