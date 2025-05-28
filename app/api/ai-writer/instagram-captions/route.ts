import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { imageDescription, mood, brandVoice, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(`POST: Generating caption for image: ${imageDescription}, mood: ${mood}, userId: ${userId}`)

    const { text: caption } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates engaging Instagram captions.",
        },
        {
          role: "user",
          content: `Generate an engaging Instagram caption for an image described as "${imageDescription}" with a ${mood} mood${
            brandVoice ? ` and a brand voice that is ${brandVoice}` : ""
          }.`,
        },
      ],
    })

    console.log(`POST: Generated caption: ${caption}`)

    // Store the generated caption in the database
    const { data, error } = await supabase.from("instagram_captions").insert({
      user_id: userId,
      topic: imageDescription,
      mood,
      caption,
    })

    if (error) {
      console.error("POST: Error storing caption:", error)
      return NextResponse.json({ error: "Failed to store caption" }, { status: 500 })
    }

    console.log(`POST: Caption stored successfully for userId: ${userId}`)
    return NextResponse.json({ caption })
  } catch (error) {
    console.error("POST: Error generating caption:", error)
    return NextResponse.json({ error: "Failed to generate caption" }, { status: 500 })
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

    console.log(`GET: Fetching captions for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("instagram_captions")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching captions:", error)
      return NextResponse.json({ error: "Failed to fetch captions" }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} captions for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching captions:", error)
    return NextResponse.json({ error: "Failed to fetch captions" }, { status: 500 })
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

    console.log(`DELETE: Deleting caption with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("instagram_captions").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting caption:", error)
      return NextResponse.json({ error: "Failed to delete caption" }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted caption with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting caption:", error)
    return NextResponse.json({ error: "Failed to delete caption" }, { status: 500 })
  }
}
