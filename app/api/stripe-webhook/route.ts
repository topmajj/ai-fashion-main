import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import stripe from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any

    const supabase = createServerSupabaseClient()

    // Update user's credits
    const { error: updateError } = await supabase.rpc("add_credits", {
      user_id: session.client_reference_id,
      credit_amount: Math.floor(session.amount_total / 100), // Convert cents to credits
    })

    if (updateError) {
      console.error("Error updating credits:", updateError)
      return NextResponse.json({ error: "Error updating credits" }, { status: 500 })
    }

    // Record the transaction
    const { error: transactionError } = await supabase.from("transactions").insert({
      user_id: session.client_reference_id,
      amount: session.amount_total,
      credits: Math.floor(session.amount_total / 100),
      status: "completed",
      stripe_session_id: session.id,
    })

    if (transactionError) {
      console.error("Error recording transaction:", transactionError)
      return NextResponse.json({ error: "Error recording transaction" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
