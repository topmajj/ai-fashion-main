"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Apple, ChromeIcon as Google } from "lucide-react"
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false) // Added state variable
  const [loginButtonText, setLoginButtonText] = useState("Login")
  const [errorMessage, setErrorMessage] = useState("") // Added state variable
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginButtonText("Logging in...")
    setIsEmailUnconfirmed(false)
    setErrorMessage("") // Add this line
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setIsEmailUnconfirmed(true)
          setErrorMessage("Please confirm your email address before logging in.")
        } else if (error.message === "Invalid login credentials") {
          setErrorMessage("The email or password you entered is incorrect. Please try again.")
        } else {
          setErrorMessage(error.message || "An error occurred during login. Please try again.")
        }
        throw error
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        router.push("/dashboard")
      } else {
        throw new Error("Login failed. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setLoginButtonText("Login")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Google login error:", error)
      toast({
        title: "Google login failed",
        description: error.message || "An error occurred during Google login. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAppleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Apple login error:", error)
      toast({
        title: "Apple login failed",
        description: error.message || "An error occurred during Apple login. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleResendConfirmation = async () => {
    // Added function
    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })
      if (error) throw error
      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox and confirm your email address.",
      })
    } catch (error) {
      console.error("Resend confirmation error:", error)
      toast({
        title: "Failed to resend confirmation email",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex-grow flex flex-col items-center justify-center p-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-pink-300 mr-2" />
              <span className="text-xl font-bold text-pink-500">Topmaj AI Fashion</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          {errorMessage && ( // Added JSX
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
          )}
          <Card className="p-6 dark:bg-gray-800/50 dark:border-gray-700">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={loading}>
                {loginButtonText}
              </Button>
            </form>
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleGoogleLogin}>
                  <Google className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" onClick={handleAppleLogin}>
                  <Apple className="mr-2 h-4 w-4" />
                  Apple
                </Button>
              </div>
            </div>
            {isEmailUnconfirmed && ( // Added JSX
              <div className="mt-4">
                <p className="text-sm text-red-600 mb-2">
                  Your email is not confirmed. Please check your inbox or resend the confirmation email.
                </p>
                <Button onClick={handleResendConfirmation} variant="outline" className="w-full" disabled={loading}>
                  Resend Confirmation Email
                </Button>
              </div>
            )}
            <div className="mt-4 text-center">
              <Link href="/reset-password" className="text-sm text-pink-600 hover:underline dark:text-pink-400">
                Forgot password?
              </Link>
            </div>
          </Card>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <Link href="/register" className="text-sm text-pink-600 hover:underline dark:text-pink-400">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
