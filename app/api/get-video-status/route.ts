import { NextResponse } from "next/server"

// Import everything from Runway
import * as Runway from "@runwayml/hosted-models"

export async function GET(req: Request) {
  // ... (Authentication remains the same)

  try {
    const uuid = req.url.split("uuid=")[1]

    // Correctly initialize Runway
    const runway = new Runway.Runway({ token: process.env.RUNWAY_API_KEY })

    const statusData = await runway.poll(uuid)

    // ... (Rest of the code remains the same)
  } catch (error) {
    console.error("Error getting video status:", error)
    return NextResponse.json({ error: "Failed to get video status" }, { status: 500 })
  }
}
