import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const THENEWBLACK_EMAIL = process.env.THENEWBLACK_EMAIL
const THENEWBLACK_PASSWORD = process.env.THENEWBLACK_PASSWORD
const THENEWBLACK_API_URL = "https://thenewblack.ai/api/1.1/wf/generated-models"
const THENEWBLACK_RESULTS_URL = "https://thenewblack.ai/api/1.1/wf/results"

async function uploadImage(supabase, file: File, userId: string, imageType: string): Promise<string | null> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}/${Date.now()}_${imageType}.${fileExt}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { data, error } = await supabase.storage.from("fashion-images").upload(fileName, buffer, {
    contentType: file.type,
    upsert: true,
  })

  if (error) {
    console.error(`Error uploading ${imageType} image:`, error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("fashion-images").getPublicUrl(fileName)
  return publicUrl
}

async function ensureBucketAccess(supabase) {
  try {
    const { data, error } = await supabase.storage.listBuckets()
    return !error && data.find((bucket) => bucket.name === "fashion-images")
  } catch (error) {
    console.error("Error checking bucket access:", error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    console.log("Starting AI model generation process")
    console.log("THENEWBLACK_EMAIL configured:", !!THENEWBLACK_EMAIL)
    console.log("THENEWBLACK_PASSWORD configured:", !!THENEWBLACK_PASSWORD)

    if (!THENEWBLACK_EMAIL || !THENEWBLACK_PASSWORD) {
      console.error("THENEWBLACK_EMAIL or THENEWBLACK_PASSWORD is not configured")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const formData = await req.formData()
    console.log("Received form data:", Object.fromEntries(formData))
    console.log("Request headers:", Object.fromEntries(req.headers))

    const clothingPhoto = formData.get("clothing_photo") as File
    const clothingType = formData.get("clothing_type") as string
    const gender = formData.get("gender") as string
    const country = formData.get("country") as string
    const age = formData.get("age") as string
    const otherClothes = formData.get("other_clothes") as string
    const imageContext = formData.get("image_context") as string
    const width = formData.get("width") as string
    const height = formData.get("height") as string

    // Log image details for debugging
    console.log("Clothing photo details:", {
      name: clothingPhoto.name,
      type: clothingPhoto.type,
      size: clothingPhoto.size,
    })

    if (!clothingPhoto || clothingPhoto.size === 0) {
      return NextResponse.json({ error: "Valid clothing image is required" }, { status: 400 })
    }

    if (!clothingType || !gender || !country || !age || !otherClothes || !imageContext || !width || !height) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("Form data validated successfully")
    const supabase = createRouteHandlerClient({ cookies })

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

    console.log("Checking fashion-images bucket...")
    if (!(await ensureBucketAccess(supabase))) {
      return NextResponse.json(
        { error: "Storage system is not properly configured. Please contact support." },
        { status: 500 },
      )
    }

    console.log("User authenticated:", user.id)

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("Error fetching user credits:", userError)
      return NextResponse.json({ error: "Failed to verify user credits" }, { status: 500 })
    }

    if (userData.credits < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    console.log("User has sufficient credits:", userData.credits)

    // Upload image and get public URL
    const clothingPhotoUrl = await uploadImage(supabase, clothingPhoto, user.id, "clothing")

    // Check if upload was successful
    if (!clothingPhotoUrl) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    const apiFormData = new FormData()
    apiFormData.append("email", THENEWBLACK_EMAIL)
    apiFormData.append("password", THENEWBLACK_PASSWORD)
    apiFormData.append("clothing_photo", clothingPhotoUrl)
    apiFormData.append("clothing_type", clothingType)
    apiFormData.append("gender", gender)
    apiFormData.append("country", country)
    apiFormData.append("age", age)
    apiFormData.append("other_clothes", otherClothes)
    apiFormData.append("image_context", imageContext)
    apiFormData.append("width", width)
    apiFormData.append("height", height)

    console.log("Sending request to TheNewBlack API with data:", {
      email: THENEWBLACK_EMAIL,
      password: "[REDACTED]", // Don't log the actual password
      clothing_photo: clothingPhotoUrl,
      clothing_type: clothingType,
      gender,
      country,
      age,
      other_clothes: otherClothes,
      image_context: imageContext,
      width,
      height,
    })

    const response = await fetch(THENEWBLACK_API_URL, {
      method: "POST",
      body: apiFormData,
    })

    if (!response.ok) {
      const errorText = await response.text() // Capture the error response
      console.error("THENEWBLACK API error:", response.status, errorText)
      return NextResponse.json({ error: `Failed to initiate AI model generation: ${errorText}` }, { status: 500 }) // Return the specific error
    }

    const generationId = await response.text() // This is the ID from TheNewBlack
    console.log("Received generation ID from TheNewBlack:", generationId)

    // Store generation ID and initial status in Supabase
    const { error: supabaseError } = await supabase.from("generated_images").insert({
      user_id: user.id,
      task_id: generationId, // Store TheNewBlack's ID
      status: "processing", // Set initial status to processing
      type: "ai_model_generator",
      original_image: clothingPhotoUrl,
      mask_image: null, // Not used in this version
    })

    if (supabaseError) {
      console.error("Error storing generation ID in Supabase:", supabaseError)
      return NextResponse.json({ error: "Failed to store generation data" }, { status: 500 })
    }

    return NextResponse.json({ generationId })
  } catch (error) {
    console.error("Error in AI model generation:", error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, details: error.stack },
        {
          status: 500,
        },
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies }) // Use cookies directly
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const taskId = req.nextUrl.searchParams.get("id")
    if (!taskId) {
      return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 })
    }

    let retries = 5
    let imageUrl = null

    while (retries > 0) {
      const resultsFormData = new FormData()
      resultsFormData.append("email", THENEWBLACK_EMAIL)
      resultsFormData.append("password", THENEWBLACK_PASSWORD)
      resultsFormData.append("id", taskId)

      const thenewblackResponse = await fetch(THENEWBLACK_RESULTS_URL, {
        method: "POST",
        body: resultsFormData,
      })

      console.log(
        "Response from TheNewBlack Results API (status, text):",
        thenewblackResponse.status,
        await thenewblackResponse.text(),
      ) // Log status and raw text

      if (!thenewblackResponse.ok) {
        const errorText = await thenewblackResponse.text()
        console.error("THENEWBLACK Results API error:", thenewblackResponse.status, errorText)
        throw new Error(`Failed to retrieve results: ${errorText}`)
      }

      imageUrl = await thenewblackResponse.text()

      if (imageUrl && !imageUrl.includes("error") && !imageUrl.includes("pending")) {
        break // Image generation successful
      } else if (imageUrl && imageUrl.includes("error")) {
        throw new Error(`Image generation failed: ${imageUrl}`) // Image generation failed
      }

      retries--
      if (retries > 0) {
        console.log("Image not ready yet. Retrying in 5 seconds...")
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    }

    if (retries === 0 && (!imageUrl || imageUrl.includes("pending"))) {
      console.error("Image generation timed out or still pending.")
      throw new Error("Image generation timed out or still pending.")
    }

    console.log("Final image URL:", imageUrl) // Log before updating Supabase

    const { error: updateError } = await supabase
      .from("generated_images")
      .update({ status: "completed", image_url: imageUrl })
      .eq("task_id", taskId)

    if (updateError) {
      console.error("Failed to update generation data in Supabase:", updateError)
      throw new Error("Failed to update generation data in Supabase")
    }

    return NextResponse.json({ imageUrl, status: "completed" })
  } catch (error) {
    console.error("Error retrieving AI model generation results:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
