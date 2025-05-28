import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const THENEWBLACK_API_KEY = process.env.THENEWBLACK_API_KEY
const THENEWBLACK_API_URL = "https://thenewblack.ai/api/1.1/wf/clothing"
const THENEWBLACK_EMAIL = process.env.THENEWBLACK_EMAIL
const THENEWBLACK_PASSWORD = process.env.THENEWBLACK_PASSWORD

export async function POST(req: Request) {
  console.log("Fashion-design API route called")

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

    const formData = await req.formData()
    const outfit = formData.get("outfit") as string
    const gender = formData.get("gender") as string
    const country = formData.get("country") as string
    const age = formData.get("age") as string
    const width = formData.get("width") as string
    const height = formData.get("height") as string
    const bodyType = formData.get("body_type") as string | null
    const background = (formData.get("background") as string) || "studio backdrop"
    const negative = formData.get("negative") as string | null

    // Validate required fields
    if (!outfit || !gender || !country || !age || !width || !height) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate body_type
    if (bodyType && !["", "small", "plus", "pregnant"].includes(bodyType)) {
      return NextResponse.json(
        { error: "Invalid body type. Must be empty, 'small', 'plus', or 'pregnant'." },
        { status: 400 },
      )
    }

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
    const apiFormData = new FormData()
    apiFormData.append("email", THENEWBLACK_EMAIL)
    apiFormData.append("password", THENEWBLACK_PASSWORD)
    apiFormData.append("outfit", outfit)
    apiFormData.append("gender", gender)
    apiFormData.append("country", country)
    apiFormData.append("age", age)
    apiFormData.append("width", width)
    apiFormData.append("height", height)
    apiFormData.append("background", background)
    if (bodyType) apiFormData.append("body_type", bodyType)
    if (negative) apiFormData.append("negative", negative)

    console.log("Sending request to THENEWBLACK API")
    const response = await fetch(THENEWBLACK_API_URL, {
      method: "POST",
      body: apiFormData,
    })
    console.log("Received response from THENEWBLACK API:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("THENEWBLACK API error:", response.status, errorText)
      return NextResponse.json({ error: `Failed to generate design: ${errorText}` }, { status: response.status })
    }

    const imageUrl = await response.text()
    if (!imageUrl || imageUrl.startsWith("body_type value must be")) {
      throw new Error(imageUrl || "Invalid response from THENEWBLACK API")
    }

    console.log("Received image URL from THENEWBLACK API:", imageUrl)

    // Store the generated image URL in your database
    const { data: insertData, error: insertError } = await supabase.from("generated_images").insert({
      user_id: user.id,
      image_url: imageUrl,
      prompt: outfit,
      type: "fashion_design",
      status: "completed",
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error inserting generated image:", insertError)
      console.error("Insert error details:", JSON.stringify(insertError, null, 2))
      // Log the error, but don't throw it to allow the API to still return the generated image
    } else {
      console.log("Successfully inserted generated image:", insertData)
    }

    console.log("Returning response with imageUrl:", imageUrl)
    return NextResponse.json({ imageUrl, status: "completed" })
  } catch (error) {
    console.error("Error in fashion-design API route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred in the API route",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
