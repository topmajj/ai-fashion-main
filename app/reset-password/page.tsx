"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles } from "lucide-react"

export default function ResetPasswordPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [isResetEmailSent, setIsResetEmailSent] = useState(false)

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) throw error
      toast({
        title: "Password reset email sent",
        description: "Please check your email for further instructions.",
      })
      setIsResetEmailSent(true)
    } catch (error) {
      console.error("Error resetting password:", error)
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-pink-300 mr-2" />
            <span className="text-xl font-bold text-pink-500">Topmaj AI Fashion</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError("")
                }}
                required
                className="mt-1"
              />
              {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
            </div>
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={loading}>
              {loading ? "Sending reset email..." : "Send Reset Email"}
            </Button>
          </form>
        </Card>
        {isResetEmailSent && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            <p>Password reset email sent successfully. Please check your inbox for further instructions.</p>
          </div>
        )}
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-pink-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
