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
import { Progress } from "@/components/ui/progress"
import zxcvbn from "zxcvbn"
import { Sparkles } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [registerButtonText, setRegisterButtonText] = useState("Register")
  const router = useRouter()

  const checkPasswordStrength = (password: string) => {
    const result = zxcvbn(password)
    setPasswordStrength(result.score)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setRegisterButtonText("Registering...")

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      if (data.user) {
        await supabase.from("users").insert({ id: data.user.id, email, name, credits: 50 })
        await supabase.from("profiles").insert({ id: data.user.id })
        await supabase.from("user_settings").insert({ id: data.user.id })
      }
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRegisterButtonText("Register")
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h1>
            <p className="text-gray-600 mt-2">Join and start creating</p>
          </div>
          <Card className="p-6 dark:bg-gray-800/50 dark:border-gray-700">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
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
                  onChange={(e) => {
                    setPassword(e.target.value)
                    checkPasswordStrength(e.target.value)
                  }}
                  required
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Progress value={(passwordStrength / 4) * 100} className="mt-2 dark:bg-gray-700" />
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                  {passwordStrength === 0 && "Very weak"}
                  {passwordStrength === 1 && "Weak"}
                  {passwordStrength === 2 && "Fair"}
                  {passwordStrength === 3 && "Good"}
                  {passwordStrength === 4 && "Strong"}
                </p>
              </div>
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={loading}>
                {registerButtonText}
              </Button>
            </form>
          </Card>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link href="/login" className="text-sm text-pink-600 hover:underline dark:text-pink-400">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
