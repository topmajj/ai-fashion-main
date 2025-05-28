"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/use-user"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useLanguage } from "@/components/simple-language-switcher"

export default function FashionVideoClient() {
  const [image, setImage] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const { user, session } = useUser()
  const [userCredits, setUserCredits] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
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
    fetchUserCredits()
    const interval = setInterval(fetchUserCredits, 30000)

    return () => clearInterval(interval)
  }, [fetchUserCredits])

  useEffect(() => {
    const id = searchParams?.get("id")
    if (id) {
      setGenerationId(id)
    }
  }, [searchParams])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("fashionVideo.fileTooLarge"),
          description: t("fashionVideo.fileSizeLimit"),
          variant: "destructive",
        })
        return
      }
      setImage(file)
      setUploadedImageUrl(URL.createObjectURL(file))
    }
  }

  const checkVideoStatus = useCallback(async (id: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("No active session")
      }

      const response = await fetch(`/api/fashion-video/status?id=${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error checking video status:", error)
      throw error
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setVideoUrl(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("No active session")
      }

      const formData = new FormData()
      if (image) formData.append("image", image)
      if (prompt) formData.append("prompt", prompt)

      const response = await fetch("/api/fashion-video", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGenerationId(data.generationId)

      // Wait for 5 minutes before starting to poll
      await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000))

      // Start polling every 30 seconds
      const pollInterval = setInterval(async () => {
        try {
          const statusData = await checkVideoStatus(data.generationId)
          if (statusData.status === "completed") {
            setVideoUrl(statusData.videoUrl)
            setIsLoading(false)
            clearInterval(pollInterval)
          } else if (statusData.status === "failed") {
            setError(t("fashionVideo.error.videoGeneration"))
            setIsLoading(false)
            clearInterval(pollInterval)
          }
        } catch (error) {
          console.error("Error polling for results:", error)
        }
      }, 30000)

      // Stop polling after 30 minutes if video is not ready
      setTimeout(
        () => {
          clearInterval(pollInterval)
          if (!videoUrl) {
            setError(t("fashionVideo.error.videoTimeout"))
            setIsLoading(false)
          }
        },
        30 * 60 * 1000,
      )
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(t("videoGenerationError"))
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!videoUrl) return

    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "fashion-video.mp4"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading video:", error)
      toast({
        title: t("common.error"),
        description: t("fashionVideo.error.downloadVideo"),
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8" dir={isRTL ? "rtl" : "ltr"}>
        <h1 className="text-3xl font-bold">{t("fashionVideo.title")}</h1>
        <p className="text-gray-600">{t("fashionVideo.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} dir={isRTL ? "rtl" : "ltr"}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t("fashionVideo.uploadDesign")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">{t("fashionVideo.uploadInstructions")}</span>
                    </p>
                    <p className="text-xs text-gray-500">{t("fashionVideo.fileTypeInfo")}</p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </Label>
              </div>
              {uploadedImageUrl && (
                <div className="mt-4 relative aspect-video w-full">
                  <Image
                    src={uploadedImageUrl || "/placeholder.svg"}
                    alt={t("fashionVideo.uploadedDesign")}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t("fashionVideo.videoSettings")}</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt" className="block mb-2">
                  {t("fashionVideo.promptLabel")}
                </Label>
                <Textarea
                  id="prompt"
                  placeholder={t("fashionVideo.promptPlaceholder")}
                  className="w-full"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">{t("fashionVideo.generatedVideo")}</h2>
            <div className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}
              {isLoading && (
                <div className="mt-4 text-center">
                  <p>{t("fashionVideo.generatingWait")}</p>
                  <LoadingSpinner />
                </div>
              )}
              {videoUrl && (
                <div className="relative">
                  <video controls className="w-full rounded-lg">
                    <source src={videoUrl} type="video/mp4" />
                    {t("generatedVideo.videoNotSupported")}
                  </video>
                  <Button onClick={handleDownload} className="absolute top-2 right-2" size="icon" variant="secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {!videoUrl && !isLoading && <p>{t("fashionVideo.videoWillAppear")}</p>}
              <Button type="submit" className="w-full" disabled={isLoading || !image || !prompt}>
                {isLoading ? t("fashionVideo.generating") : t("fashionVideo.generateButton")}
              </Button>
              {user && (
                <p className="mt-2 text-sm text-gray-500">
                  {t("common.credits")}: {userCredits}
                </p>
              )}
            </div>
          </Card>
        </div>
      </form>
    </Layout>
  )
}
