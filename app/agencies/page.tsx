import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Briefcase, Palette, TrendingUp, Zap } from "lucide-react"

export default function AgenciesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a47] to-[#373773] dark:from-pink-300 dark:to-purple-300">
            Revolutionize Your Agency's Fashion Design Process
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Empower your creative team with AI-driven tools to deliver cutting-edge fashion designs and campaigns for
            your clients.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
            >
              Start Your Free Trial
            </Button>
          </Link>
          <div className="mt-12">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="AI-powered fashion design process"
              width={800}
              height={400}
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Features Tailored for Agencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Design Generation",
                description: "Create unique fashion designs in seconds, speeding up your ideation process.",
                icon: <Palette className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Virtual Fashion Shoots",
                description: "Produce high-quality fashion imagery without the need for physical photoshoots.",
                icon: <Briefcase className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Trend Forecasting",
                description: "Stay ahead of the curve with AI-driven fashion trend predictions.",
                icon: <TrendingUp className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Client Collaboration Tools",
                description: "Seamlessly share and iterate on designs with your clients in real-time.",
                icon: <Zap className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Brand-Specific AI Training",
                description: "Train our AI on your client's brand guidelines for consistent output.",
                icon: <CheckCircle className="w-6 h-6 text-[#FF1F8E]" />,
              },
              {
                title: "Scalable Asset Generation",
                description: "Quickly produce variations of designs for different marketing channels.",
                icon: <Briefcase className="w-6 h-6 text-[#FF1F8E]" />,
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
          <h2 className="text-3xl font-bold mb-8 text-center">Why Agencies Choose TopMaj AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              {[
                "Reduce time-to-market for client campaigns",
                "Increase creative output without expanding team size",
                "Offer cutting-edge AI fashion services to clients",
                "Streamline the design approval process",
                "Easily adapt designs for various marketing channels",
                "Stay competitive in the fast-paced fashion industry",
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
                alt="Agency benefits visualization"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Agency's Fashion Design Process?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the ranks of innovative agencies leveraging AI to deliver exceptional fashion designs and campaigns.
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
