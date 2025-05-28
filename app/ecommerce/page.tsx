import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, ShoppingBag, ImageIcon, TrendingUp, Users, Zap } from "lucide-react"

export default function EcommercePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a47] to-[#373773] dark:from-pink-300 dark:to-purple-300">
            Elevate Your E-commerce Fashion Business with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Harness the power of AI to create stunning product visuals, personalize shopping experiences, and boost your
            online fashion sales.
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
              alt="AI-powered e-commerce fashion platform"
              width={800}
              height={400}
              className="rounded-lg shadow-lg mx-auto"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <ShoppingBag className="w-12 h-12 text-[#FF1F8E] mx-auto mb-2" />
              <p className="text-sm font-semibold">AI-Powered Shopping</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">E-commerce Optimized Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI Product Photography",
                description: "Generate high-quality product images without expensive photo shoots.",
                icon: <ImageIcon className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Virtual Try-On",
                description: "Allow customers to visualize products on themselves, boosting confidence in purchases.",
                icon: <Users className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Personalized Recommendations",
                description: "Use AI to suggest products based on customer preferences and browsing history.",
                icon: <Zap className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Trend-Based Inventory Management",
                description: "Predict fashion trends to optimize your stock levels and reduce waste.",
                icon: <TrendingUp className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Dynamic Pricing Optimization",
                description: "Automatically adjust prices based on demand, competition, and other factors.",
                icon: <ShoppingBag className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "AI-Powered Size Recommendations",
                description: "Reduce returns by helping customers find their perfect fit.",
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
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits for E-commerce Fashion Retailers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="E-commerce benefits visualization"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              {[
                "Increase conversion rates with immersive product visualization",
                "Reduce return rates through accurate size recommendations",
                "Streamline product photography process and reduce costs",
                "Enhance customer engagement with personalized experiences",
                "Stay ahead of fashion trends with AI-driven insights",
                "Optimize pricing strategy for maximum profitability",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-[#FF1F8E] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Revolutionize Your E-commerce Fashion Business?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the future of online fashion retail with TopMaj AI's cutting-edge e-commerce solutions.
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
