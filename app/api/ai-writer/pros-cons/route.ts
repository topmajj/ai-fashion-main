import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { topic, context, numberOfPoints, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating pros and cons for topic: ${topic}, userId: ${userId}`)

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates balanced pros and cons lists.",
        },
        {
          role: "user",
          content: `Generate ${numberOfPoints} pros and ${numberOfPoints} cons for the following topic:
          Topic: ${topic}
          Context: ${context || "No additional context provided"}

          Format your response as follows:
          Pros:
          - Pro 1
          - Pro 2
          - Pro 3

          Cons:
          - Con 1
          - Con 2
          - Con 3

          The pros and cons should be balanced, relevant to the topic, and consider the provided context if any.`,
        },
      ],
    })

    const content = completion.choices[0].message.content || ""

    console.log(`POST: Generated pros and cons: ${content}`)

    const prosConsArray = content.split("\n").filter((item) => item.trim() !== "")
    const pros = prosConsArray
      .slice(prosConsArray.indexOf("Pros:") + 1, prosConsArray.indexOf("Cons:"))
      .map((item) => item.replace(/^-\s*/, "").trim())
    const cons = prosConsArray.slice(prosConsArray.indexOf("Cons:") + 1).map((item) => item.replace(/^-\s*/, "").trim())

    // Store the generated pros and cons in the database
    const { data, error } = await supabase.from("pros_cons").insert({
      user_id: userId,
      topic,
      context,
      number_of_points: numberOfPoints,
      pros,
      cons,
    })

    if (error) {
      console.error("POST: Error storing pros and cons:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store pros and cons", details: error }, { status: 500 })
    }

    console.log(`POST: Pros and cons stored successfully for userId: ${userId}`)
    return NextResponse.json({ pros, cons })
  } catch (error) {
    console.error("POST: Error generating pros and cons:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate pros and cons", details: error }, { status: 500 })
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

    console.log(`GET: Fetching pros and cons for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("pros_cons")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching pros and cons:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch pros and cons", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} pros and cons items for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching pros and cons:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch pros and cons", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting pros and cons with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("pros_cons").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting pros and cons:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete pros and cons", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted pros and cons with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting pros and cons:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete pros and cons", details: error }, { status: 500 })
  }
}
