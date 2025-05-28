import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { businessName, industry, postType, keyMessage, userId } = await req.json()

    if (!userId) {
      console.error("POST: User ID is missing")
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log(
      `POST: Generating business social media post for ${businessName}, industry: ${industry}, postType: ${postType}, userId: ${userId}`,
    )

    const { text: content } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates engaging social media posts for businesses.",
        },
        {
          role: "user",
          content: `Generate an engaging social media post for a business named "${businessName}" in the "${industry}" industry. The post type is "${postType}" and the key message is "${keyMessage}".`,
        },
      ],
    })

    console.log(`POST: Generated post: ${content}`)

    // Store the generated post in the database
    const { data, error } = await supabase.from("social_media_business_posts").insert({
      user_id: userId,
      business_name: businessName,
      industry,
      post_type: postType,
      key_message: keyMessage,
      content,
    })

    if (error) {
      console.error("POST: Error storing post:", error)
      console.error("POST: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to store post", details: error }, { status: 500 })
    }

    console.log(`POST: Post stored successfully for userId: ${userId}`)
    return NextResponse.json({ content })
  } catch (error) {
    console.error("POST: Error generating post:", error)
    console.error("POST: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to generate post", details: error }, { status: 500 })
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

    console.log(`GET: Fetching business social media posts for userId: ${userId}, page: ${page}`)

    const { data, error, count } = await supabase
      .from("social_media_business_posts")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("GET: Error fetching posts:", error)
      console.error("GET: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch posts", details: error }, { status: 500 })
    }

    console.log(`GET: Fetched ${data?.length} posts for userId: ${userId}`)
    return NextResponse.json({ data, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error("GET: Error in fetching posts:", error)
    console.error("GET: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to fetch posts", details: error }, { status: 500 })
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

    console.log(`DELETE: Deleting business social media post with id: ${id} for userId: ${userId}`)

    const { error } = await supabase.from("social_media_business_posts").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("DELETE: Error deleting post:", error)
      console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to delete post", details: error }, { status: 500 })
    }

    console.log(`DELETE: Successfully deleted post with id: ${id} for userId: ${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE: Error in deleting post:", error)
    console.error("DELETE: Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Failed to delete post", details: error }, { status: 500 })
  }
}
