import { NextResponse } from "next/server"
import { createFatoraCheckoutSession } from "@/lib/fatora"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const { userId, userEmail, credits, orderId, amount } = await req.json()

    logger.info(`Received checkout request for user ${userId}, credits ${credits}`)

    if (!userId || !userEmail) {
      logger.error("Missing required fields in checkout request")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if FATORA_API_KEY is set
    if (!process.env.FATORA_API_KEY) {
      logger.error("FATORA_API_KEY environment variable is not set")
      return NextResponse.json({ error: "Fatora API key is not configured" }, { status: 500 })
    }

    // SKIP DATABASE OPERATIONS - They're causing the 500 error
    // We'll handle database operations after successful payment

    // Generate a unique order ID if not provided
    const finalOrderId = orderId || `order_${Date.now()}_${userId.substring(0, 8)}`

    try {
      // Create checkout session with the exact format required by Fatora
      const checkoutUrl = await createFatoraCheckoutSession({
        amount: amount,
        orderId: finalOrderId,
        customerEmail: userEmail,
        customerName: "User", // Use a simple ASCII name
        customerPhone: "+9740000000000", // Placeholder phone number
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/credits?success=true&provider=fatora&order_id=${finalOrderId}`,
        errorUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/credits?canceled=true&provider=fatora`,
        note: `Purchase of ${credits} credits`,
      })

      // Log the checkout URL for debugging
      logger.info(`Created Fatora checkout URL: ${checkoutUrl}`)

      return NextResponse.json({ url: checkoutUrl })
    } catch (checkoutError: any) {
      logger.error(`Error creating Fatora checkout: ${checkoutError.message}`)
      return NextResponse.json(
        { error: "Failed to create checkout session", details: checkoutError.message },
        { status: 500 },
      )
    }
  } catch (error: any) {
    logger.error(`Fatora checkout error: ${error.message}`)
    return NextResponse.json({ error: "Failed to create checkout session", details: error.message }, { status: 500 })
  }
}
