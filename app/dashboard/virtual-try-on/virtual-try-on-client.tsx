"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/use-user"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function VirtualTryOnClient() {
  const [modelPhoto, setModelPhoto] = useState<File | null>(null)
  const [clothingPhoto, setClothingPhoto] = useState<File | null>(null)
  const [clothingType, setClothingType] = useState<"tops" | "bottoms" | "one-pieces">("tops")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const { user } = useUser()
  const [userCredits, setUserCredits] = useState(0)
  const [pollCount, setPollCount] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

  const fetchUserCredits = useCallback(async () => {
    if (user) {
      const { data, error } = await supabase.from("users").select("credits").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching user credits:", error)
      } else {
        setUserCredits(data.credits)
      }
    }
  }, [user])

  useEffect(() => {
    fetchUserCredits()
    const interval = setInterval(fetchUserCredits, 30000)

    return () => clearInterval(interval)
  }, [fetchUserCredits])

  useEffect(() => {
    const id = searchParams?.get("id")
    if (id) {
      setGenerationId(id)
      setPolling(true)
    }
  }, [searchParams])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        })
        return
      }
      setter(file)
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)
    setPollCount(0)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("Authentication required")
      }

      if (!modelPhoto || !clothingPhoto) {
        throw new Error("Please upload both model and clothing photos.")
      }

      if (userCredits < 2) {
        throw new Error(
          "Insufficient credits. You need 2 credits for Virtual Try-On. Please purchase more credits to continue.",
        )
      }

      const formData = new FormData()
      formData.append("model_photo", modelPhoto)
      formData.append("clothing_photo", clothingPhoto)
      formData.append("clothing_type", clothingType)

      const response = await fetch("/api/virtual-try-on", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initiate virtual try-on")
      }

      const data = await response.json()
      setGenerationId(data.generationId)
      setPolling(true)

      await supabase.rpc("deduct_credit", {
        user_id: user.id,
        amount: 2,
      })
      await fetchUserCredits()
    } catch (error) {
      console.error("Error initiating virtual try-on:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pollForResults = useCallback(async () => {
    if (!generationId || !polling) return

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`/api/virtual-try-on/status?id=${generationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 504) {
          console.log("Timeout occurred, continuing to poll")
          return // Continue polling
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Polling response:", data)

      if (data.status === "completed" && data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        setPolling(false)
        toast({
          title: "Success",
          description: "Virtual try-on image generated successfully!",
        })
        router.replace(`/dashboard/virtual-try-on?id=${generationId}`)
        await fetchUserCredits()
      } else if (data.status === "failed") {
        setError(data.error || "Image generation failed")
        setPolling(false)
        toast({
          title: "Error",
          description: data.error || "Image generation failed",
          variant: "destructive",
        })
      } else if (data.status === "processing") {
        if (pollCount > 30) {
          setError("Image generation timed out")
          setPolling(false)
          toast({
            title: "Error",
            description: "Image generation timed out",
            variant: "destructive",
          })
        } else {
          setPollCount((prev) => prev + 1)
        }
      }
    } catch (error) {
      console.error("Error polling for results:", error)
      // Don't stop polling on error, just log it
      if (pollCount > 30) {
        setError("Image generation timed out")
        setPolling(false)
        toast({
          title: "Error",
          description: "Image generation timed out",
          variant: "destructive",
        })
      } else {
        setPollCount((prev) => prev + 1)
      }
    }
  }, [generationId, polling, pollCount, fetchUserCredits, router])

  useEffect(() => {
    if (polling) {
      const interval = setInterval(pollForResults, 5000)
      return () => clearInterval(interval)
    }
  }, [pollForResults, polling])

  const handleDownload = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "virtual-try-on.png"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="model-photo">Model Photo</Label>
            <Input
              id="model-photo"
              type="file"
              onChange={(e) => handleImageUpload(e, setModelPhoto)}
              accept="image/*"
            />
          </div>
          <div>
            <Label htmlFor="clothing-photo">Clothing Photo</Label>
            <Input
              id="clothing-photo"
              type="file"
              onChange={(e) => handleImageUpload(e, setClothingPhoto)}
              accept="image/*"
            />
          </div>
          <div>
            <Label htmlFor="clothing-type">Clothing Type</Label>
            <Select value={clothingType} onValueChange={setClothingType}>
              <SelectTrigger id="clothing-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="bottoms">Bottoms</SelectItem>
                <SelectItem value="one-pieces">One-Pieces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Try-On</h2>
        <div className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          {isLoading && (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {polling && !isLoading && !generatedImage && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
              <p className="text-sm text-gray-500">Generating... This may take a few minutes.</p>
            </div>
          )}
          {generatedImage && (
            <div className="relative">
              <Image
                src={generatedImage || "/placeholder.svg"}
                alt="Generated Try-On"
                width={500}
                height={500}
                className="rounded-lg"
              />
              <Button onClick={handleDownload} className="absolute top-2 right-2" size="icon" variant="secondary">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
          {!generatedImage && !isLoading && !polling && <p>Your generated image will appear here</p>}
          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={isLoading || !modelPhoto || !clothingPhoto || userCredits < 2}
          >
            {isLoading ? "Generating..." : `Generate Try-On (2 Credits)`}
          </Button>
          {user && <p className="mt-2 text-sm text-gray-500">Credits: {userCredits}</p>}
        </div>
      </Card>
    </div>
  )
}
