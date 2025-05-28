import { NextResponse } from "next/server"

interface Pack {
  id: number
  title: string
  cover_image?: string // Add optional cover_image property
}

export async function GET(req: Request) {
  try {
    const response = await fetch("https://api.astria.ai/gallery/packs", {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch packs")
    }

    const data = await response.json()

    // Check if cover_image exists in the response
    if (data.length > 0 && !("cover_image" in data[0])) {
      console.warn("The Astria API does not provide cover images for packs.")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching packs:", error)
    return NextResponse.json({ error: "Failed to fetch packs" }, { status: 500 })
  }
}
