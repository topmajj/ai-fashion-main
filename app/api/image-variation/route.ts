import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

const THENEWBLACK_API_URL = "https://thenewblack.ai/api/1.1/wf/variation"
const THENEWBLACK_EMAIL = process.env.THENEWBLACK_EMAIL
const THENEWBLACK_PASSWORD = process.env.THENEWBLACK_PASSWORD

export async function POST(req: Request) {
  try {
    if (!THENEWBLACK_EMAIL || !THENEWBLACK_PASSWORD) {
      console.error("THENEWBLACK_EMAIL or THENEWBLACK_PASSWORD is not configured")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const supabase = createServerSupabaseClient()

    // Get the session from the request headers
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      console.log("No authorization header found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.log("Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Authenticated user:", user.id)

    const { image, prompt, deviation } = await req.json()

    // Deduct credits before image generation
    const { data: creditData, error: creditError } = await supabase.rpc("deduct_credit", {
      user_id: user.id,
      amount: 1,
    })

    if (creditError) {
      console.error("Error deducting credit:", creditError)
      return NextResponse.json({ error: "Failed to deduct credit" }, { status: 500 })
    }

    console.log("Credit deducted, new balance:", creditData)

    // Create form data for the API request
    const formData = new FormData()
    formData.append("email", THENEWBLACK_EMAIL)
    formData.append("password", THENEWBLACK_PASSWORD)
    formData.append("image", image)
    formData.append("prompt", prompt)
    formData.append("deviation", deviation.toString())

    console.log("Sending request to THENEWBLACK API")
    const response = await fetch(THENEWBLACK_API_URL, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("THENEWBLACK API error:", response.status, errorText)
      return NextResponse.json(
        { error: `Failed to generate image variation: ${errorText}` },
        { status: response.status },
      )
    }

    const imageUrl = await response.text()
    if (!imageUrl) {
      throw new Error("No image URL returned from THENEWBLACK API")
    }

    // Store the generated image URL in your database
    const { data: insertData, error: insertError } = await supabase.from("generated_images").insert({
      user_id: user.id,
      image_url: imageUrl,
      original_image: image,
      type: "image_variation",
      status: "completed",
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error inserting generated image:", insertError)
      // Log the error, but don't throw it to allow the API to still return the generated image
    } else {
      console.log("Successfully inserted generated image:", insertData)
    }

    // Return the image URL
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error in image variation API route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred in the API route",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
