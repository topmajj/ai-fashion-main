import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const THENEWBLACK_EMAIL = process.env.THENEWBLACK_EMAIL!
const THENEWBLACK_PASSWORD = process.env.THENEWBLACK_PASSWORD!
const THENEWBLACK_RESULTS_URL = "https://thenewblack.ai/api/1.1/wf/results_video"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  console.log("Fashion Video Status API called")

  try {
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
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    const taskId = req.nextUrl.searchParams.get("id")
    if (!taskId) {
      console.error("Missing 'id' parameter")
      return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 })
    }

    console.log("Received taskId:", taskId)

    const { data: generationData, error: generationError } = await supabase
      .from("generated_images")
      .select("status, image_url, error_message, task_id")
      .eq("task_id", taskId)
      .single()

    if (generationError) {
      console.error("Error retrieving generation status:", generationError)
      if (generationError.message.includes("not found")) {
        return NextResponse.json({ status: "not_found", error: "Generation not found" }, { status: 404 })
      }
      return NextResponse.json({ status: "error", error: generationError.message }, { status: 500 })
    }

    // Check if generation is already completed or failed
    if (
      generationData.status === "completed" &&
      generationData.image_url &&
      generationData.image_url !== "Processing..."
    ) {
      return NextResponse.json({ status: "completed", videoUrl: generationData.image_url }, { status: 200 })
    } else if (generationData.status === "failed") {
      return NextResponse.json(
        { status: "failed", error: generationData.error_message || "Generation failed" },
        { status: 500 },
      )
    }

    // If not completed or failed, poll TheNewBlack API
    try {
      const resultsFormData = new FormData()
      resultsFormData.append("email", THENEWBLACK_EMAIL || "")
      resultsFormData.append("password", THENEWBLACK_PASSWORD || "")
      resultsFormData.append("id", generationData.task_id)

      const thenewblackResponse = await fetch(THENEWBLACK_RESULTS_URL, {
        method: "POST",
        body: resultsFormData,
      })

      if (!thenewblackResponse.ok) {
        const errorText = await thenewblackResponse.text()
        console.error("THENEWBLACK Results API error:", thenewblackResponse.status, errorText)
        throw new Error(errorText)
      }

      const videoUrl = await thenewblackResponse.text()

      if (videoUrl && !videoUrl.includes("error") && !videoUrl.includes("pending") && videoUrl !== "Processing...") {
        // Valid video URL received
        const { error: updateError } = await supabase
          .from("generated_images")
          .update({ status: "completed", image_url: videoUrl })
          .eq("task_id", taskId)

        if (updateError) {
          console.error("Failed to update generation data in Supabase:", updateError)
          throw new Error("Failed to update generation data in Supabase")
        }

        return NextResponse.json({ status: "completed", videoUrl }, { status: 200 })
      } else if (videoUrl && videoUrl.includes("error")) {
        throw new Error(`Video generation failed: ${videoUrl}`)
      } else {
        // Still processing
        return NextResponse.json({ status: "processing" }, { status: 202 })
      }
    } catch (error) {
      console.error("Error polling TheNewBlack API:", error)

      const { error: updateError } = await supabase
        .from("generated_images")
        .update({ status: "failed", error_message: error.message })
        .eq("task_id", taskId)

      if (updateError) {
        console.error("Failed to update generation data in Supabase:", updateError)
      }

      return NextResponse.json({ status: "failed", error: error.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in generation status route:", error)
    return NextResponse.json({ status: "error", error: "An unexpected error occurred" }, { status: 500 })
  }
}
