"use client"

import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Sparkles, Users, MessageSquare, InstagramIcon as InstagramLogo, ChromeIcon as GoogleAds } from "lucide-react"
import { useLanguage } from "@/components/simple-language-switcher"

const adTools = [
  {
    titleKey: "aiAds.instagramCaptions.title",
    descriptionKey: "aiAds.instagramCaptions.description",
    icon: <InstagramLogo className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/instagram-captions", // Reusing existing component
  },
  {
    titleKey: "aiAds.instagramHashtags.title",
    descriptionKey: "aiAds.instagramHashtags.description",
    icon: <InstagramLogo className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/instagram-hashtags", // Reusing existing component
  },
  {
    titleKey: "aiAds.googleAdsHeadlines.title",
    descriptionKey: "aiAds.googleAdsHeadlines.description",
    icon: <GoogleAds className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/google-ads-headlines", // Reusing existing component
  },
  {
    titleKey: "aiAds.googleAdsDescription.title",
    descriptionKey: "aiAds.googleAdsDescription.description",
    icon: <GoogleAds className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/google-ads-description", // Reusing existing component
  },
  {
    titleKey: "aiAds.adCreative.title",
    descriptionKey: "aiAds.adCreative.description",
    icon: <Sparkles className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-ads/ad-creative-generator",
  },
  {
    titleKey: "aiAds.adCopy.title",
    descriptionKey: "aiAds.adCopy.description",
    icon: <MessageSquare className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-ads/ad-copy-generator",
  },
  {
    titleKey: "aiAds.targetAudience.title",
    descriptionKey: "aiAds.targetAudience.description",
    icon: <Users className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-ads/target-audience-analyzer",
  },
]

export default function AiAds() {
  const { t, isRTL } = useLanguage()

  return (
    <Layout>
      <div className="mb-8" dir={isRTL ? "rtl" : "ltr"}>
        <h1 className="text-3xl font-bold">{t("aiAds.pageTitle")}</h1>
        <p className="text-gray-600">{t("aiAds.pageSubtitle")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" dir={isRTL ? "rtl" : "ltr"}>
        {adTools.map((tool) => (
          <Link key={tool.titleKey} href={tool.link || "#"}>
            <Card className="p-4 h-full flex flex-col dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">{tool.icon}</div>
              <h2 className="text-lg font-semibold mb-2">{t(tool.titleKey)}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{t(tool.descriptionKey)}</p>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
