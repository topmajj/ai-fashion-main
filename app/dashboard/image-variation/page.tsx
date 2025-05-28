"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Download, Upload, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useLanguage } from "@/components/simple-language-switcher"

export default function ImageVariation() {
  return (
    <ProtectedRoute>
      <ImageVariationContent />
    </ProtectedRoute>
  )
}

function ImageVariationContent() {
  const { user, session, refreshSession } = useAuth()
  const router = useRouter()
  const [userCredits, setUserCredits] = useState(0)
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [deviation, setDeviation] = useState(0.5)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, isRTL } = useLanguage()

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
    if (user) {
      fetchUserCredits()
    }
  }, [user, fetchUserCredits])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setOriginalImage(file)
      setOriginalImageUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    if (originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl)
    }
    setOriginalImage(null)
    setOriginalImageUrl(null)
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      if (!session) {
        console.log("No session found, attempting to refresh...")
        await refreshSession()
        if (!session) {
          throw new Error("Failed to refresh session. Please log in again.")
        }
      }

      if (!originalImage) {
        throw new Error("Please upload an image.")
      }
      if (!prompt) {
        throw new Error("Please provide a prompt for the variation.")
      }
      if (userCredits < 1) {
        throw new Error("Insufficient credit. You need at least 1 credit to generate an image variation.")
      }

      const formData = new FormData()
      formData.append("file", originalImage)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload image: ${await uploadResponse.text()}`)
      }

      const uploadData = await uploadResponse.json()
      const uploadedImageUrl = uploadData.imageUrl

      console.log("Sending variation request with token:", session.access_token)
      const variationResponse = await fetch("/api/image-variation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          image: uploadedImageUrl,
          prompt,
          deviation,
        }),
      })

      if (!variationResponse.ok) {
        const errorText = await variationResponse.text()
        console.error("Variation response error:", errorText)
        throw new Error(errorText || "Failed to generate image variation")
      }

      const responseData = await variationResponse.json()
      setGeneratedImage(responseData.imageUrl)
      await fetchUserCredits()

      toast({
        title: "Success",
        description: "Image variation generated successfully!",
      })
    } catch (error) {
      console.error("Error in handleGenerate:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image variation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return
    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `image-variation-${Date.now()}.png`
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
    <Layout>
      <div className={isRTL ? "rtl" : ""}>
        <div className="mb-4 text-right">
          <span className="font-bold">
            {t("sidebar.credits")}: {userCredits}
          </span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("imageVariation.title")}</h1>
          <p className="text-gray-600">{t("imageVariation.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t("fashion.original") || "Original Image"}</h2>
            <div className="space-y-4">
              {!originalImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-pink-500 hover:text-pink-600">
                        {t("common.upload") || "Click to upload"}
                      </span>{" "}
                      {t("common.dragAndDrop") || "or drag and drop"}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {t("common.imageFormatInfo") || "PNG, JPG or WEBP (max. 10MB)"}
                    </p>
                    <Input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-square relative">
                    <Image
                      src={originalImageUrl || "/placeholder.svg"}
                      alt="Original Image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <Button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2"
                    size="icon"
                    variant="destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t("imageVariation.variationOptions")}</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">{t("ai.prompt")}</Label>
                <Textarea
                  id="prompt"
                  placeholder={t("imageVariation.variationPromptPlaceholder") || "Describe the variation you want..."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="deviation">{t("imageVariation.variationStrength") || "Deviation (0-1)"}</Label>
                <Slider
                  id="deviation"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[deviation]}
                  onValueChange={(value) => setDeviation(value[0])}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {t("common.currentValue") || "Current value"}: {deviation}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">{t("imageVariation.generatedVariations")}</h2>
            <div className="space-y-4">
              {error && <div className="text-red-500 mt-4">Error: {error}</div>}
              {generatedImage ? (
                <div className="relative">
                  <div className="aspect-square relative">
                    <Image
                      src={generatedImage || "/placeholder.svg"}
                      alt="Generated Image Variation"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <Button onClick={handleDownload} className="absolute top-2 right-2" size="icon" variant="secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">{t("imageVariation.variationsWillAppear")}</p>
                </div>
              )}
              <Button
                onClick={handleGenerate}
                className="w-full"
                disabled={isLoading || !originalImage || !prompt || userCredits < 1}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("ai.generating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("imageVariation.generateVariations")}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
