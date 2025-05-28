import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import stripe from "@/lib/stripe"

export async function POST(req: Request) {
  console.log("Create checkout session API route called")
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Parse the request body first
    const requestData = await req.json()
    const { amount, userId } = requestData

    console.log("Request data:", { amount, userId: userId ? "Provided" : "Not provided" })

    if (!amount || typeof amount !== "number") {
      console.error("Invalid amount provided")
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Determine user ID either from token or directly provided
    let authenticatedUserId = null

    // Check if userId is directly provided in the request
    if (userId) {
      console.log("Using directly provided user ID")
      authenticatedUserId = userId
    } else {
      // Try to get user ID from token
      const authHeader = req.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("No valid authorization header found and no userId provided")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Extract the token
      const token = authHeader.split(" ")[1]
      console.log("Verifying token...")

      // Verify the token
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token)

      if (error || !user) {
        console.error("Error verifying token:", error)
        return NextResponse.json({ error: "Token verification failed" }, { status: 401 })
      }

      console.log("Token verified successfully for user:", user.id)
      authenticatedUserId = user.id
    }

    // Verify the user exists in the database
    if (authenticatedUserId) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", authenticatedUserId)
        .single()

      if (userError || !userData) {
        console.error("User not found in database:", userError)
        return NextResponse.json({ error: "User not found" }, { status: 401 })
      }

      console.log("User verified in database:", authenticatedUserId)
    } else {
      console.error("No user ID could be determined")
      return NextResponse.json({ error: "User identification failed" }, { status: 401 })
    }

    console.log("Creating Stripe checkout session...")
    let stripeSession
    try {
      stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "AI Generation Credits",
              },
              unit_amount: amount * 100, // amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/credits?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/credits`,
        client_reference_id: authenticatedUserId,
      })
    } catch (stripeError) {
      console.error("Error creating Stripe session:", stripeError)
      return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 })
    }

    console.log("Stripe session created:", stripeSession.id)

    return NextResponse.json({ sessionId: stripeSession.id })
  } catch (error) {
    console.error("Error in create-checkout-session route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
