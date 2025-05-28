import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShirtIcon as Tshirt, Store, Users, TrendingUp, Palette, Sparkles } from "lucide-react"

export default function UseCasesPage() {
  const useCases = [
    {
      title: "Fashion Brands",
      description:
        "Streamline your design process, generate unique styles, and create stunning marketing materials with AI-powered tools.",
      icon: <Tshirt className="w-12 h-12 text-[#FF1F8E] mb-4" />,
      benefits: [
        "Rapid prototyping of new designs",
        "AI-generated fashion photoshoots",
        "Virtual try-on experiences for customers",
        "Personalized style recommendations",
      ],
    },
    {
      title: "E-commerce Retailers",
      description: "Enhance your online shopping experience with AI-powered features that boost engagement and sales.",
      icon: <Store className="w-12 h-12 text-[#FF1F8E] mb-4" />,
      benefits: [
        "Virtual fitting rooms",
        "AI-powered product recommendations",
        "Automated product descriptions",
        "Dynamic pricing optimization",
      ],
    },
    {
      title: "Fashion Influencers",
      description: "Create unique content and engage your audience with cutting-edge AI fashion tools.",
      icon: <Users className="w-12 h-12 text-[#FF1F8E] mb-4" />,
      benefits: [
        "Generate outfit ideas and combinations",
        "Create AI fashion videos and reels",
        "Personalized style advice for followers",
        "Trend forecasting and analysis",
      ],
    },
    {
      title: "Marketing Agencies",
      description: "Deliver innovative fashion campaigns and content for your clients using AI-powered creative tools.",
      icon: <TrendingUp className="w-12 h-12 text-[#FF1F8E] mb-4" />,
      benefits: [
        "Rapid ad creative generation",
        "AI-powered copywriting for fashion",
        "Data-driven campaign optimization",
        "Automated A/B testing for visuals",
      ],
    },
    {
      title: "Fashion Schools",
      description:
        "Incorporate cutting-edge AI technology into your curriculum and prepare students for the future of fashion.",
      icon: <Palette className="w-12 h-12 text-[#FF1F8E] mb-4" />,
      benefits: [
        "AI-assisted design courses",
        "Virtual fashion shows and exhibitions",
        "Trend analysis and forecasting tools",
        "Sustainable fashion design with AI",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a47] to-[#373773] dark:from-pink-300 dark:to-purple-300">
            TopMaj AI Fashion Use Cases
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how TopMaj AI is transforming various sectors of the fashion industry with innovative AI-powered
            solutions.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow dark:bg-gray-800/50 dark:border-gray-700"
            >
              {useCase.icon}
              <h2 className="text-2xl font-bold mb-4">{useCase.title}</h2>
              <p className="text-gray-600 mb-4">{useCase.description}</p>
              <ul className="text-left w-full">
                {useCase.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-[#FF1F8E] flex-shrink-0 mt-1" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">How TopMaj AI Adapts to Your Needs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Customizable AI Models</h3>
              <p className="text-gray-700">
                Our AI models can be fine-tuned to your specific brand aesthetics and design language, ensuring all
                generated content aligns perfectly with your vision.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Scalable Solutions</h3>
              <p className="text-gray-700">
                Whether you're a small boutique or a large enterprise, our AI tools scale to meet your needs, from
                individual designs to mass production assistance.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Integration with Existing Workflows</h3>
              <p className="text-gray-700">
                TopMaj AI seamlessly integrates with your current design and marketing tools, enhancing your workflow
                without disrupting it.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Continuous Learning and Improvement</h3>
              <p className="text-gray-700">
                Our AI models continuously learn from industry trends and your feedback, ensuring you always have access
                to cutting-edge fashion AI capabilities.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Revolutionize Your Fashion Business?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the ranks of innovative fashion brands, retailers, and creators who are leveraging TopMaj AI to stay
            ahead in the competitive world of fashion.
          </p>
          <Button size="lg" className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 text-white">
            Start Your Free Trial Today
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  )
}
