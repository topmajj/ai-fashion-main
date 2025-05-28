import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Building, Cog, TrendingUp, Shield, Zap } from "lucide-react"

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a47] to-[#373773] dark:from-pink-300 dark:to-purple-300">
            Enterprise-Grade AI Solutions for Fashion Industry Leaders
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your fashion enterprise with cutting-edge AI technology, tailored to meet the complex needs of
            large-scale operations.
          </p>
          <Link href="/contact-sales">
            <Button
              size="lg"
              className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
            >
              Contact Sales
            </Button>
          </Link>
          <div className="mt-12 relative">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Enterprise-grade AI fashion solutions"
              width={800}
              height={400}
              className="rounded-lg shadow-lg mx-auto"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <Building className="w-12 h-12 text-[#FF1F8E] mx-auto mb-2" />
              <p className="text-sm font-semibold">Enterprise Solutions</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Enterprise-Level Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Custom AI Model Training",
                description: "Tailor our AI models to your specific brand aesthetics and design language.",
                icon: <Cog className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Scalable Design Generation",
                description: "Create thousands of unique designs across multiple product lines simultaneously.",
                icon: <Building className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Advanced Trend Forecasting",
                description: "Leverage big data and AI to predict industry trends with unparalleled accuracy.",
                icon: <TrendingUp className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Enterprise-Grade Security",
                description: "Benefit from robust security measures to protect your valuable design data.",
                icon: <Shield className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Seamless Integration",
                description: "Integrate our AI solutions with your existing enterprise software ecosystem.",
                icon: <Zap className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Dedicated Support Team",
                description: "Get priority access to our fashion AI experts and 24/7 technical support.",
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
          <h2 className="text-3xl font-bold mb-8 text-center">Enterprise Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Enterprise benefits visualization"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              {[
                "Dramatically reduce time-to-market for new fashion lines",
                "Optimize supply chain with AI-driven demand forecasting",
                "Enhance sustainability efforts through efficient design processes",
                "Improve customer satisfaction with personalized fashion experiences",
                "Gain competitive edge with rapid prototyping and iteration",
                "Ensure brand consistency across global markets with AI-powered tools",
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
          <h2 className="text-3xl font-bold mb-6">Ready to Lead the Future of Fashion with AI?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how TopMaj AI can revolutionize your fashion enterprise. Our team is ready to create a custom
            solution tailored to your needs.
          </p>
          <Link href="/contact-sales">
            <Button
              size="lg"
              className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
            >
              Schedule a Consultation
            </Button>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
