"use client"

import { useState, useEffect, useCallback } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { useLanguage } from "@/components/simple-language-switcher"

type ProductType = "shoes" | "bag" | "necklace" | "bracelet" | "earrings" | "watch" | "ring" | "sunglasses" | "bag"

interface ProductFormData {
  description: string
  gender: string
  negative: string
}

export default function EcommerceGenerator() {
  const [productType, setProductType] = useState<ProductType>("shoes")
  const [formDatas, setFormDatas] = useState<Record<ProductType, ProductFormData>>({
    shoes: { description: "", gender: "", negative: "" },
    bag: { description: "", gender: "", negative: "" },
    necklace: { description: "", gender: "", negative: "" },
    bracelet: { description: "", gender: "", negative: "" },
    earrings: { description: "", gender: "", negative: "" },
    watch: { description: "", gender: "", negative: "" },
    ring: { description: "", gender: "", negative: "" },
    sunglasses: { description: "", gender: "", negative: "" },
  })
  const [generatedImages, setGeneratedImages] = useState<Record<ProductType, string | null>>({
    shoes: null,
    bag: null,
    necklace: null,
    bracelet: null,
    earrings: null,
    watch: null,
    ring: null,
    sunglasses: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, session, refreshSession } = useAuth()
  const [userCredits, setUserCredits] = useState(0)
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
  }, [fetchUserCredits])

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormDatas((prev) => ({ ...prev, [productType]: { ...prev[productType], [field]: value } }))
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    setGeneratedImages((prev) => ({ ...prev, [productType]: null }))

    try {
      if (!session) {
        await refreshSession()
        if (!session) {
          throw new Error("Failed to refresh session. Please log in again.")
        }
      }

      if (!formDatas[productType].description || !formDatas[productType].gender) {
        throw new Error("Please provide a description and select a gender.")
      }

      if (userCredits < 1) {
        throw new Error("Insufficient credit. You need at least 1 credit to generate a product image.")
      }

      const apiEndpoint = `/api/${productType}`
      const body = {
        [productType === "shoes"
          ? "shoes"
          : productType === "bag"
            ? "bag"
            : productType === "necklace"
              ? "necklace"
              : productType === "bracelet"
                ? "bracelet"
                : productType === "earrings"
                  ? "earrings"
                  : productType === "watch"
                    ? "watch"
                    : productType === "ring"
                      ? "ring"
                      : "sunglasses"]: formDatas[productType].description,
        gender: formDatas[productType].gender,
        negative: formDatas[productType].negative,
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to generate ${productType} image`)
      }

      const responseData = await response.json()

      if (!responseData.imageUrl) {
        throw new Error("No image URL in the response")
      }

      setGeneratedImages((prev) => ({ ...prev, [productType]: responseData.imageUrl }))
      await fetchUserCredits()

      toast({
        title: "Success",
        description: `${productType} image generated successfully!`,
      })
    } catch (error) {
      console.error("Error in handleGenerate:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : `Failed to generate ${productType} image. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    const currentImage = generatedImages[productType]
    if (!currentImage) return

    try {
      const response = await fetch(currentImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${productType}-${Date.now()}.png`
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

  const currentFormData = formDatas[productType]

  return (
    <Layout>
      <div className={isRTL ? "rtl" : "ltr"}>
        <div className="mb-4 text-right">
          <span className="font-bold">
            {t("common.credits")}: {userCredits}
          </span>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("ecommerceGenerator.title")}</h1>
          <p className="text-gray-600">{t("ecommerceGenerator.subtitle")}</p>
        </div>

        <Tabs value={productType} onValueChange={(value) => setProductType(value as ProductType)}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-8 mb-8">
            <TabsTrigger value="shoes">{t("products.shoes")}</TabsTrigger>
            <TabsTrigger value="bag">{t("products.bag")}</TabsTrigger>
            <TabsTrigger value="necklace">{t("products.necklace")}</TabsTrigger>
            <TabsTrigger value="bracelet">{t("products.bracelet")}</TabsTrigger>
            <TabsTrigger value="earrings">{t("products.earrings")}</TabsTrigger>
            <TabsTrigger value="watch">{t("products.watch")}</TabsTrigger>
            <TabsTrigger value="ring">{t("products.ring")}</TabsTrigger>
            <TabsTrigger value="sunglasses">{t("products.sunglasses")}</TabsTrigger>
          </TabsList>

          <TabsContent value="shoes">
            <ProductForm productType="shoes" formData={formDatas.shoes} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="bag">
            <ProductForm productType="bag" formData={formDatas.bag} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="necklace">
            <ProductForm productType="necklace" formData={formDatas.necklace} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="bracelet">
            <ProductForm productType="bracelet" formData={formDatas.bracelet} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="earrings">
            <ProductForm productType="earrings" formData={formDatas.earrings} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="watch">
            <ProductForm productType="watch" formData={formDatas.watch} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="ring">
            <ProductForm productType="ring" formData={formDatas.ring} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="sunglasses">
            <ProductForm productType="sunglasses" formData={formDatas.sunglasses} onInputChange={handleInputChange} />
          </TabsContent>
        </Tabs>

        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">{t("ecommerceGenerator.generatedImage")}</h2>
          <div className="space-y-4">
            {error && <div className="text-red-500 mt-4">Error: {error}</div>}
            {generatedImages[productType] ? (
              <div className="relative">
                <div className="aspect-square relative">
                  <Image
                    src={generatedImages[productType] || "/placeholder.svg"}
                    alt={`Generated ${productType}`}
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
                <p className="text-gray-500">{t("ecommerceGenerator.imageWillAppear")}</p>
              </div>
            )}
            <Button onClick={handleGenerate} className="w-full" disabled={isLoading || userCredits < 1}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("ecommerceGenerator.generatingProduct", { product: t(`products.${productType}`) })}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("ecommerceGenerator.generateProduct", { product: t(`products.${productType}`) })}
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

interface ProductFormProps {
  productType: ProductType
  formData: ProductFormData
  onInputChange: (field: keyof ProductFormData, value: string) => void
}

function ProductForm({ productType, formData, onInputChange }: ProductFormProps) {
  const { t } = useLanguage()

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {t("ecommerceGenerator.productDetails", {
          product: t(`products.${productType}`),
        })}
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">{t("common.description")}</Label>
          <Input
            id="description"
            placeholder={t("ecommerceGenerator.descriptionPlaceholder", { product: t(`products.${productType}`) })}
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="gender">{t("common.gender")}</Label>
          <Select value={formData.gender} onValueChange={(value) => onInputChange("gender", value)}>
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
          <Label htmlFor="negative">
            {t("common.negativePrompt")} ({t("common.optional")})
          </Label>
          <Input
            id="negative"
            placeholder={t("common.negativePlaceholder")}
            value={formData.negative}
            onChange={(e) => onInputChange("negative", e.target.value)}
          />
        </div>
      </div>
    </Card>
  )
}
