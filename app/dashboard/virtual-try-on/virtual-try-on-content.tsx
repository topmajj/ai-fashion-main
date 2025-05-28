"use client"

import { useState, useEffect, useCallback } from "react"
import { Layout } from "@/components/layout"
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
import { ProtectedRoute } from "@/components/protected-route"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import type React from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/simple-language-switcher"

export default function VirtualTryOnContent() {
  const { t, isRTL, locale } = useLanguage()
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
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const router = useRouter()

  // Debug current language and translation
  useEffect(() => {
    // Safe to access browser APIs inside useEffect
    console.log("Current language in VirtualTryOnContent:", locale)
    console.log("Sample translation:", t("virtualTryOn.title"))
    console.log("Current direction:", isRTL ? "RTL" : "LTR")

    if (typeof document !== "undefined") {
      console.log("HTML dir attribute:", document.documentElement.dir)
    }
  }, [locale, t, isRTL])

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("virtualTryOn.fileTooLarge"),
          description: t("virtualTryOn.fileSizeLimit"),
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
        throw new Error(t("virtualTryOn.error.authRequired"))
      }

      if (!modelPhoto || !clothingPhoto) {
        throw new Error(t("virtualTryOn.error.uploadBoth"))
      }

      if (userCredits < 2) {
        throw new Error(t("virtualTryOn.error.insufficientCredits"))
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
        throw new Error(errorData.error || t("virtualTryOn.error.initiateTryOn"))
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
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      setGenerationId(id)
      setPolling(true)
    }
  }, [id])

  const pollForResults = useCallback(async () => {
    if (!generationId || !polling) return

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error(t("virtualTryOn.error.authRequired"))
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
        const errorData = await response.json()
        console.error("Error data from status API:", errorData)
        throw new Error(errorData.error || t("virtualTryOn.error.initiateTryOn"))
      }

      const data = await response.json()
      console.log("Polling response:", data)

      if (data.status === "completed" && data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        setPolling(false)
        toast({
          title: t("common.success"),
          description: t("virtualTryOn.success.generated"),
        })
        router.replace(`/dashboard/virtual-try-on?id=${generationId}`)
        await fetchUserCredits()
      } else if (data.status === "failed") {
        setError(data.error || t("virtualTryOn.error.generationFailed"))
        setPolling(false)
        toast({
          title: t("common.error"),
          description: data.error || t("virtualTryOn.error.generationFailed"),
          variant: "destructive",
        })
      } else if (data.status === "processing") {
        if (pollCount > 60) {
          // Increased timeout to 5 minutes (60 * 5 seconds)
          setError(t("virtualTryOn.error.generationTimeout"))
          setPolling(false)
          toast({
            title: t("common.error"),
            description: t("virtualTryOn.error.generationTimeout"),
            variant: "destructive",
          })
        } else {
          setPollCount((prev) => prev + 1)
        }
      }
    } catch (error) {
      console.error("Error polling for results:", error)
      if (pollCount > 60) {
        // Increased timeout to 5 minutes (60 * 5 seconds)
        setError(t("virtualTryOn.error.generationTimeout"))
        setPolling(false)
        toast({
          title: t("common.error"),
          description: t("virtualTryOn.error.generationTimeout"),
          variant: "destructive",
        })
      } else {
        setPollCount((prev) => prev + 1)
      }
    }
  }, [generationId, polling, pollCount, fetchUserCredits, router, t])

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
        title: t("common.error"),
        description: t("virtualTryOn.error.downloadFailed"),
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{locale === "en" ? "Virtual Try-On" : t("virtualTryOn.title")}</h1>
          <p className="text-gray-600">
            {locale === "en"
              ? "Upload model and clothing photos to see how they look together"
              : t("virtualTryOn.subtitle")}
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isRTL ? "direction-rtl" : ""}`}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {locale === "en" ? "Upload Images" : t("virtualTryOn.uploadImages")}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="model-photo">{locale === "en" ? "Model Photo" : t("virtualTryOn.modelPhoto")}</Label>
                <Input
                  id="model-photo"
                  type="file"
                  onChange={(e) => handleImageUpload(e, setModelPhoto)}
                  accept="image/*"
                />
              </div>
              <div>
                <Label htmlFor="clothing-photo">
                  {locale === "en" ? "Clothing Photo" : t("virtualTryOn.clothingPhoto")}
                </Label>
                <Input
                  id="clothing-photo"
                  type="file"
                  onChange={(e) => handleImageUpload(e, setClothingPhoto)}
                  accept="image/*"
                />
              </div>
              <div>
                <Label htmlFor="clothing-type">
                  {locale === "en" ? "Clothing Type" : t("virtualTryOn.clothingType")}
                </Label>
                <Select value={clothingType} onValueChange={setClothingType}>
                  <SelectTrigger id="clothing-type">
                    <SelectValue placeholder={locale === "en" ? "Select type" : t("virtualTryOn.selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tops">{locale === "en" ? "Tops" : t("virtualTryOn.tops")}</SelectItem>
                    <SelectItem value="bottoms">{locale === "en" ? "Bottoms" : t("virtualTryOn.bottoms")}</SelectItem>
                    <SelectItem value="one-pieces">
                      {locale === "en" ? "One Pieces" : t("virtualTryOn.onePieces")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {locale === "en" ? "Generated Try-On" : t("virtualTryOn.generatedTryOn")}
            </h2>
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
                  <p className="text-sm text-gray-500">{t("virtualTryOn.generatingWait")}</p>
                </div>
              )}
              {generatedImage && (
                <div className="relative">
                  <Image
                    src={generatedImage || "/placeholder.svg"}
                    alt={t("virtualTryOn.generatedTryOn")}
                    width={500}
                    height={500}
                    className="rounded-lg"
                  />
                  <Button
                    onClick={handleDownload}
                    className="absolute top-2 right-2"
                    size="icon"
                    variant="secondary"
                    aria-label={t("virtualTryOn.downloadImage")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {!generatedImage && !isLoading && !polling && <p>{t("virtualTryOn.imageWillAppear")}</p>}
              <Button
                onClick={handleGenerate}
                className="w-full"
                disabled={isLoading || !modelPhoto || !clothingPhoto || userCredits < 2}
              >
                {isLoading ? t("virtualTryOn.generating") : t("virtualTryOn.generateTryOn")}
              </Button>
              {user && (
                <p className="mt-2 text-sm text-gray-500">
                  {t("virtualTryOn.credits")}: {userCredits}
                </p>
              )}
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
