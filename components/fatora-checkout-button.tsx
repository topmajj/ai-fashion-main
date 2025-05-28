"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useUser } from "@/lib/use-user"

interface FatoraCheckoutButtonProps {
  credits: number
  buttonText?: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  disabled?: boolean
}

export function FatoraCheckoutButton({
  credits,
  buttonText = "Pay with Fatora",
  className = "",
  variant = "default",
  disabled = false,
}: FatoraCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // Determine amount based on credits
      const amount = credits

      if (amount <= 0) {
        toast.error("Invalid amount selected")
        return
      }

      // Use the user from the useUser hook
      if (!user || !user.id) {
        toast.error("You must be logged in to make a purchase")
        return
      }

      const userId = user.id
      const userEmail = user.email || ""

      if (!userEmail) {
        toast.error("Your account doesn't have an email address. Please update your profile.")
        return
      }

      console.log("Creating Fatora payment:", {
        userId,
        userEmail,
        credits,
        amount,
      })

      // Generate a unique order ID
      const orderId = `order_${Date.now()}_${userId.substring(0, 8)}`

      // Call the API endpoint
      const response = await fetch("/api/create-fatora-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userEmail,
          credits,
          orderId,
          amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Fatora payment error:", data)
        toast.error(data.error || "Failed to create payment")
        return
      }

      if (data.url) {
        console.log("Redirecting to Fatora payment URL:", data.url)
        window.location.href = data.url
      } else {
        console.error("No payment URL returned:", data)
        toast.error("No payment URL returned")
      }
    } catch (err: any) {
      console.error("Fatora checkout error:", err)
      toast.error(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading || disabled} className={className} variant={variant}>
      {isLoading ? "Loading..." : buttonText}
    </Button>
  )
}
