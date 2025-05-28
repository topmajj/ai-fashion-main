"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2, Download, Upload, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useLanguage } from "@/components/simple-language-switcher"

type ModelType = "change-model" | "change-color" | "change-background"

interface ModelFormData {
  image: File | null
  image2?: File | null
  mask: File | null
  mask2?: File | null
  gender: string
  country: string
  age: string
  model?: string
  clothing_text?: string
  Hex_color?: string
  replace?: string
  negative?: string
}

export default function AIModelEditor() {
  return (
    <ProtectedRoute>
      <AIModelEditorContent />
    </ProtectedRoute>
  )
}

function AIModelEditorContent() {
  const { t, isRTL } = useLanguage()
  const [modelType, setModelType] = useState<ModelType>("change-model")
  const [onePieceFormData, setOnePieceFormData] = useState<ModelFormData>({
    image: null,
    mask: null,
    gender: "",
    country: "",
    age: "",
  })

  const [twoPieceFormData, setTwoPieceFormData] = useState<ModelFormData>({
    image: null,
    image2: null,
    mask: null,
    mask2: null,
    gender: "",
    country: "",
    age: "",
  })

  const [changeModelFormData, setChangeModelFormData] = useState<ModelFormData>({
    image: null,
    model: "",
  })

  const [changeColorFormData, setChangeColorFormData] = useState<ModelFormData>({
    image: null,
    clothing_text: "",
    Hex_color: "",
  })

  const [changeBackgroundFormData, setChangeBackgroundFormData] = useState<ModelFormData>({
    image: null,
    replace: "",
    negative: "",
  })

  const [generatedImages, setGeneratedImages] = useState<Record<ModelType, string | null>>({
    "change-model": null,
    "change-color": null,
    "change-background": null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, session, refreshSession } = useAuth()
  const router = useRouter()
  const [userCredits, setUserCredits] = useState(0)

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

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    formType: ModelType,
    field: keyof ModelFormData,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("common.error"),
          description: t("aiModelEditor.fileSizeLimit"),
          variant: "destructive",
        })
        return
      }

      switch (formType) {
        case "change-model":
          setChangeModelFormData((prev) => ({ ...prev, [field]: file }))
          break
        case "change-color":
          setChangeColorFormData((prev) => ({ ...prev, [field]: file }))
          break
        case "change-background":
          setChangeBackgroundFormData((prev) => ({ ...prev, [field]: file }))
          break
      }
    }
  }

  const handleRemoveFile = (formType: ModelType, field: keyof ModelFormData) => {
    switch (formType) {
      case "change-model":
        setChangeModelFormData((prev) => ({ ...prev, [field]: null }))
        break
      case "change-color":
        setChangeColorFormData((prev) => ({ ...prev, [field]: null }))
        break
      case "change-background":
        setChangeBackgroundFormData((prev) => ({ ...prev, [field]: null }))
        break
    }
  }

  const handleInputChange = (formType: ModelType, field: keyof ModelFormData, value: string) => {
    switch (formType) {
      case "change-model":
        setChangeModelFormData((prev) => ({ ...prev, [field]: value }))
        break
      case "change-color":
        setChangeColorFormData((prev) => ({ ...prev, [field]: value }))
        break
      case "change-background":
        setChangeBackgroundFormData((prev) => ({ ...prev, [field]: value }))
        break
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    setGeneratedImages((prev) => ({ ...prev, [modelType]: null }))

    try {
      if (!session) {
        console.log("No session found, attempting to refresh...")
        await refreshSession()
        if (!session) {
          throw new Error(t("aiModelEditor.error.sessionRefreshFailed"))
        }
      }

      console.log("Session state:", session)

      let currentFormData
      switch (modelType) {
        case "change-model":
          {
            const currentFormData = changeModelFormData
            if (!currentFormData.image || !currentFormData.model) {
              throw new Error(t("aiModelEditor.error.provideImageAndModel"))
            }

            if (userCredits < 1) {
              throw new Error(t("aiModelEditor.error.insufficientCreditsChangeModel"))
            }

            const changeModelData = new FormData()
            changeModelData.append("file", currentFormData.image)

            const uploadResponse = await fetch("/api/upload", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
              body: changeModelData,
            })

            if (!uploadResponse.ok) {
              throw new Error(t("aiModelEditor.error.failedToUploadImage"))
            }

            const uploadData = await uploadResponse.json()
            const uploadedImageUrl = uploadData.imageUrl

            console.log("Sending request to change-model API")
            const changeModelResponse = await fetch("/api/change-model", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                image: uploadedImageUrl,
                model: currentFormData.model,
              }),
            })

            console.log("Change model API response status:", changeModelResponse.status)

            if (!changeModelResponse.ok) {
              const errorData = await changeModelResponse.json()
              console.error("Change model API error:", errorData)
              throw new Error(errorData.error || t("aiModelEditor.error.failedToChangeModel"))
            }

            const changeModelResponseData = await changeModelResponse.json()

            if (!changeModelResponseData.imageUrl) {
              throw new Error(t("aiModelEditor.error.noImageUrlInResponse"))
            }

            setGeneratedImages((prev) => ({ ...prev, [modelType]: changeModelResponseData.imageUrl }))
            await fetchUserCredits()

            toast({
              title: t("common.success"),
              description: t("aiModelEditor.success.modelChanged"),
            })
          }
          break
        case "change-color":
          currentFormData = changeColorFormData
          if (!currentFormData.image || !currentFormData.clothing_text || !currentFormData.Hex_color) {
            throw new Error(t("aiModelEditor.error.fillAllRequiredFields"))
          }

          if (userCredits < 1) {
            throw new Error(t("aiModelEditor.error.insufficientCreditsChangeColor"))
          }

          const uploadedUrls: Record<string, string> = {}

          // Upload image
          if (currentFormData.image instanceof File) {
            const imageFormData = new FormData()
            imageFormData.append("file", currentFormData.image)

            const uploadResponse = await fetch("/api/upload", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
              body: imageFormData,
            })

            if (!uploadResponse.ok) {
              throw new Error(t("aiModelEditor.error.failedToUploadImage"))
            }

            const uploadData = await uploadResponse.json()
            uploadedUrls.image = uploadData.imageUrl
          }

          console.log("Sending request to color_change API")
          const colorChangeResponse = await fetch("/api/change_color", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              image: uploadedUrls.image,
              clothing_text: currentFormData.clothing_text,
              Hex_color: currentFormData.Hex_color,
            }),
          })

          console.log("color_change API response status:", colorChangeResponse.status)

          if (!colorChangeResponse.ok) {
            const errorData = await colorChangeResponse.json()
            console.error("color_change API error:", errorData)
            throw new Error(errorData.error || t("aiModelEditor.error.failedToChangeColor"))
          }

          const colorChangeResponseData = await colorChangeResponse.json()

          if (!colorChangeResponseData.imageUrl) {
            throw new Error(t("aiModelEditor.error.noImageUrlInResponse"))
          }

          setGeneratedImages((prev) => ({ ...prev, [modelType]: colorChangeResponseData.imageUrl }))
          await fetchUserCredits()

          toast({
            title: t("common.success"),
            description: t("aiModelEditor.success.colorChanged"),
          })
          break
        case "change-background":
          currentFormData = changeBackgroundFormData
          if (!currentFormData.image || !currentFormData.replace) {
            throw new Error(t("aiModelEditor.error.provideImageAndBackground"))
          }

          if (userCredits < 1) {
            throw new Error(t("aiModelEditor.error.insufficientCreditsChangeBackground"))
          }

          const backgroundChangeData = new FormData()
          backgroundChangeData.append("file", currentFormData.image)

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: backgroundChangeData,
          })

          if (!uploadResponse.ok) {
            throw new Error(t("aiModelEditor.error.failedToUploadImage"))
          }

          const uploadData = await uploadResponse.json()
          const uploadedImageUrl = uploadData.imageUrl

          console.log("Sending request to change-background API")
          const backgroundChangeResponse = await fetch("/api/change-background", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              image: uploadedImageUrl,
              replace: currentFormData.replace,
              negative: currentFormData.negative || "",
            }),
          })

          console.log("Change background API response status:", backgroundChangeResponse.status)

          if (!backgroundChangeResponse.ok) {
            const errorData = await backgroundChangeResponse.json()
            console.error("Change background API error:", errorData)
            throw new Error(errorData.error || t("aiModelEditor.error.failedToChangeBackground"))
          }

          const backgroundChangeResponseData = await backgroundChangeResponse.json()

          if (!backgroundChangeResponseData.imageUrl) {
            throw new Error(t("aiModelEditor.error.noImageUrlInResponse"))
          }

          setGeneratedImages((prev) => ({ ...prev, [modelType]: backgroundChangeResponseData.imageUrl }))
          await fetchUserCredits()

          toast({
            title: t("common.success"),
            description: t("aiModelEditor.success.backgroundChanged"),
          })
          break
      }
    } catch (error) {
      console.error("Error in handleGenerate:", error)
      setError(error instanceof Error ? error.message : t("errors.unknownError"))
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("aiModelEditor.error.failedToGenerate"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    const currentImage = generatedImages[modelType]
    if (!currentImage) return
    try {
      const response = await fetch(currentImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-model-${modelType}-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: t("common.error"),
        description: t("aiModelEditor.error.downloadFailed"),
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className={`mb-4 text-right ${isRTL ? "rtl" : "ltr"}`}>
        <span className="font-bold">
          {t("virtualTryOn.credits")}: {userCredits}
        </span>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("aiModelEditor.title")}</h1>
        <p className="text-gray-600">{t("aiModelEditor.subtitle")}</p>
      </div>

      <Tabs value={modelType} onValueChange={(value) => setModelType(value as ModelType)}>
        <TabsList className={`grid w-full grid-cols-3 mb-8 ${isRTL ? "rtl" : "ltr"}`}>
          <TabsTrigger value="change-model">{t("aiModelEditor.changeModel")}</TabsTrigger>
          <TabsTrigger value="change-color">{t("aiModelEditor.changeColor")}</TabsTrigger>
          <TabsTrigger value="change-background">{t("aiModelEditor.changeBackground")}</TabsTrigger>
        </TabsList>
        <TabsContent value="change-model">
          <ChangeModelTab formData={changeModelFormData} setFormData={setChangeModelFormData} />
        </TabsContent>
        <TabsContent value="change-color">
          <ChangeColorTab
            formData={changeColorFormData}
            setFormData={setChangeColorFormData}
            isLoading={isLoading}
            handleGenerate={handleGenerate}
          />
        </TabsContent>
        <TabsContent value="change-background">
          <ChangeBackgroundTab
            formData={changeBackgroundFormData}
            setFormData={setChangeBackgroundFormData}
            isLoading={isLoading}
            handleGenerate={handleGenerate}
          />
        </TabsContent>
      </Tabs>

      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("aiModelEditor.generatedAIModel")}</h2>
        <div className="space-y-4">
          {error && (
            <div className="text-red-500 mt-4">
              {t("common.error")}: {error}
            </div>
          )}
          {generatedImages[modelType] ? (
            <div className="relative">
              <div className="aspect-square relative">
                <Image
                  src={generatedImages[modelType] || "/placeholder.svg"}
                  alt={t("aiModelEditor.generatedAIModel")}
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
              <p className="text-gray-500">{t("aiModelEditor.imageWillAppear")}</p>
            </div>
          )}
          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={
              isLoading || userCredits < (modelType === "change-model" || modelType === "change-background" ? 1 : 1)
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("ai.generating")}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t("aiModelEditor.generateAIModel")}
              </>
            )}
          </Button>
        </div>
      </Card>
    </Layout>
  )
}

