"use client"

import { useState, useEffect, useCallback } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Loader2, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useLanguage } from "@/components/simple-language-switcher"

// No imports from @runwayml/hosted-models

export default function Runway() {
  return (
    <ProtectedRoute>
      <RunwayContent />
    </ProtectedRoute>
  )
}

function RunwayContent() {
  const { t, isRTL } = useLanguage()
  const { user, session, refreshSession } = useAuth()
  const router = useRouter()
  const [userCredits, setUserCredits] = useState(0)
  const [outfit, setOutfit] = useState("")
  const [gender, setGender] = useState("")
  const [country, setCountry] = useState("")
  const [negative, setNegative] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      if (!session) {
        console.log("No session found, attempting to refresh...")
        await refreshSession()
        if (!session) {
          throw new Error(t("runway.error.sessionRefresh"))
        }
      }

      if (!outfit || !gender || !country) {
        throw new Error(t("runway.error.requiredFields"))
      }

      if (userCredits < 1) {
        throw new Error(t("runway.error.insufficientCredits"))
      }

      const formData = new FormData()
      formData.append("outfit", outfit)
      formData.append("gender", gender)
      formData.append("country", country)
      if (negative) formData.append("negative", negative)

      console.log("Sending request to runway API")
      const response = await fetch("/api/runway", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      console.log("Received response from runway API:", response.status)

      const responseData = await response.json()
      console.log("Response data:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || t("runway.error.generationFailed"))
      }

      if (!responseData.imageUrl) {
        throw new Error(t("runway.error.noImageUrl"))
      }

      console.log("Setting generated image URL:", responseData.imageUrl)
      setGeneratedImage(responseData.imageUrl)
      await fetchUserCredits()

      toast({
        title: t("common.success"),
        description: t("runway.success.generated"),
      })
    } catch (error) {
      console.error("Error in handleGenerate:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      setError(error instanceof Error ? error.message : t("runway.error.unexpected"))
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("runway.error.generationFailed"),
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
      a.download = `runway-model-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: t("common.error"),
        description: t("runway.error.downloadFailed"),
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-4 text-right" dir={isRTL ? "rtl" : "ltr"}>
        <span className="font-bold">
          {t("common.credits")}: {userCredits}
        </span>
      </div>
      <div className="mb-8" dir={isRTL ? "rtl" : "ltr"}>
        <h1 className="text-3xl font-bold">{t("runway.title")}</h1>
        <p className="text-gray-600">{t("runway.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir={isRTL ? "rtl" : "ltr"}>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t("runway.modelInput")}</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="outfit">{t("runway.outfitDescription")}</Label>
              <Textarea
                id="outfit"
                placeholder={t("runway.outfitPlaceholder")}
                value={outfit}
                onChange={(e) => setOutfit(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gender">{t("common.gender")}</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder={t("common.selectGender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="man">{t("common.man")}</SelectItem>
                  <SelectItem value="woman">{t("common.woman")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="country">{t("runway.country")}</Label>
              <Input
                id="country"
                placeholder={t("runway.countryPlaceholder")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="negative">{t("common.negativePrompt")}</Label>
              <Textarea
                id="negative"
                placeholder={t("common.negativePlaceholder")}
                value={negative}
                onChange={(e) => setNegative(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t("runway.generatedModel")}</h2>
          <div className="space-y-4">
            {error && (
              <div className="text-red-500 mt-4">
                {t("common.error")}: {error}
              </div>
            )}
            {generatedImage ? (
              <div className="relative">
                <div className="aspect-square relative">
                  <Image
                    src={generatedImage || "/placeholder.svg"}
                    alt={t("runway.generatedModelAlt")}
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
                <p className="text-gray-500">{t("runway.imageWillAppear")}</p>
              </div>
            )}
            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={isLoading || !outfit || !gender || !country || userCredits < 1}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("common.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("runway.generateButton")}
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
