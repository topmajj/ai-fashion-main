import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const THENEWBLACK_EMAIL = process.env.THENEWBLACK_EMAIL
const THENEWBLACK_PASSWORD = process.env.THENEWBLACK_PASSWORD
const THENEWBLACK_API_URL = "https://thenewblack.ai/api/1.1/wf/ai-video"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    // Extract the token
    const token = authHeader.split(" ")[1]

    // Verify the token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const formData = await req.formData()
    const image = formData.get("image") as File
    const prompt = formData.get("prompt") as string

    if (!image || !prompt) {
      return NextResponse.json({ error: "Image and prompt are required" }, { status: 400 })
    }

    // Check credits - Direct query
    const { data: userData, error: creditCheckError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (creditCheckError || !userData) {
      console.error("Credit check error:", creditCheckError)
      return NextResponse.json({ error: "Failed to verify credits" }, { status: 500 })
    }

    if (userData.credits < 10) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    // Upload image
    const fileExt = image.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}_fashion_video.${fileExt}`
    const buffer = Buffer.from(await image.arrayBuffer())

    const { error: uploadError } = await supabase.storage.from("fashion-images").upload(fileName, buffer, {
      contentType: image.type,
      upsert: true,
    })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    const {
      data: { publicUrl: imageUrl },
    } = supabase.storage.from("fashion-images").getPublicUrl(fileName)

    // Call TheNewBlack API
    const apiFormData = new FormData()
    apiFormData.append("email", THENEWBLACK_EMAIL!)
    apiFormData.append("password", THENEWBLACK_PASSWORD!)
    apiFormData.append("image", imageUrl)
    apiFormData.append("prompt", prompt)

    const response = await fetch(THENEWBLACK_API_URL, {
      method: "POST",
      body: apiFormData,
    })

    if (!response.ok) {
      throw new Error("Failed to initiate video generation")
    }

    const generationId = await response.text()

    // Deduct credits - Direct update
    const { error: creditUpdateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - 10 })
      .eq("id", user.id)

    if (creditUpdateError) {
      console.error("Credit update error:", creditUpdateError)
      return NextResponse.json({ error: "Failed to process credits" }, { status: 500 })
    }

    // Store generation data
    const { error: storeError } = await supabase.from("generated_images").insert({
      user_id: user.id,
      task_id: generationId,
      status: "processing",
      type: "fashion_video",
      original_image: imageUrl,
      prompt: prompt,
      created_at: new Date().toISOString(),
    })

    if (storeError) {
      console.error("Store error:", storeError)
      // Don't return error here as the generation is already in progress
    }

    return NextResponse.json({ generationId, status: "processing" })
  } catch (error) {
    console.error("Fashion video generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