function ChangeModelTab({
  formData,
  setFormData,
}: { formData: ModelFormData; setFormData: React.Dispatch<React.SetStateAction<ModelFormData>> }) {
  const { t, isRTL } = useLanguage()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: keyof ModelFormData) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("common.error"),
          description: t("aiModelEditor.fileSizeLimit"),
          variant: "destructive",
        })
        return
      }
      setFormData((prev) => ({ ...prev, [field]: file }))
    }
  }

  const handleRemoveFile = (field: keyof ModelFormData) => {
    setFormData((prev) => ({ ...prev, [field]: null }))
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isRTL ? "rtl" : "ltr"}`}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t("fashion.original")}</h2>
        <div className="space-y-4">
          <FileUpload
            label={t("fashion.original")}
            onChange={(e) => handleFileUpload(e, "image")}
            onRemove={() => handleRemoveFile("image")}
            file={formData.image}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t("aiModelEditor.newModelDescription")}</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="model-description">{t("aiModelEditor.modelDescription")}</Label>
            <Input
              id="model-description"
              placeholder={t("aiModelEditor.modelDescriptionPlaceholder")}
              value={formData.model || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

function ChangeColorTab({ formData, setFormData, isLoading, handleGenerate }) {
  const { t, isRTL } = useLanguage()

  const handleInputChange = (field: keyof ModelFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: keyof ModelFormData) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("common.error"),
          description: t("aiModelEditor.fileSizeLimit"),
          variant: "destructive",
        })
        return
      }
      setFormData((prev) => ({ ...prev, [field]: file }))
    }
  }

  const handleRemoveFile = (field: keyof ModelFormData) => {
    setFormData((prev) => ({ ...prev, [field]: null }))
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isRTL ? "rtl" : "ltr"}`}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t("fashion.original")}</h2>
        <div className="space-y-4">
          <FileUpload
            label={t("fashion.original")}
            onChange={(e) => handleFileUpload(e, "image")}
            onRemove={() => handleRemoveFile("image")}
            file={formData.image}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t("aiModelEditor.colorChangeSettings")}</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="clothing-text">{t("aiModelEditor.clothingDescription")}</Label>
            <Input
              id="clothing-text"
              placeholder={t("aiModelEditor.clothingDescriptionPlaceholder")}
              value={formData.clothing_text}
              onChange={(e) => handleInputChange("clothing_text", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hex-color">{t("aiModelEditor.newColorHex")}</Label>
            <Input
              id="hex-color"
              placeholder={t("aiModelEditor.newColorHexPlaceholder")}
              value={formData.Hex_color}
              onChange={(e) => handleInputChange("Hex_color", e.target.value)}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !formData.image || !formData.clothing_text || !formData.Hex_color}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("aiModelEditor.changingColor")}
              </>
            ) : (
              t("aiModelEditor.changeColorButton")
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}

