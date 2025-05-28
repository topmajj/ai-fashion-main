import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Completely rewritten to avoid any dependency on @runwayml/hosted-models
export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get user from auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get form data
    const formData = await req.formData()
    const outfit = formData.get("outfit") as string
    const gender = formData.get("gender") as string
    const country = formData.get("country") as string
    const negative = (formData.get("negative") as string) || ""

    // Check credits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (userError || !userData || userData.credits < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    // Deduct credits
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - 1 })
      .eq("id", user.id)

    if (updateError) {
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
    }

    // Use TheNewBlack API instead of Runway
    const apiUrl = "https://thenewblack.ai/api/1.1/wf/runway"
    const apiFormData = new FormData()

    apiFormData.append("email", process.env.THENEWBLACK_EMAIL || "")
    apiFormData.append("password", process.env.THENEWBLACK_PASSWORD || "")
    apiFormData.append("outfit", outfit)
    apiFormData.append("gender", gender)
    apiFormData.append("country", country)
    if (negative) apiFormData.append("negative", negative)

    const response = await fetch(apiUrl, {
      method: "POST",
      body: apiFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `API error: ${errorText}` }, { status: response.status })
    }

    const imageUrl = await response.text()

    // Store the generated image
    await supabase.from("generated_images").insert({
      user_id: user.id,
      image_url: imageUrl,
      prompt: outfit,
      type: "runway_model",
      status: "completed",
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ imageUrl, status: "completed" })
  } catch (error) {
    console.error("Error in runway API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
