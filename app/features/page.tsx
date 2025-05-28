import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShirtIcon as Tshirt, Wand2, UserCircle2, Check, Palette, ShoppingBag, ImageIcon } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      title: "Virtual Try-On",
      description: "Instantly visualize designs on AI-generated models with realistic lighting and fabric physics.",
      icon: <Tshirt className="w-12 h-12 text-[#FF1F8E] mb-4" />,
    },
    {
      title: "AI Fashion Design",
      description: "Generate unique fashion designs from text descriptions using our advanced AI technology.",
      icon: <Palette className="w-12 h-12 text-[#FF1F8E] mb-4" />,
    },
    {
      title: "Image Variation",
      description: "Create multiple variations of your designs to explore different styles and color schemes.",
      icon: <Wand2 className="w-12 h-12 text-[#FF1F8E] mb-4" />,
    },
    {
      title: "AI Model Generator",
      description: "Create diverse AI models for your designs, with customizable attributes and poses.",
      icon: <UserCircle2 className="w-12 h-12 text-[#FF1F8E] mb-4" />,
    },
    {
      title: "E-commerce Generator",
      description: "Produce high-quality product images for various fashion items, ready for your online store.",
      icon: <ShoppingBag className="w-12 h-12 text-[#FF1F8E] mb-4" />,
    },
    {
      title: "Clothes Changer",
      description: "Easily edit and modify existing fashion images to create new designs and variations.",
      icon: <ImageIcon className="w-12 h-12 text-[#FF1F8E] mb-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a47] to-[#373773] dark:from-pink-300 dark:to-purple-300">
            AI-Powered Fashion Design Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionize your fashion design process with TopMaj's cutting-edge AI tools. From virtual try-ons to
            AI-generated product images, our platform empowers designers and brands to create stunning fashion faster
            than ever before.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow dark:bg-gray-800/50 dark:border-gray-700"
            >
              {feature.icon}
              <h2 className="text-2xl font-bold mb-4">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose TopMaj AI Fashion?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Generate high-quality fashion designs in seconds",
              "Streamline your design process with AI-powered tools",
              "Create diverse and inclusive fashion campaigns",
              "Reduce production costs with virtual prototyping",
              "Enhance e-commerce visuals with AI-generated product images",
              "Stay ahead of trends with AI-driven fashion insights",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-6 w-6 text-[#FF1F8E] flex-shrink-0 mt-1" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Revolutionize Your Fashion Design Process?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of fashion designers and brands who are already using TopMaj AI to create stunning designs,
            streamline their workflow, and boost their creativity.
          </p>
          <Button size="lg" className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 text-white">
            Start Your Free Trial Now
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  )
}
