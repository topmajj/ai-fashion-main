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

export default function FashionDesign() {
  return (
    <ProtectedRoute>
      <FashionDesignContent />
    </ProtectedRoute>
  )
}

function FashionDesignContent() {
  const { t, isRTL } = useLanguage()
  const { user, session, refreshSession } = useAuth()
  const router = useRouter()
  const [userCredits, setUserCredits] = useState(0)
  const [outfit, setOutfit] = useState("")
  const [gender, setGender] = useState("")
  const [country, setCountry] = useState("")
  const [age, setAge] = useState("")
  const [width, setWidth] = useState("900")
  const [height, setHeight] = useState("1300")
  const [bodyType, setBodyType] = useState("")
  const [background, setBackground] = useState("studio backdrop")
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
          throw new Error(t("virtualTryOn.error.authRequired"))
        }
      }

      if (!outfit || !gender || !country || !age || !width || !height) {
        throw new Error(t("fashionDesign.error.fillRequired"))
      }

      if (userCredits < 1) {
        throw new Error(t("fashionDesign.error.insufficientCredit"))
      }

      const formData = new FormData()
      formData.append("outfit", outfit)
      formData.append("gender", gender)
      formData.append("country", country)
      formData.append("age", age)
      formData.append("width", width)
      formData.append("height", height)
      formData.append("background", background)
      if (bodyType) formData.append("body_type", bodyType)
      if (negative) formData.append("negative", negative)

      console.log("Sending request to fashion-design API")
      const response = await fetch("/api/fashion-design", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      console.log("Received response from fashion-design API:", response.status)

      const responseData = await response.json()
      console.log("Response data:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || t("fashionDesign.error.failedGenerate"))
      }

      if (!responseData.imageUrl) {
        throw new Error(t("fashionDesign.error.noImageUrl"))
      }

      if (responseData.imageUrl.startsWith("body_type value must be")) {
        throw new Error(t("fashionDesign.error.invalidBodyType"))
      }

      console.log("Setting generated image URL:", responseData.imageUrl)
      setGeneratedImage(responseData.imageUrl)
      await fetchUserCredits()

      toast({
        title: t("common.success"),
        description: t("fashionDesign.success.designGenerated"),
      })
    } catch (error) {
      console.error("Error in handleGenerate:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      setError(error instanceof Error ? error.message : t("common.errors.unknownError"))
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("fashionDesign.error.failedGenerate"),
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
      a.download = `fashion-design-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: t("common.error"),
        description: t("fashionDesign.error.downloadError"),
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-4 text-right">
        <span className="font-bold">
          {t("common.credits")}: {userCredits}
        </span>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("fashionDesign.title")}</h1>
        <p className="text-gray-600">{t("fashionDesign.subtitle")}</p>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isRTL ? "direction-rtl" : ""}`}>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t("fashionDesign.designInput")}</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="outfit">{t("fashionDesign.outfitDescription")}</Label>
              <Textarea
                id="outfit"
                placeholder={t("fashionDesign.outfitPlaceholder")}
                value={outfit}
                onChange={(e) => setOutfit(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gender">{t("fashionDesign.gender")}</Label>
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
              <Label htmlFor="country">{t("fashionDesign.country")}</Label>
              <Input
                id="country"
                placeholder={t("fashionDesign.countryPlaceholder")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="age">{t("fashionDesign.age")}</Label>
              <Input
                id="age"
                type="number"
                placeholder={t("fashionDesign.agePlaceholder")}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="width">{t("fashionDesign.width")}</Label>
              <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="height">{t("fashionDesign.height")}</Label>
              <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bodyType">{t("fashionDesign.bodyType")}</Label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger id="bodyType">
                  <SelectValue placeholder={t("fashionDesign.selectBodyType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("fashionDesign.bodyTypeDefault")}</SelectItem>
                  <SelectItem value="small">{t("fashionDesign.bodyTypeSmall")}</SelectItem>
                  <SelectItem value="plus">{t("fashionDesign.bodyTypePlus")}</SelectItem>
                  <SelectItem value="pregnant">{t("fashionDesign.bodyTypePregnant")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="background">{t("fashionDesign.background")}</Label>
              <Input
                id="background"
                placeholder={t("fashionDesign.backgroundPlaceholder")}
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="negative">{t("fashionDesign.negative")}</Label>
              <Textarea
                id="negative"
                placeholder={t("fashionDesign.negativePlaceholder")}
                value={negative}
                onChange={(e) => setNegative(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t("fashionDesign.generatedDesign")}</h2>
          <div className="space-y-4">
            {error && <div className="text-red-500 mt-4">{error}</div>}
            {generatedImage ? (
              <div className="relative">
                <div className="aspect-square relative">
                  <Image
                    src={generatedImage || "/placeholder.svg"}
                    alt={t("fashionDesign.generatedDesign")}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
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
            ) : (
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">{t("fashionDesign.designWillAppear")}</p>
              </div>
            )}
            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={isLoading || !outfit || !gender || !country || !age || !width || !height || userCredits < 1}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("fashionDesign.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("fashionDesign.generateDesign")}
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
