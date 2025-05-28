import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const videoId = params.id

    // Make API call to check video status
    const response = await fetch("https://thenewblack.ai/api/1.1/wf/results_video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.THENEWBLACK_EMAIL,
        password: process.env.THENEWBLACK_PASSWORD,
        id: videoId,
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Video is still processing
        return NextResponse.json({ status: "processing" })
      }
      throw new Error(`API request failed with status ${response.status}`)
    }

    const videoUrl = await response.text()

    // Update the database with the completed video
    const { data, error } = await supabase
      .from("generated_images")
      .update({ status: "completed", image_url: videoUrl })
      .eq("task_id", videoId)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Error updating database:", error)
      return NextResponse.json({ error: "Failed to update generation status" }, { status: 500 })
    }

    return NextResponse.json({ status: "completed", videoUrl })
  } catch (error) {
    console.error("Error checking video status:", error)
    return NextResponse.json({ error: "Failed to check video status" }, { status: 500 })
  }
}
