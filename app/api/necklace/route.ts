import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const THENEWBLACK_API_URL = "https://thenewblack.ai/api/1.1/wf/necklace"
const THENEWBLACK_EMAIL = process.env.THENEWBLACK_EMAIL
const THENEWBLACK_PASSWORD = process.env.THENEWBLACK_PASSWORD

export async function POST(req: Request) {
  console.log("necklace API route called")

  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the session from the request headers
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { necklace, gender, negative } = await req.json()

    if (!necklace || !gender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Deduct credits
    const { error: creditError } = await supabase.rpc("deduct_credit", {
      user_id: user.id,
      amount: 1,
    })

    if (creditError) {
      return NextResponse.json({ error: "Failed to deduct credit" }, { status: 500 })
    }

    const formData = new FormData()
    formData.append("email", THENEWBLACK_EMAIL)
    formData.append("password", THENEWBLACK_PASSWORD)
    formData.append("necklace", necklace)
    formData.append("gender", gender)
    if (negative) {
      formData.append("negative", negative)
    }

    const response = await fetch(THENEWBLACK_API_URL, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Failed to generate necklace image: ${errorText}` },
        { status: response.status },
      )
    }

    const imageUrl = await response.text()

    await supabase.from("generated_images").insert({
      user_id: user.id,
      image_url: imageUrl,
      type: "necklace",
      status: "completed",
    })

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error generating necklace image:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
