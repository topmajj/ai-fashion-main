import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { topic, tone } = await req.json()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates blog conclusions.",
        },
        {
          role: "user",
          content: `Generate a blog conclusion for a blog post with the topic "${topic}" and the tone "${tone}".`,
        },
      ],
    })

    const generatedConclusion = completion.choices[0].message.content

    const { data, error } = await supabase
      .from("blog_conclusions")
      .insert([{ user_id: user.id, topic, tone, conclusion: generatedConclusion }])
      .select()

    if (error) throw error

    return NextResponse.json({ conclusion: generatedConclusion })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to generate blog conclusion" }, { status: 500 })
  }
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("blog_conclusions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ history: data })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to fetch blog conclusion history" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = await req.json()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
  }

  try {
    const { error } = await supabase.from("blog_conclusions").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ message: "Blog conclusion deleted successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to delete blog conclusion" }, { status: 500 })
  }
}
