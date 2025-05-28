import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Palette, ImageIcon, TrendingUp, DollarSign, Zap } from "lucide-react"

export default function SmallBusinessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a47] to-[#373773] dark:from-pink-300 dark:to-purple-300">
            Empower Your Small Fashion Business with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Level the playing field with enterprise-grade AI tools designed to help small fashion businesses thrive in a
            competitive market.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
            >
              Start Your Free Trial
            </Button>
          </Link>
          <div className="mt-12 relative">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="AI-powered small business fashion solutions"
              width={800}
              height={400}
              className="rounded-lg shadow-lg mx-auto"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <Palette className="w-12 h-12 text-[#FF1F8E] mx-auto mb-2" />
              <p className="text-sm font-semibold">AI Design Assistant</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Features for Small Fashion Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Design Assistant",
                description: "Generate unique designs and patterns to expand your product line efficiently.",
                icon: <Palette className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Cost-Effective Product Photography",
                description: "Create professional product images without the need for expensive equipment or studios.",
                icon: <ImageIcon className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Trend Forecasting",
                description: "Stay ahead of the curve with AI-powered fashion trend predictions.",
                icon: <TrendingUp className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Smart Pricing Strategy",
                description: "Optimize your pricing for maximum profitability with AI-driven insights.",
                icon: <DollarSign className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Virtual Try-On for Small Inventories",
                description: "Allow customers to visualize your products without the need for extensive stock.",
                icon: <Zap className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "AI-Powered Customer Service",
                description: "Provide 24/7 customer support with AI chatbots trained on your product line.",
                icon: <CheckCircle className="w-6 h-6 text-[#FF1F8E]" />,
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6 dark:bg-gray-800/50 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-2">{feature.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Small Businesses Choose TopMaj AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {[
                "Compete with larger brands using advanced AI technology",
                "Reduce operational costs while increasing productivity",
                "Expand your product line with AI-generated designs",
                "Improve customer satisfaction with personalized experiences",
                "Make data-driven decisions to grow your business",
                "Scale your operations efficiently with AI automation",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-[#FF1F8E] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                </div>
              ))}
            </div>
            <div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Small business benefits visualization"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Small Fashion Business with AI?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join other successful small businesses leveraging TopMaj AI to innovate and expand in the fashion industry.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
            >
              Start Your Free Trial Now
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
