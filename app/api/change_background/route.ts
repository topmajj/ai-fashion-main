import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

const THENEWBLACK_API_KEY = process.env.THENEWBLACK_API_KEY
const THENEWBLACK_API_URL = "https://thenewblack.ai/api/1.1/wf/change-background"

export async function POST(req: Request) {
  try {
    if (!THENEWBLACK_API_KEY) {
      console.error("THENEWBLACK_API_KEY is not configured")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const { image, replace, negative } = await req.json()

    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create form data for the API request
    const formData = new FormData()
    formData.append("image", image)
    formData.append("replace", replace)
    if (negative) {
      formData.append("negative", negative)
    }

    const response = await fetch(THENEWBLACK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${THENEWBLACK_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to change background")
    }

    const imageUrl = await response.text()

    // Store the generated image URL in your database
    await supabase.from("generated_images").insert({
      user_id: user.id,
      image_url: imageUrl,
      original_image: image,
      type: "background_change",
      status: "completed",
    })

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error in changing background:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
