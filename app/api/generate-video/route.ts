import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { image, prompt } = await req.json()

    // Validate input
    if (!image || !prompt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Make API call to generate video
    const response = await fetch("https://thenewblack.ai/api/1.1/wf/ai-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.THENEWBLACK_EMAIL,
        password: process.env.THENEWBLACK_PASSWORD,
        image,
        prompt,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const videoId = await response.text()

    // Store the generation request in the database
    const { data, error } = await supabase.from("generated_images").insert({
      user_id: session.user.id,
      image_url: image,
      tool_name: "Fashion Video",
      summary: prompt,
      status: "processing",
      task_id: videoId,
      type: "video",
    })

    if (error) {
      console.error("Error inserting into database:", error)
      return NextResponse.json({ error: "Failed to store generation request" }, { status: 500 })
    }

    return NextResponse.json({ videoId })
  } catch (error) {
    console.error("Error generating video:", error)
    return NextResponse.json({ error: "Failed to generate video" }, { status: 500 })
  }
}