function ChangeBackgroundTab({ formData, setFormData, isLoading, handleGenerate }) {
  const { t, isRTL } = useLanguage()

  const handleInputChange = (field: keyof ModelFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: keyof ModelFormData) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("common.error"),
          description: t("aiModelEditor.fileSizeLimit"),
          variant: "destructive",
        })
        return
      }
      setFormData((prev) => ({ ...prev, [field]: file }))
    }
  }

  const handleRemoveFile = (field: keyof ModelFormData) => {
    setFormData((prev) => ({ ...prev, [field]: null }))
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isRTL ? "rtl" : "ltr"}`}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t("fashion.original")}</h2>
        <div className="space-y-4">
          <FileUpload
            label={t("fashion.original")}
            onChange={(e) => handleFileUpload(e, "image")}
            onRemove={() => handleRemoveFile("image")}
            file={formData.image}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t("aiModelEditor.backgroundChangeSettings")}</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="replace">{t("aiModelEditor.newBackgroundDescription")}</Label>
            <Input
              id="replace"
              placeholder={t("aiModelEditor.newBackgroundDescriptionPlaceholder")}
              value={formData.replace}
              onChange={(e) => handleInputChange("replace", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="negative">{t("common.negativePrompt")}</Label>
            <Input
              id="negative"
              placeholder={t("common.negativePlaceholder")}
              value={formData.negative}
              onChange={(e) => handleInputChange("negative", e.target.value)}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading || !formData.image || !formData.replace}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("aiModelEditor.changingBackground")}
              </>
            ) : (
              t("aiModelEditor.changeBackgroundButton")
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}

function FileUpload({ label, onChange, onRemove, file }) {
  const { t, isRTL } = useLanguage()

  return (
    <div>
      <Label htmlFor={label.replace(/\s+/g, "-").toLowerCase()}>{label}</Label>
      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <Label htmlFor={label.replace(/\s+/g, "-").toLowerCase()} className="cursor-pointer">
              <span className="text-pink-500 hover:text-pink-600">{t("common.upload")}</span> {t("common.dragAndDrop")}
            </Label>
            <p className="text-sm text-gray-500">{t("common.imageFormatInfo")}</p>
            <Input
              id={label.replace(/\s+/g, "-").toLowerCase()}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={onChange}
            />
          </div>
        </div>
      ) : (
        <div className="relative mt-2">
          <div className="aspect-square relative">
            <Image
              src={URL.createObjectURL(file) || "/placeholder.svg"}
              alt={label}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <Button onClick={onRemove} className="absolute top-2 right-2" size="icon" variant="destructive">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function ModelSettings({ gender, country, age, onInputChange }) {
  const { t } = useLanguage()

  return (
    <>
      <div>
        <Label htmlFor="gender">{t("fashion.gender")}</Label>
        <Select value={gender} onValueChange={(value) => onInputChange("gender", value)}>
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
          placeholder={t("aiModelGenerator.countryPlaceholder")}
          value={country}
          onChange={(e) => onInputChange("country", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="age">{t("fashion.age")}</Label>
        <Input
          id="age"
          type="number"
          placeholder={t("aiModelGenerator.agePlaceholder")}
          min="20"
          max="70"
          value={age}
          onChange={(e) => onInputChange("age", e.target.value)}
        />
      </div>
    </>
  )
}
