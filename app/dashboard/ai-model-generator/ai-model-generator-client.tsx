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
import { useLanguage } from "@/components/simple-language-switcher"

export default function AIModelGeneratorClient() {
  const { t, isRTL } = useLanguage()
  const [clothingPhoto, setClothingPhoto] = useState<File | null>(null)
  const [clothingType, setClothingType] = useState<"tops" | "bottoms" | "one-pieces">("tops")
  const [gender, setGender] = useState<"man" | "woman">("woman")
  const [country, setCountry] = useState("")
  const [age, setAge] = useState("")
  const [otherClothes, setOtherClothes] = useState("")
  const [imageContext, setImageContext] = useState("")
  const [width, setWidth] = useState("1000")
  const [height, setHeight] = useState("1000")
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("common.error"),
          description: t("aiModelGenerator.fileSizeLimit"),
          variant: "destructive",
        })
        return
      }
      setClothingPhoto(file)
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
        throw new Error(t("aiModelGenerator.error.authRequired"))
      }

      if (!clothingPhoto) {
        throw new Error(t("aiModelGenerator.error.uploadClothingPhoto"))
      }

      if (userCredits < 1) {
        throw new Error(t("aiModelGenerator.error.insufficientCredits"))
      }

      const formData = new FormData()
      formData.append("clothing_photo", clothingPhoto)
      formData.append("clothing_type", clothingType)
      formData.append("gender", gender)
      formData.append("country", country)
      formData.append("age", age)
      formData.append("other_clothes", otherClothes)
      formData.append("image_context", imageContext)
      formData.append("width", width)
      formData.append("height", height)

      const response = await fetch("/api/ai-model-generator", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t("aiModelGenerator.error.failedToInitiate"))
      }

      const data = await response.json()
      setGenerationId(data.generationId)
      setPolling(true)

      await supabase.rpc("deduct_credit", {
        user_id: user.id,
        amount: 1,
      })
      await fetchUserCredits()
    } catch (error) {
      console.error("Error initiating AI model generation:", error)
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

  const pollForResults = useCallback(async () => {
    if (!generationId || !polling) return

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error(t("aiModelGenerator.error.authRequired"))
      }

      const response = await fetch(`/api/ai-model-generator/status?id=${generationId}`, {
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
          title: t("common.success"),
          description: t("aiModelGenerator.success.generated"),
        })
        router.replace(`/dashboard/ai-model-generator?id=${generationId}`)
        await fetchUserCredits()
      } else if (data.status === "failed") {
        setError(data.error || t("aiModelGenerator.error.generationFailed"))
        setPolling(false)
        toast({
          title: t("common.error"),
          description: data.error || t("aiModelGenerator.error.generationFailed"),
          variant: "destructive",
        })
      } else if (data.status === "processing") {
        if (pollCount > 30) {
          setError(t("aiModelGenerator.error.generationTimeout"))
          setPolling(false)
          toast({
            title: t("common.error"),
            description: t("aiModelGenerator.error.generationTimeout"),
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
        setError(t("aiModelGenerator.error.generationTimeout"))
        setPolling(false)
        toast({
          title: t("common.error"),
          description: t("aiModelGenerator.error.generationTimeout"),
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
      a.download = "ai-model-generated.png"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: t("common.error"),
        description: t("aiModelGenerator.error.downloadFailed"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`space-y-6 ${isRTL ? "rtl" : "ltr"}`}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("aiModelGenerator.title")}</h1>
        <p className="text-muted-foreground">{t("aiModelGenerator.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t("aiModelGenerator.uploadImageAndParameters")}</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clothing-photo">{t("aiModelGenerator.clothingPhoto")}</Label>
              <Input id="clothing-photo" type="file" onChange={handleImageUpload} accept="image/*" />
            </div>
            <div>
              <Label htmlFor="clothing-type">{t("aiModelGenerator.clothingType")}</Label>
              <Select value={clothingType} onValueChange={setClothingType}>
                <SelectTrigger id="clothing-type">
                  <SelectValue placeholder={t("aiModelGenerator.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tops">{t("aiModelGenerator.tops")}</SelectItem>
                  <SelectItem value="bottoms">{t("aiModelGenerator.bottoms")}</SelectItem>
                  <SelectItem value="one-pieces">{t("aiModelGenerator.onePieces")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gender">{t("fashion.gender")}</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder={t("fashionDesign.selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="man">{t("fashionDesign.man")}</SelectItem>
                  <SelectItem value="woman">{t("fashionDesign.woman")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="country">{t("fashion.country")}</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t("aiModelGenerator.countryPlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="age">{t("fashion.age")}</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t("aiModelGenerator.agePlaceholder")}
                min="20"
                max="70"
              />
            </div>
            <div>
              <Label htmlFor="other-clothes">{t("aiModelGenerator.otherClothes")}</Label>
              <Input
                id="other-clothes"
                value={otherClothes}
                onChange={(e) => setOtherClothes(e.target.value)}
                placeholder={t("aiModelGenerator.otherClothesPlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="image-context">{t("aiModelGenerator.imageContext")}</Label>
              <Input
                id="image-context"
                value={imageContext}
                onChange={(e) => setImageContext(e.target.value)}
                placeholder={t("aiModelGenerator.imageContextPlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="width">{t("fashionDesign.width")}</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder={t("aiModelGenerator.imageWidth")}
              />
            </div>
            <div>
              <Label htmlFor="height">{t("fashionDesign.height")}</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={t("aiModelGenerator.imageHeight")}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t("aiModelGenerator.generatedAIModel")}</h2>
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
                <p className="text-sm text-gray-500">{t("aiModelGenerator.generatingWait")}</p>
              </div>
            )}
            {generatedImage && (
              <div className="relative">
                <Image
                  src={generatedImage || "/placeholder.svg"}
                  alt={t("aiModelGenerator.generatedAIModel")}
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
                <Button onClick={handleDownload} className="absolute top-2 right-2" size="icon" variant="secondary">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!generatedImage && !isLoading && !polling && <p>{t("aiModelGenerator.imageWillAppear")}</p>}
            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={isLoading || !clothingPhoto || userCredits < 1}
            >
              {isLoading ? t("ai.generating") : t("aiModelGenerator.generateAIModel")}
            </Button>
            {user && (
              <p className="mt-2 text-sm text-gray-500">
                {t("virtualTryOn.credits")}: {userCredits}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
