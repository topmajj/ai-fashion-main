"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/AuthContext"
import { useLanguage } from "@/components/simple-language-switcher"
import {
  ShirtIcon as Tshirt,
  Camera,
  Video,
  Wand2,
  UserCircle2,
  Sparkles,
  Palette,
  ImageIcon,
  ShoppingBag,
  PenTool,
  Target,
} from "lucide-react"

export default function DashboardContent() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t, isRTL, locale } = useLanguage()

  // Debug logging to check if translations are loaded
  console.log("Current language:", locale)
  console.log("Translation test:", t("dashboard.title"))

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>{t("common.loading")}</div>
  }

  if (!user) {
    return null
  }

  const fashionTools = [
    {
      title: t("dashboard.tools.virtualTryOn"),
      description: t("dashboard.tools.virtualTryOnDesc"),
      icon: <Tshirt className="w-6 h-6" />,
      color: "from-pink-500 to-red-500",
      isNew: true,
      path: "/dashboard/virtual-try-on",
    },
    {
      title: t("dashboard.tools.fashionDesign"),
      description: t("dashboard.tools.fashionDesignDesc"),
      icon: <Palette className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      isNew: false,
      path: "/dashboard/fashion-design",
    },
    {
      title: t("dashboard.tools.fashionPhotoshoot"),
      description: t("dashboard.tools.fashionPhotoshootDesc"),
      icon: <Camera className="w-6 h-6" />,
      color: "from-purple-500 to-blue-500",
      isNew: false,
      path: "/dashboard/photoshoot",
    },
    {
      title: t("dashboard.tools.fashionVideo"),
      description: t("dashboard.tools.fashionVideoDesc"),
      icon: <Video className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      isPro: true,
      path: "/dashboard/fashion-video",
    },
    {
      title: t("dashboard.tools.aiWriter"),
      description: t("dashboard.tools.aiWriterDesc"),
      icon: <PenTool className="w-6 h-6" />,
      color: "from-green-500 to-teal-500",
      isNew: false,
      path: "/dashboard/ai-writer",
    },
    {
      title: t("dashboard.tools.aiAds"),
      description: t("dashboard.tools.aiAdsDesc"),
      icon: <Target className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      isNew: true,
      path: "/dashboard/ai-ads",
    },
    // {
    //   title: "Headshot Generator",
    //   description: "Generate professional headshots for models and team members",
    //   icon: <User className="w-6 h-6" />,
    //   color: "from-pink-500 to-purple-500",
    //   isPro: true,
    //   path: "/dashboard/headshot-generator",
    // },
    {
      title: t("dashboard.tools.clothesChanger"),
      description: t("dashboard.tools.clothesChangerDesc"),
      icon: <ImageIcon className="w-6 h-6" />,
      color: "from-blue-500 to-purple-500",
      isNew: false,
      path: "/dashboard/fashion-edit",
    },
    {
      title: t("dashboard.tools.imageVariation"),
      description: t("dashboard.tools.imageVariationDesc"),
      icon: <Wand2 className="w-6 h-6" />,
      color: "from-green-500 to-teal-500",
      isNew: false,
      path: "/dashboard/image-variation",
    },
    {
      title: t("dashboard.tools.aiModelGenerator"),
      description: t("dashboard.tools.aiModelGeneratorDesc"),
      icon: <UserCircle2 className="w-6 h-6" />,
      color: "from-pink-500 to-purple-500",
      isNew: false,
      path: "/dashboard/ai-model-generator",
    },
    {
      title: t("dashboard.tools.ecommerceGenerator"),
      description: t("dashboard.tools.ecommerceGeneratorDesc"),
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      isNew: false,
      path: "/dashboard/ecommerce-generator",
    },
  ]

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("dashboard.title")}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t("dashboard.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fashionTools.map((tool, index) => (
          <Card
            key={index}
            className="relative overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
          >
            <Link href={tool.path} className="block p-6">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4`}
              >
                <div className="text-white">{tool.icon}</div>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{tool.title}</h3>
                {tool.isNew && (
                  <span className="px-2 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">
                    {t("common.new")}
                  </span>
                )}
                {tool.isPro && (
                  <span className="px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                    {t("common.pro")}
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{tool.description}</p>
            </Link>
          </Card>
        ))}
      </div>
    </Layout>
  )
}
