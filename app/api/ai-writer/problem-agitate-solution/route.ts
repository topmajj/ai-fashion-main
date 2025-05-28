import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { problem, targetAudience, solution, userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const prompt = `Generate a Problem-Agitate-Solution (PAS) framework for the following:
    Problem: ${problem}
    Target Audience: ${targetAudience}
    Solution: ${solution}

    Format the response as follows:
    Problem: [Concise statement of the problem]
    Agitate: [2-3 sentences that emphasize the pain points and consequences of the problem]
    Solution: [2-3 sentences introducing the solution and its benefits]`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const generatedContent = completion.choices[0].message.content

    const { data, error } = await supabase
      .from("pas_frameworks")
      .insert({
        user_id: userId,
        problem,
        target_audience: targetAudience,
        solution,
        generated_content: generatedContent,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ generatedContent, id: data[0].id })
  } catch (error) {
    console.error("Error generating PAS framework:", error)
    return NextResponse.json({ error: "Failed to generate PAS framework" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = 5

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data, error, count } = await supabase
      .from("pas_frameworks")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (error) throw error

    return NextResponse.json({ data, count })
  } catch (error) {
    console.error("Error fetching PAS frameworks:", error)
    return NextResponse.json({ error: "Failed to fetch PAS frameworks" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!id || !userId) {
      return NextResponse.json({ error: "ID and User ID are required" }, { status: 400 })
    }

    const { error } = await supabase.from("pas_frameworks").delete().eq("id", id).eq("user_id", userId)

    if (error) throw error

    return NextResponse.json({ message: "PAS framework deleted successfully" })
  } catch (error) {
    console.error("Error deleting PAS framework:", error)
    return NextResponse.json({ error: "Failed to delete PAS framework" }, { status: 500 })
  }
}
