import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Simplify the route handler to use a more basic approach
export async function POST(request: Request, context: any) {
  const packId = context.params.packId
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const tuneName = formData.get("tuneName") as string
    const tuneTitle = formData.get("tuneTitle") as string
    const images = formData.getAll("images") as File[]

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer())
        const fileExt = image.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { data, error } = await supabase.storage.from("fashion-images").upload(fileName, buffer, {
          contentType: image.type,
          upsert: false,
        })

        if (error) throw error

        const {
          data: { publicUrl },
        } = supabase.storage.from("fashion-images").getPublicUrl(fileName)

        return publicUrl
      }),
    )

    const astriaFormData = new FormData()
    astriaFormData.append("tune[title]", tuneTitle)
    astriaFormData.append("tune[name]", tuneName)
    imageUrls.forEach((url) => astriaFormData.append("tune[image_urls][]", url))

    const response = await fetch(`https://api.astria.ai/p/${packId}/tunes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
      body: astriaFormData,
    })

    if (!response.ok) {
      throw new Error("Failed to create tune")
    }

    const tuneData = await response.json()
    return NextResponse.json(tuneData)
  } catch (error) {
    console.error("Error creating tune:", error)
    return NextResponse.json({ error: "Failed to create tune" }, { status: 500 })
  }
}
