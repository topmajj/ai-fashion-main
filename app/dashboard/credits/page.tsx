"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Zap } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { loadStripe } from "@stripe/stripe-js"
import { ProtectedRoute } from "@/components/protected-route"
import { useUser } from "@/lib/use-user"
import { FatoraCheckoutButton } from "@/components/fatora-checkout-button"
import { useLanguage } from "@/components/simple-language-switcher"

export default function Credits() {
  return (
    <ProtectedRoute>
      <CreditsContent />
    </ProtectedRoute>
  )
}

function CreditsContent() {
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const { t, isRTL } = useLanguage()

  // Check for Fatora payment success
  useEffect(() => {
    const success = searchParams.get("success")
    const provider = searchParams.get("provider")
    const orderId = searchParams.get("order_id")

    if (success === "true" && provider === "fatora" && orderId && user) {
      verifyFatoraPayment(orderId)
    }
  }, [searchParams, user])

  // Function to verify Fatora payment
  const verifyFatoraPayment = async (orderId: string) => {
    if (verifyingPayment) return

    setVerifyingPayment(true)
    try {
      const response = await fetch("/api/verify-fatora-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (data.verified && data.updated) {
        toast({
          title: t("credits.success.paymentSuccessful"),
          description: t("credits.success.creditsAdded"),
        })
        // Update credits in state
        if (data.credits) {
          setCredits(data.credits)
        } else {
          // Refresh credits if not returned
          fetchCredits()
        }
        // Remove query params
        router.push("/dashboard/credits")
      } else {
        toast({
          title: t("credits.error.paymentVerificationFailed"),
          description: data.error || t("credits.error.contactSupport"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error verifying payment:", error)
      toast({
        title: t("common.error"),
        description: t("credits.error.verificationFailed"),
        variant: "destructive",
      })
    } finally {
      setVerifyingPayment(false)
    }
  }

  useEffect(() => {
    console.log("Credits page loaded, user:", user ? "Found" : "Not found")

    const fetchCredits = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.from("users").select("credits").eq("id", user.id).single()

          if (error) throw error
          console.log("Fetched credits:", data.credits)
          setCredits(data.credits)
        } catch (error) {
          console.error("Error fetching credits:", error)
          toast({
            title: t("common.error"),
            description: t("credits.error.fetchFailed"),
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else {
        console.log("No user found, unable to fetch credits")
        setLoading(false)
      }
    }

    fetchCredits()
  }, [user, supabase, t])

  const fetchCredits = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from("users").select("credits").eq("id", user.id).single()

      if (error) throw error
      console.log("Fetched credits:", data.credits)
      setCredits(data.credits)
    } catch (error) {
      console.error("Error fetching credits:", error)
    }
  }

  const handlePurchaseCredits = async (amount: number) => {
    console.log("handlePurchaseCredits called with amount:", amount)
    setPurchaseLoading(true)
    try {
      if (!user) {
        console.error("No user found")
        toast({
          title: t("common.error"),
          description: t("credits.error.loginRequired"),
          variant: "destructive",
        })
        return
      }

      console.log("Creating checkout session...")

      // Try multiple approaches to get the token
      let token = null

      // Approach 1: Get from current session
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData?.session?.access_token) {
          console.log("Got token from current session")
          token = sessionData.session.access_token
        }
      } catch (e) {
        console.error("Error getting session:", e)
      }

      // Approach 2: If still no token, try to get from user
      if (!token) {
        try {
          const { data } = await supabase.auth.getUser()
          if (data?.user?.id) {
            // Force refresh the session
            const { data: refreshData } = await supabase.auth.refreshSession()
            if (refreshData?.session?.access_token) {
              console.log("Got token after refreshing session")
              token = refreshData.session.access_token
            }
          }
        } catch (e) {
          console.error("Error refreshing session:", e)
        }
      }

      // If still no token, try a different approach
      if (!token) {
        // Use the user ID directly in the request body instead of relying on the token
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            userId: user.id, // Include the user ID directly
          }),
        })

        console.log("Checkout session response:", response.status, response.statusText)
        const responseData = await response.json()
        console.log("Checkout session data:", responseData)

        if (!response.ok) {
          throw new Error(responseData.error || t("credits.error.checkoutSessionFailed"))
        }

        const { sessionId } = responseData
        console.log("Stripe sessionId:", sessionId)

        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        console.log("Stripe loaded:", stripe ? "Yes" : "No")

        if (stripe) {
          console.log("Redirecting to Stripe checkout...")
          const { error } = await stripe.redirectToCheckout({ sessionId })
          if (error) {
            console.error("Stripe redirect error:", error)
            throw new Error(t("credits.error.checkoutRedirectFailed"))
          }
        } else {
          throw new Error(t("credits.error.stripeLoadFailed"))
        }

        return // Exit early since we've handled the request
      }

      // If we have a token, proceed with the original approach
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      })

      console.log("Checkout session response:", response.status, response.statusText)
      const responseData = await response.json()
      console.log("Checkout session data:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || t("credits.error.checkoutSessionFailed"))
      }

      const { sessionId } = responseData
      console.log("Stripe sessionId:", sessionId)

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      console.log("Stripe loaded:", stripe ? "Yes" : "No")

      if (stripe) {
        console.log("Redirecting to Stripe checkout...")
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error("Stripe redirect error:", error)
          throw new Error(t("credits.error.checkoutRedirectFailed"))
        }
      } else {
        throw new Error(t("credits.error.stripeLoadFailed"))
      }
    } catch (error) {
      console.error("Error purchasing credits:", error)
      toast({
        title: t("common.error"),
        description: error.message || t("credits.error.purchaseFailed"),
        variant: "destructive",
      })
    } finally {
      setPurchaseLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    )
  }

  // Define credit packages
  const creditPackages = [
    { amount: 10, credits: 10, price: "$9.99" },
    { amount: 50, credits: 50, price: "$39.99" },
    { amount: 100, credits: 100, price: "$69.99" },
  ]

  return (
    <Layout>
      <div className="mb-8" dir={isRTL ? "rtl" : "ltr"}>
        <h1 className="text-3xl font-bold">{t("credits.title")}</h1>
        <p className="text-muted-foreground">{t("credits.subtitle")}</p>
      </div>

      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4" dir={isRTL ? "rtl" : "ltr"}>
            {t("credits.creditBalance")}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center" dir={isRTL ? "rtl" : "ltr"}>
              <span className="text-2xl font-bold">
                {credits} {t("common.credits")}
              </span>
              <Button onClick={() => router.refresh()} variant="outline" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("credits.refreshCredits")}
              </Button>
            </div>
            <Progress value={(credits / 100) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground" dir={isRTL ? "rtl" : "ltr"}>
              {t("credits.creditExplanation")}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4" dir={isRTL ? "rtl" : "ltr"}>
            {t("credits.purchaseCredits")}
          </h2>

          {/* Payment method tabs */}
          <div className="mb-6 border-b">
            <div className="flex space-x-4" dir={isRTL ? "rtl" : "ltr"}>
              <button className="pb-2 border-b-2 border-primary font-medium" aria-selected="true">
                {t("credits.paymentOptions")}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creditPackages.map((pack, index) => (
              <div key={index} className="border rounded-lg p-4 text-center">
                <h3 className="font-semibold mb-2" dir={isRTL ? "rtl" : "ltr"}>
                  {pack.credits} {t("common.credits")}
                </h3>
                <p className="text-2xl font-bold mb-2">{pack.price}</p>
                <div className="space-y-2">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => handlePurchaseCredits(pack.amount)}
                    disabled={purchaseLoading || !user}
                  >
                    {purchaseLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    {t("credits.payWithStripe")}
                  </Button>

                  {/* Fatora button is hidden now */}
                  {false && user && (
                    <FatoraCheckoutButton
                      userId={user.id}
                      userEmail={user.email || ""}
                      credits={pack.credits}
                      amount={pack.amount}
                      buttonText={t("credits.payWithFatora")}
                      variant="outline"
                      className="w-full"
                      disabled={verifyingPayment}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  )
}
