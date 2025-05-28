"use client"

import { useState, useEffect, useCallback } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Download, Upload, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useLanguage } from "@/components/simple-language-switcher"

export default function FashionEdit() {
  return (
    <ProtectedRoute>
      <FashionEditContent />
    </ProtectedRoute>
  )
}

function FashionEditContent() {
  const { user, session, refreshSession, loading } = useAuth()
  const router = useRouter()
  const [userCredits, setUserCredits] = useState(0)
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [removePrompt, setRemovePrompt] = useState("")
  const [replacePrompt, setReplacePrompt] = useState("")
  const [negative, setNegative] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationStatus, setGenerationStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle")
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
    setGenerationStatus("processing")

    try {
      if (!session) {
        console.log("No session found, attempting to refresh...")
        await refreshSession()
        if (!session) {
          throw new Error("Failed to refresh session. Please log in again.")
        }
      }

      console.log("Session state:", session)

      if (!originalImage) {
        throw new Error("Please upload an image.")
      }
      if (!removePrompt || !replacePrompt) {
        throw new Error("Please provide both remove and replace prompts.")
      }
      if (userCredits < 1) {
        throw new Error("Insufficient credit. You need at least 1 credit to edit an image.")
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

      console.log("Sending edit request with token:", session.access_token)
      const editResponse = await fetch("/api/fashion-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          image: uploadedImageUrl,
          remove: removePrompt,
          replace: replacePrompt,
          negative,
        }),
      })

      console.log("Edit response status:", editResponse.status)

      if (!editResponse.ok) {
        const errorData = await editResponse.text()
        console.error("Edit response error:", errorData)
        throw new Error(errorData || "Failed to edit image")
      }

      const responseText = await editResponse.text()
      let responseData

      try {
        responseData = JSON.parse(responseText)
      } catch (parseError) {
        // If parsing fails, assume the response is a direct image URL
        responseData = { imageUrl: responseText }
      }

      if (!responseData.imageUrl) {
        throw new Error("No image URL in the response")
      }

      setGeneratedImage(responseData.imageUrl)
      setGenerationStatus("completed")
      await fetchUserCredits()

      toast({
        title: "Success",
        description: "Clothes changed successfully!",
      })
    } catch (error) {
      console.error("Error in handleGenerate:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      setGenerationStatus("failed")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
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
      a.download = `edited-fashion-${Date.now()}.png`
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

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        try {
          await refreshSession()
        } catch (error) {
          console.error("Failed to refresh session:", error)
          router.push("/login")
        }
      }
    }

    checkSession()
  }, [session, refreshSession, router])

  useEffect(() => {
    console.log("Current session state:", session)
  }, [session])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    router.push("/login")
    return null
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
          <h1 className="text-3xl font-bold">{t("fashionEdit.title")}</h1>
          <p className="text-gray-600">{t("fashionEdit.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t("fashion.original")}</h2>
            <div className="space-y-4">
              {!originalImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-pink-500 hover:text-pink-600">{t("common.upload")}</span>{" "}
                      {t("common.dragAndDrop")}
                    </Label>
                    <p className="text-sm text-gray-500">{t("common.imageFormatInfo")}</p>
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
            <h2 className="text-xl font-semibold mb-4">{t("fashionEdit.editOptions")}</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="remove">{t("fashionEdit.clothesToRemove")}</Label>
                <Textarea
                  id="remove"
                  placeholder={
                    t("fashionEdit.removeClothesPlaceholder") ||
                    "Describe the clothes you want to remove from the image..."
                  }
                  value={removePrompt}
                  onChange={(e) => setRemovePrompt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="replace">{t("fashionEdit.newClothesToAdd")}</Label>
                <Textarea
                  id="replace"
                  placeholder={
                    t("fashionEdit.addClothesPlaceholder") || "Describe the new clothes you want to add to the image..."
                  }
                  value={replacePrompt}
                  onChange={(e) => setReplacePrompt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="negative">{t("common.negativePrompt")}</Label>
                <Textarea
                  id="negative"
                  placeholder={t("common.negativePlaceholder") || "Describe what you don't want in the edited image..."}
                  value={negative}
                  onChange={(e) => setNegative(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">{t("fashionEdit.generatedEdit")}</h2>
            <div className="space-y-4">
              {error && <div className="text-red-500 mt-4">Error: {error}</div>}
              {generatedImage ? (
                <div className="relative">
                  <div className="aspect-square relative">
                    <Image
                      src={generatedImage || "/placeholder.svg"}
                      alt="Edited Fashion Image"
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
                  <p className="text-gray-500">
                    {generationStatus === "processing" ? t("ai.generating") : t("fashionEdit.editWillAppear")}
                  </p>
                </div>
              )}
              <Button
                onClick={handleGenerate}
                className="w-full"
                disabled={isLoading || !originalImage || !removePrompt || !replacePrompt || userCredits < 1 || !session}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("ai.generating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("fashionEdit.generateEdit")}
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
