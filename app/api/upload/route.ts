import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

async function ensureBucketExists(supabase) {
  try {
    console.log("Checking fashion-images bucket...")
    const { data: bucket, error } = await supabase.storage.getBucket("fashion-images")

    if (error) {
      console.error("Error accessing fashion-images bucket:", error)
      return false
    }

    console.log("Successfully accessed fashion-images bucket")
    return true
  } catch (error) {
    console.error("Error in bucket access check:", error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      console.log("No Authorization header found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.log("Error verifying user:", error)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User authenticated:", user.id)

    if (!(await ensureBucketExists(supabase))) {
      return NextResponse.json(
        { error: "Storage system is not properly configured. Please contact support." },
        { status: 500 },
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data, error: uploadError } = await supabase.storage.from("fashion-images").upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("fashion-images").getPublicUrl(fileName)

    return NextResponse.json({ imageUrl: publicUrl })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image", details: error.message }, { status: 500 })
  }
}
