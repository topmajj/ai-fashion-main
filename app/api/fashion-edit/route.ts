import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const THENEWBLACK_API_KEY = process.env.THENEWBLACK_API_KEY
const THENEWBLACK_API_URL = "https://thenewblack.ai/api/1.1/wf/edit"
const THENEWBLACK_EMAIL = process.env.THENEWBLACK_EMAIL
const THENEWBLACK_PASSWORD = process.env.THENEWBLACK_PASSWORD

export async function POST(req: Request) {
  console.log("Fashion-edit API route called")

  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Log the request headers
    console.log("Request headers:", Object.fromEntries(req.headers))

    // Get the session from the request headers
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      console.log("No authorization header found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    console.log("Token from header:", token)

    // Verify the session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError) {
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user) {
      console.log("No user found after authentication")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Authenticated user:", user.id)

    const { image, remove, replace, negative } = await req.json()

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
    formData.append("remove", remove)
    formData.append("replace", replace)
    if (negative) {
      formData.append("negative", negative)
    }

    console.log("Sending request to THENEWBLACK API")
    const response = await fetch(THENEWBLACK_API_URL, {
      method: "POST",
      body: formData,
    })
    console.log("Received response from THENEWBLACK API:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("THENEWBLACK API error:", response.status, errorText)
      return NextResponse.json({ error: `Failed to edit image: ${errorText}` }, { status: response.status })
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
      type: "clothes_change",
      status: "completed",
      summary: `Removed: ${remove}. Added: ${replace}`,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error inserting generated image:", insertError)
      // Log the error, but don't throw it to allow the API to still return the generated image
    } else {
      console.log("Successfully inserted generated image:", insertData)
    }

    // Return the raw image URL
    return new NextResponse(imageUrl)
  } catch (error) {
    console.error("Error in fashion-edit API route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred in the API route",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
