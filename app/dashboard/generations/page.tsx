"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, Download, Video } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/lib/use-user"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/simple-language-switcher"

interface Generation {
  id: string
  user_id: string
  image_url: string
  tool_name: string
  summary: string
  status: "pending" | "processing" | "completed" | "failed"
  created_at: string
  type: "image" | "video"
}

export default function GenerationsPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    if (user) {
      fetchGenerations()
    }
  }, [user])

  const fetchGenerations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setGenerations(data)
    } catch (error) {
      console.error("Error fetching generations:", error)
      toast({
        title: t("errors.somethingWentWrong"),
        description: t("generations.error.fetchFailed"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = (url: string) => {
    window.open(url, "_blank")
  }

  const handleDownload = async (url: string, toolName: string, type: "image" | "video") => {
    try {
      console.log(`Initiating download for ${type} from URL: ${url}`)

      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const blob = await response.blob()
      console.log(`Blob created, size: ${blob.size} bytes`)

      const extension = type === "video" ? "mp4" : "png"
      const fileName = `${toolName.replace(/\s+/g, "-")}_${new Date().toISOString()}.${extension}`

      const blobWithType = new Blob([blob], { type: type === "video" ? "video/mp4" : "image/png" })
      console.log(`New Blob created with type`)

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // For IE
        window.navigator.msSaveOrOpenBlob(blobWithType, fileName)
      } else {
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blobWithType)
        link.download = fileName
        link.style.display = "none"
        document.body.appendChild(link)
        console.log(`Link created and appended to body`)
        link.click()
        console.log(`Link clicked`)
        document.body.removeChild(link)
        console.log(`Link removed from body`)
      }

      console.log(`Download initiated for file: ${fileName}`)
      toast({
        title: t("common.success"),
        description: t("generations.success.downloadStarted", { fileName }),
        variant: "default",
      })
    } catch (error) {
      console.error("Error in handleDownload:", error)
      toast({
        title: t("errors.somethingWentWrong"),
        description: t("generations.error.downloadFailed", { error: error.message }),
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6" dir={isRTL ? "rtl" : "ltr"}>
        {t("generations.title")}
      </h1>
      {generations.length === 0 ? (
        <div className="text-center py-12" dir={isRTL ? "rtl" : "ltr"}>
          <p className="text-xl text-gray-600">{t("generations.noGenerations")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir={isRTL ? "rtl" : "ltr"}>
          {generations.map((generation) => (
            <Card key={generation.id} className="p-4">
              <div className="aspect-square relative mb-4">
                {generation.status === "completed" ? (
                  generation.type === "video" ? (
                    <video src={generation.image_url} controls className="w-full h-full object-cover rounded-md">
                      {t("generations.videoNotSupported")}
                    </video>
                  ) : (
                    <Image
                      src={generation.image_url || "/placeholder.svg"}
                      alt={generation.summary}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                    {generation.status === "pending" || generation.status === "processing" ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <span className="text-red-500">{t("generations.failed")}</span>
                    )}
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-2">{generation.tool_name}</h3>
              <p className="text-sm text-gray-600 mb-2">{generation.summary}</p>
              <p className="text-xs text-gray-500 mb-4">{new Date(generation.created_at).toLocaleString()}</p>
              <div className="flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePreview(generation.image_url)}
                  disabled={generation.status !== "completed"}
                >
                  {generation.type === "video" ? <Video className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {t("generations.preview")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(generation.image_url, generation.tool_name, generation.type)}
                  disabled={generation.status !== "completed"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("generations.download")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}
