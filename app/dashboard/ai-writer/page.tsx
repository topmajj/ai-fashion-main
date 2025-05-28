"use client"

import Link from "next/link"
import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import {
  ShirtIcon as Tshirt,
  Sparkles,
  CheckCircle,
  Briefcase,
  Users,
  Zap,
  MessageSquare,
  FileText,
  ListChecks,
  FacebookIcon as FacebookLogo,
  InstagramIcon as InstagramLogo,
  TwitterIcon as TwitterLogo,
  ChromeIcon as GoogleAds,
  File,
  Minus,
  ThumbsUpIcon as ThumbUp,
  Mail,
  Video,
} from "lucide-react"

const contentTypes = [
  {
    title: "Post Title Generator",
    description: "Get captivating post titles instantly with our title generator. Boost engagement and save time.",
    icon: <Tshirt className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/post-title-generator",
  },
  {
    title: "Summarize Text",
    description: "Effortlessly condense large text into shorter summaries. Save time and increase productivity.",
    icon: <MessageSquare className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/summarize-text",
  },
  {
    title: "Product Description",
    description: "Easily create compelling product descriptions that sell. Increase conversions and boost sales.",
    icon: <FileText className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/product-description",
  },
  {
    title: "Article Generator",
    description: "Instantly create unique articles on any topic. Boost engagement, improve SEO, and save time.",
    icon: <ListChecks className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/article-generator",
  },
  {
    title: "Product Name Generator",
    description: "Create catchy product names with ease. Attract customers and boost sales effortlessly.",
    icon: <Briefcase className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/product-name-generator",
  },
  {
    title: "Testimonial Review",
    description: "Instantly generate authentic testimonials. Build trust and credibility with genuine reviews.",
    icon: <ThumbUp className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/testimonial-review",
  },
  {
    title: "Problem Agitate Solution",
    description: "Identify and solve problems efficiently. Streamline solutions and increase productivity.",
    icon: <Zap className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/problem-agitate-solution",
  },
  {
    title: "Blog Section",
    description: "Effortlessly create blog sections with AI. Get unique, engaging content and save time.",
    icon: <FileText className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/blog-section",
  },
  {
    title: "Blog Post Ideas",
    description:
      "Unlock your creativity with unique blog post ideas. Generate endless inspiration and take your content to the next level.",
    icon: <Sparkles className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/blog-post-ideas",
  },
  {
    title: "Blog Intros",
    description:
      "Set the tone for your blog post with captivating intros. Grab readers' attention and keep them engaged.",
    icon: <MessageSquare className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/blog-intros",
  },
  {
    title: "Blog Conclusion",
    description: "End your blog posts on a high note. Craft memorable conclusions that leave a lasting impact.",
    icon: <Minus className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/blog-conclusion",
  },
  {
    title: "Instagram Captions",
    description:
      "Elevate your Instagram game with captivating captions. Generate unique captions that engage followers and increase your reach.",
    icon: <InstagramLogo className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/instagram-captions",
  },
  {
    title: "Instagram Hashtags",
    description:
      "Boost your Instagram reach with relevant hashtags. Generate optimal, trending hashtags and increase your visibility.",
    icon: <InstagramLogo className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/instagram-hashtags",
  },
  {
    title: "Social Media Post (Tweet)",
    description:
      "Make an impact with every tweet. Generate attention-grabbing social media posts and increase engagement.",
    icon: <TwitterLogo className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/social-media-post-tweet",
  },
  {
    title: "Social Media Post (Business)",
    description:
      "Generate a text for your business social media networks. Maximize your social media presence with impactful business posts.",
    icon: <Briefcase className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/social-media-post-business",
  },
  {
    title: "Google Ads Headlines",
    description:
      "Create high-converting Google ads with captivating headlines. Generate unique, clickable ads that drive traffic and boost sales.",
    icon: <GoogleAds className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/google-ads-headlines",
  },
  {
    title: "Google Ads Description",
    description: "Step up your Google ad game. Craft high-converting ad copy that grabs attention and drives sales.",
    icon: <GoogleAds className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/google-ads-description",
  },
  {
    title: "Meta Description",
    description:
      "Get more clicks with compelling meta descriptions. Generate unique, SEO-friendly meta descriptions that attract customers and boost traffic.",
    icon: <File className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/meta-description",
  },
  {
    title: "Paragraph Generator",
    description:
      "Generate a paragraph with keywords and description. Never struggle with writer's block again. Generate flawless paragraphs that captivate readers.",
    icon: <FileText className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/paragraph-generator",
  },
  {
    title: "Pros & Cons",
    description:
      "Make informed decisions with ease. Generate unbiased pros and cons lists that help you weigh options and make better choices.",
    icon: <ThumbUp className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/pros-cons",
  },
  {
    title: "Email Generator",
    description: "Generate an email with your subject and description. Streamline your inbox and save time.",
    icon: <Mail className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/email-generator",
  },
  {
    title: "Email Answer Generator",
    description:
      "Effortlessly tackle your overflowing inbox with custom, accurate responses to common queries, freeing you up to focus on what matters most.",
    icon: <Mail className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/email-answer-generator",
  },
  {
    title: "FAQ Generator (All Datas)",
    description:
      "Quickly create helpful FAQs. Our AI-powered generator provides custom responses to common questions in seconds.",
    icon: <Users className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/faq-generator",
  },
  {
    title: "Newsletter Generator",
    description:
      "Generate engaging newsletters easily with personalized content that resonates with your audience, driving growth and engagement.",
    icon: <Mail className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/newsletter-generator",
  },
  {
    title: "Grammar Correction",
    description:
      "Eliminate grammar errors and enhance your writing with ease. Our tool offers seamless grammar correction for flawless content.",
    icon: <CheckCircle className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/grammar-correction",
  },
  {
    title: "TL;DR Summarization",
    description: "Automatically summarize long texts into bite-sized summaries with this TL;DR generator.",
    icon: <MessageSquare className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/tldr-summarization",
  },
  {
    title: "Custom Generation",
    description:
      "Create your own custom generator with All Our app allows you to quickly and easily generate unique content in any language.",
    icon: <Zap className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/custom-generation",
  },
  {
    title: "Youtube Video Description",
    description:
      "Elevate your Youtube content with compelling video descriptions. Generate engaging descriptions effortlessly and increase views.",
    icon: <Video className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/youtube-video-description",
  },
  {
    title: "Youtube Video Title",
    description:
      "Get more views with attention-grabbing video titles. Create unique, catchy titles that entice viewers.",
    icon: <Video className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/youtube-video-title",
  },
  {
    title: "Youtube Video Tag",
    description: "Improve your Youtube video's discoverability with relevant video tags. Boost views and engagement.",
    icon: <Video className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/youtube-video-tag",
  },
  {
    title: "Facebook Headlines",
    description:
      "Get noticed with attention-grabbing Facebook headlines. Generate unique, clickable headlines that increase engagement and drive traffic.",
    icon: <FacebookLogo className="w-8 h-8 text-[#FF1F8E] mb-4" />,
    link: "/dashboard/ai-writer/facebook-headlines",
  },
].filter((contentType) => contentType.title !== "Facebook Ads")

export default function AiWriter() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Writer</h1>
        <p className="text-gray-600">Generate various types of text content with AI</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {contentTypes.map((contentType) => (
          <Link key={contentType.title} href={contentType.link || "#"}>
            <Card className="p-4 h-full flex flex-col dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-2">{contentType.icon}</div>
              <h2 className="text-lg font-semibold mb-2">{contentType.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{contentType.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
