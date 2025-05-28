import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { topic, context, numberOfQuestions, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating FAQ for topic: ${topic}, userId: ${userId}`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates comprehensive FAQs.",
        },
        {
          role: "user",
          content: `Generate a comprehensive FAQ for the following topic:
          Topic: ${topic}
          Context: ${context}
          Number of Questions: ${numberOfQuestions}

          Please provide the FAQ in the following format:
          Q1: [Question 1]
          A1: [Answer 1]

          Q2: [Question 2]
          A2: [Answer 2]

          ... and so on.`,
        },
      ],
    })

    const content = completion.choices[0].message.content || ""

    console.log(`POST: Generated FAQ: ${content}`)

    // Store the generated FAQ in the database
    const { data, error } = await supabase.from("faq_generators").insert({
      user_id: userId,
      topic,
      context,
      number_of_questions: numberOfQuestions,
      content,
    })

    if (error) {
      console.error("POST: Error storing FAQ:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store FAQ", details: error }, { status: 500 })
    }

    console.log(`POST: FAQ stored successfully for userId: ${userId}`)
    return NextResponse.json({ content })
  } catch (error) {
    console.error("POST: Error generating FAQ:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate FAQ", details: error }, { status: 500 })
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

    console.log(`GET: Fetching FAQs for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("faq_generators")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching FAQs:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch FAQs", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} FAQs for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching FAQs:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch FAQs", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting FAQ with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("faq_generators").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting FAQ:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete FAQ", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted FAQ with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting FAQ:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete FAQ", details: error }, { status: 500 })
  }
}
