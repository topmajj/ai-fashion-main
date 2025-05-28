import { NextResponse } from "next/server"
import { verifyFatoraPayment } from "@/lib/fatora"
import { supabase } from "@/lib/supabase"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const { orderId, transactionId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id parameter" }, { status: 400 })
    }

    logger.info(`Verifying Fatora payment for order: ${orderId}`)

    // Verify the payment with Fatora
    const verificationResult = await verifyFatoraPayment(orderId, transactionId)

    // Check if the verification was successful
    if (verificationResult.status !== "SUCCESS" || !verificationResult.result) {
      logger.error(`Payment verification failed: ${JSON.stringify(verificationResult)}`)
      return NextResponse.json({ verified: false, error: "Payment verification failed" })
    }

    const paymentDetails = verificationResult.result

    // Check if payment status is SUCCESS
    if (paymentDetails.payment_status !== "SUCCESS") {
      logger.info(`Payment not successful: ${paymentDetails.payment_status}`)
      return NextResponse.json({
        verified: false,
        status: paymentDetails.payment_status,
        message: "Payment has not been completed successfully",
      })
    }

    // Extract user ID from order_id (assuming format: order_timestamp_userId)
    const orderParts = orderId.split("_")
    if (orderParts.length < 3) {
      logger.error(`Invalid order_id format: ${orderId}`)
      return NextResponse.json({ verified: false, error: "Invalid order_id format" })
    }

    const userId = orderParts[orderParts.length - 1]
    const amount = paymentDetails.amount

    // Insert transaction record
    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: userId,
      amount: amount,
      credits: amount, // Using amount as credits for simplicity
      status: "completed",
      stripe_session_id: paymentDetails.transaction_id, // Using this field for Fatora transaction ID
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      logger.error(`Failed to create transaction record: ${insertError.message}`)
      return NextResponse.json({ verified: true, updated: false, error: "Database error" })
    }

    // Update user credits
    const { data: userData, error: userQueryError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single()

    if (userQueryError) {
      logger.error(`Error fetching user credits: ${userQueryError.message}`)
      return NextResponse.json({
        verified: true,
        transaction: true,
        credits: false,
        error: "Failed to fetch user data",
      })
    }

    const newCredits = (userData.credits || 0) + amount

    const { error: userUpdateError } = await supabase.from("users").update({ credits: newCredits }).eq("id", userId)

    if (userUpdateError) {
      logger.error(`Failed to update user credits: ${userUpdateError.message}`)
      return NextResponse.json({
        verified: true,
        transaction: true,
        credits: false,
        error: "Failed to update user credits",
      })
    }

    logger.info(`Successfully processed verified Fatora payment for user ${userId}`)
    return NextResponse.json({
      verified: true,
      updated: true,
      credits: newCredits,
      userId,
      transactionId: paymentDetails.transaction_id,
    })
  } catch (error: any) {
    logger.error(`Error verifying Fatora payment: ${error.message}`)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
