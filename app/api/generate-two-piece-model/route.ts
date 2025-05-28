import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()

    const response = await fetch("https://thenewblack.ai/api/1.1/wf/2-piece-model", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.THENEWBLACK_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to generate image")
    }

    const imageUrl = await response.text()

    // Store the generated image URL in your database
    await supabase.from("generated_images").insert({
      user_id: user.id,
      image_url: imageUrl,
      type: "two-piece-model",
    })

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
