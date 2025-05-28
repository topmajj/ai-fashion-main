import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ShirtIcon as Tshirt,
  Wand2,
  UserCircle2,
  Check,
  Palette,
  ShoppingBag,
  ImageIcon,
  ChevronDown,
} from "lucide-react"
import { VideoControls } from "@/components/VideoControls"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white font-poppins">
      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a47] to-[#373773] leading-tight font-heading">
              Create Stunning Fashion with AI
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
              Design, visualize, and generate unique fashion items, marketing assets, and personalized styles with
              TopMaj's AI-powered platform.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
                >
                  Try TopMaj For Free Now
                </Button>
              </Link>
            </div>

            <div className="mt-8 md:mt-12 flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6628df8b54b6e013ddb23261_customer-2-difta5uiijZ0o2wmpSFTe2PXGYEH4b.webp"
                  alt="TopMaj User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66fa97362b9ac0348b1e373e_bf43a399ba0544b94d6e7c1169de646c.jpg-CxaVpF69yjWeih7si05V4QwL5rAPSS.jpeg"
                  alt="TopMaj User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66fa97362b9ac0348b1e3725_0ce8d4076c7d1b17e2821e9299db77eb.jpg-oCqYRNQUrGP3XBeYxoY2FS0Uc5VwpJ.jpeg"
                  alt="TopMaj User"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                TopMaj is supporting over <span className="font-semibold">100,000 users</span> worldwide
              </p>
            </div>

            <div className="mt-8 md:mt-12 mb-6 md:mb-8">
              <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
                <video
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/topmajj-qqsxqBpdsP46bVtZbxVuGKDlccjilj.mp4"
                  className="w-full"
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <VideoControls />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 dark:bg-gray-800/50 dark:border-gray-700">
              <div className="text-2xl md:text-4xl font-bold text-[#FF1F8E] mb-2">10+</div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">AI-Powered Fashion Tools</p>
            </Card>
            <Card className="p-4 md:p-6 dark:bg-gray-800/50 dark:border-gray-700">
              <div className="text-2xl md:text-4xl font-bold text-[#FF1F8E] mb-2">1M+</div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">AI-Generated Designs</p>
            </Card>
            <Card className="p-4 md:p-6 dark:bg-gray-800/50 dark:border-gray-700">
              <div className="text-2xl md:text-4xl font-bold text-[#FF1F8E] mb-2">24{"/"}7</div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">AI Fashion Assistant</p>
            </Card>
            <Card className="p-4 md:p-6 dark:bg-gray-800/50 dark:border-gray-700">
              <div className="text-2xl md:text-4xl font-bold text-[#FF1F8E] mb-2">100k+</div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Satisfied Designers</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-16 md:space-y-32">
        {/* Generate High-Performing Fashion Creatives */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="text-[#FF1F8E] font-medium mb-2">Generate High-Performing Fashion Creatives</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-heading">
              Transform Your Fashion Ideas into Reality
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
              From virtual try-ons to AI model generation, our platform offers a comprehensive suite of tools to bring
              your fashion concepts to life. Create stunning designs, edit existing images, and generate e-commerce
              ready product visuals in seconds.
            </p>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Virtual Try-On for instant visualization</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">AI-powered fashion design and editing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">E-commerce product generation for various categories</span>
              </li>
            </ul>
            <Link href="/register">
              <Button
                size="lg"
                className="w-full md:w-auto bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
              >
                Try TopMaj For Free Now
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 dark:bg-gray-800">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Fashion Creative Generator Interface"
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Automate Fashion Asset Production */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 dark:bg-gray-800">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Fashion Template Builder"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="text-[#FF1F8E] font-medium mb-2">Automate Fashion Asset Production</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-heading">
              Streamline Your Fashion Workflow
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
              Our AI-powered platform automates and enhances every step of your fashion design process. From initial
              concept to final product imagery, TopMaj provides the tools you need to work efficiently and creatively.
            </p>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Rapid prototyping with AI model generation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Seamless editing and variation creation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Automated e-commerce ready visuals</span>
              </li>
            </ul>
            <Link href="/register">
              <Button
                size="lg"
                className="w-full md:w-auto bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
              >
                Try TopMaj For Free Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Master Your Fashion Data & Competitors */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="text-[#FF1F8E] font-medium mb-2">Master Your Fashion Data &amp; Competitors</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-heading">Elevate Your Fashion Game</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
              Stay ahead of trends and optimize your designs with our AI-powered insights. From seasonal collections to
              personalized styling, TopMaj helps you create fashion that resonates with your audience.
            </p>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">AI-generated seasonal fashion ideas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Personal AI stylist for tailored recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Style generator for unique fashion combinations</span>
              </li>
            </ul>
            <Link href="/register">
              <Button
                size="lg"
                className="w-full md:w-auto bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
              >
                Try TopMaj For Free Now
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 dark:bg-gray-800">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="Fashion Analytics Dashboard"
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Predict Fashion Creative Performance */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 dark:bg-gray-800">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Fashion Performance Predictor"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="text-[#FF1F8E] font-medium mb-2">Predict Fashion Creative Performance</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-heading">Achieve higher ROI from day 1</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
              Score your fashion creatives before advertising. Let our AI predict which styles will perform better and
              get actionable insights. Improve your success rate and achieve high ROI from day one by taking data-backed
              decisions.
            </p>
            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Actionable insights to improve creative performance</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Let your designers take data-backed decisions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0" />
                <span className="text-sm md:text-base">Achieve high ROI from day one</span>
              </li>
            </ul>
            <Link href="/register">
              <Button
                size="lg"
                className="w-full md:w-auto bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
              >
                Try TopMaj For Free Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Marketing Features Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Your all-in-one Marketing Powerhouse</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Generate high-conversion ad assets, gain actionable insights to optimize your campaigns, analyze
                competitors' performance and score your creatives before media spend - all on one platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Generate Text",
                  description:
                    "Generate texts that bring results using proven copywriting frameworks using our ad text trained AI.",
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-12%20at%2003-41-04%20Your%20AI%20Powerhouse%20for%20All%20Advertising%20Needs-I9KsdGTbpb21AS270lRSkbaHcMfozQ.png",
                },
                {
                  title: "Ad Creatives",
                  description: "Generate conversion-focused ad creatives in seconds for any advertising platform.",
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-12%20at%2003-41-04%20Your%20AI%20Powerhouse%20for%20All%20Advertising%20Needs-I9KsdGTbpb21AS270lRSkbaHcMfozQ.png",
                },
                {
                  title: "Product Shoots",
                  description:
                    "Transform product photos into professional grade fashion and e-commerce images instantly with AI.",
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-12%20at%2003-41-04%20Your%20AI%20Powerhouse%20for%20All%20Advertising%20Needs-I9KsdGTbpb21AS270lRSkbaHcMfozQ.png",
                },
                {
                  title: "Creative Insights AI",
                  description:
                    "Identify which creatives perform the best in your ad accounts and learn why. Receive data-driven, actionable tips for your next ones.",
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-12%20at%2003-41-04%20Your%20AI%20Powerhouse%20for%20All%20Advertising%20Needs-I9KsdGTbpb21AS270lRSkbaHcMfozQ.png",
                },
                {
                  title: "Creative Scoring AI",
                  description:
                    "Score your ad creatives before advertising. Let our AI give you actionable insights to improve them.",
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-12%20at%2003-41-04%20Your%20AI%20Powerhouse%20for%20All%20Advertising%20Needs-I9KsdGTbpb21AS270lRSkbaHcMfozQ.png",
                },
                {
                  title: "Competitor Insight AI",
                  description:
                    "Analyze your competitors' campaigns and gain valuable insights to stay ahead of the curve.",
                  image:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-12%20at%2003-41-04%20Your%20AI%20Powerhouse%20for%20All%20Advertising%20Needs-I9KsdGTbpb21AS270lRSkbaHcMfozQ.png",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-800/50"
                >
                  <div className="p-6">
                    <div className="aspect-[4/3] relative mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img src={feature.image || "/placeholder.svg"} alt={feature.title} className="object-cover" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
                >
                  Try For Free Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Add Three Feature Blocks */}
        <section className="container mx-auto max-w-6xl px-4 space-y-24 mb-24">
          {/* First Block */}
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800/50 rounded-xl p-8">
            <div>
              <h3 className="text-[#FF1F8E] text-xl mb-4">Generate High-Performing Ad Creatives</h3>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Boost sales by up to 14x</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Generate conversion-optimized ad creatives such as banners, videos, texts and product shoots in seconds.
                Get up to 14 times better conversion and click-through rates using our state-of-the-art proprietary AI
                models
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>High-ROI ad creatives in seconds</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>Any ad asset you need for any platform</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>On-brand and customizable outputs</span>
                </li>
              </ul>
              <Button size="lg" className="bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90">
                Try For Free Now
              </Button>
            </div>
            <div className="bg-pink-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Brand</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot-www.adcreative.ai-2025.02.12-04_06_48-yoPTeHF45WGYJooJzYxwI9S4Bzn28O.png"
                    alt="Valentine's Brand"
                    className="w-12 h-12"
                  />
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Size</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span className="text-xs">1080×1920</span>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Texts</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span className="text-xs">Join now!</span>
                </div>
              </div>
              <div className="text-center mb-8">
                <Button className="bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90">Generate</Button>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-4">AI Generated Assets</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[96, 94, 92].map((score, i) => (
                    <div key={i} className="relative">
                      <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs">
                        Score {score}/100
                      </div>
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot-www.adcreative.ai-2025.02.12-04_06_48-yoPTeHF45WGYJooJzYxwI9S4Bzn28O.png"
                        alt={`AI Generated Ad ${i + 1}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Second Block */}
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800/50 rounded-xl p-8">
            <div>
              <h3 className="text-[#FF1F8E] text-xl mb-4">AI-Powered Fashion Photography</h3>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Professional shoots in minutes</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Transform your product photos into professional fashion photography instantly. Create stunning
                lookbooks, campaign shots, and e-commerce imagery without expensive photo shoots.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>Studio-quality results instantly</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>Multiple styles and environments</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>Consistent brand aesthetics</span>
                </li>
              </ul>
              <Button size="lg" className="bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90">
                Try For Free Now
              </Button>
            </div>
            <div className="bg-pink-50 dark:bg-gray-800 rounded-xl p-6">
              {/* Similar interface structure as first block but with photography-focused content */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Style</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span className="text-xs">Studio Light</span>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Background</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span className="text-xs">Natural</span>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Mood</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span className="text-xs">Elegant</span>
                </div>
              </div>
              <div className="text-center mb-8">
                <Button className="bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90">Generate</Button>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-4">AI Generated Photos</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[98, 95, 93].map((score, i) => (
                    <div key={i} className="relative">
                      <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs">
                        Score {score}/100
                      </div>
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot-www.adcreative.ai-2025.02.12-04_06_48-yoPTeHF45WGYJooJzYxwI9S4Bzn28O.png"
                        alt={`AI Generated Photo ${i + 1}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Third Block */}
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white dark:bg-gray-800/50 rounded-xl p-8">
            <div>
              <h3 className="text-[#FF1F8E] text-xl mb-4">Smart Collection Planning</h3>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Design with data-driven insights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Let AI analyze market trends, customer preferences, and historical data to help you create collections
                that resonate with your target audience and drive sales.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>Trend prediction and analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>Customer preference insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#FF1F8E]" />
                  <span>Sales performance forecasting</span>
                </li>
              </ul>
              <Button size="lg" className="bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90">
                Try For Free Now
              </Button>
            </div>
            <div className="bg-pink-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Season</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span className="text-xs">Spring 2025</span>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Market</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span className="text-xs">Global</span>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Category</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <span className="text-xs">Casual Wear</span>
                </div>
              </div>
              <div className="text-center mb-8">
                <Button className="bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90">Analyze</Button>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-4">Trend Analysis Results</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[97, 96, 94].map((score, i) => (
                    <div key={i} className="relative">
                      <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs">
                        Trend {score}%
                      </div>
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot-www.adcreative.ai-2025.02.12-04_06_48-yoPTeHF45WGYJooJzYxwI9S4Bzn28O.png"
                        alt={`Trend Analysis ${i + 1}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fashion Tools Section */}
        <section className="py-12 md:py-16">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 font-heading">Your Complete AI Fashion Toolkit</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our comprehensive suite of AI-powered tools designed to revolutionize every aspect of fashion
              design, from concept to e-commerce ready visuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Virtual Try-On",
                description:
                  "Instantly visualize designs on AI-generated models, streamlining the prototyping process.",
                icon: <Tshirt className="w-8 h-8 text-[#FF1F8E] mb-4" />,
              },
              {
                title: "AI Fashion Design",
                description: "Create unique fashion designs from text descriptions using advanced AI technology.",
                icon: <Palette className="w-8 h-8 text-[#FF1F8E] mb-4" />,
              },
              {
                title: "Image Variation",
                description:
                  "Generate multiple variations of your fashion designs to explore different styles and options.",
                icon: <Wand2 className="w-8 h-8 text-[#FF1F8E] mb-4" />,
              },
              {
                title: "AI Model Generator",
                description:
                  "Create diverse AI models for your fashion designs, including options for different pieces and backgrounds.",
                icon: <UserCircle2 className="w-8 h-8 text-[#FF1F8E] mb-4" />,
              },
              {
                title: "E-commerce Generator",
                description:
                  "Produce high-quality product images for various fashion items, ready for your online store.",
                icon: <ShoppingBag className="w-8 h-8 text-[#FF1F8E] mb-4" />,
              },
              {
                title: "Clothes Changer",
                description: "Easily edit and modify existing fashion images to create new designs and variations.",
                icon: <ImageIcon className="w-8 h-8 text-[#FF1F8E] mb-4" />,
              },
            ].map((tool, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="p-6 space-y-4">
                  {tool.icon}
                  <h3 className="text-lg md:text-xl font-bold">{tool.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{tool.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full md:w-auto bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
              >
                Try TopMaj AI Fashion Tools Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Awards & Testimonials Section */}
        <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 font-heading">Testimonials</h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Read our clients' success stories to see how our cutting-edge AI solutions have helped businesses achieve
              their goals.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Jordan M.",
                title: "Fashion Designer",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66fa97362f8ee9f1c037106e_7c6e11f511c05e169895980c7d794a5b-rYOdaz0YyyDR2hBEv1pIq1zNuevWuH.png",
                review:
                  "TopMaj has completely transformed my design workflow. The AI tools are incredibly intuitive and have helped me generate so many unique ideas.",
              },
              {
                name: "Robert L.",
                title: "E-commerce Retailer",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66fa99431df5d7a293dce3a7_Mask-Group-454-Qkg7BdqUT1n9uUp1QUDa2BkVgUdx5F.png",
                review:
                  "Since integrating TopMaj's AI, my product photoshoots have become so much easier and more efficient. The quality of the generated images is outstanding.",
              },
              {
                name: "Juan C.",
                title: "Marketing Manager",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66fa9736f493bad279c65f9a_ea5b56869d4ed857b646dd90a18ac022-Ps62jPwvTrQyLidVnU9vLhmdjEjHwv.png",
                review:
                  "TopMaj's AI-powered insights have significantly boosted our marketing campaign performance. The platform is a game-changer for fashion marketing.",
              },
              {
                name: "George G.",
                title: "Creative Director",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66fa9943d6953e33cb07a281_Mask-Group-452-tWPxQzFYJXRmy3ZgpW4Y9k0rPQwMaC.png",
                review:
                  "The AI models in TopMaj are incredibly realistic and diverse. It's like having a virtual photoshoot studio at my fingertips.",
              },
              {
                name: "Sam G.",
                title: "Fashion Influencer",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66fa9736872031aa83fccbd5_e8f6656446e2449e85726ba175c3bf2a-b6LSXzNwf5cyOgZKckbSGh5GwgLPng.png",
                review:
                  "TopMaj has helped me create stunning content for my social media channels. The AI tools are so easy to use, even for non-designers.",
              },
              {
                name: "Olivia B.",
                title: "Fashion Student",
                image:
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/66fa99430f61de4306053c4f_Mask-Group-453-2YMKypyoRoVBEmJ7N28PQdi1Bo51Yl.png",
                review:
                  "TopMaj is an invaluable resource for fashion students. The platform has helped me explore new design concepts and improve my skills.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-4 md:p-6 dark:bg-gray-800/50 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-sm md:text-base">{testimonial.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-2">{testimonial.title}</p>
                    <p className="text-xs md:text-sm">{testimonial.review}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full md:w-auto bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
              >
                Try TopMaj For Free Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-white to-pink-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-heading">
                Flexible Plans for Every Fashion Innovator
              </h2>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 font-heading">
                Choose the Perfect AI Fashion Suite for You
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Whether you're a fashion brand, retailer, or enterprise, our pricing is crafted to ensure your fashion
                AI investment pays off right away.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Starter Plan */}
              <Card className="relative overflow-hidden dark:bg-gray-800/50 dark:border-gray-700">
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-4 font-heading">Starter Plans</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Perfect for small fashion brands and individual designers starting with AI.
                  </p>
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold">$</span>
                      <span className="text-3xl md:text-5xl font-bold">25</span>
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300 ml-2">/month*</span>
                    </div>
                    <div className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-2">
                      Save $180 {">"} 3 months free
                    </div>
                  </div>
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">10 AI Fashion Generations / Month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">2 Fashion Collections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Basic Virtual Try-On</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">AI Style Generator</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Fashion Copy Generator</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-xs md:text-sm">
                    Start Free Trial
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">*Billed yearly</p>
                </div>
              </Card>

              {/* Professional Plan */}
              <Card className="relative overflow-hidden dark:bg-gray-800/50 dark:border-gray-700">
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-4 font-heading">Professional Plans</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Ideal for growing fashion brands and boutique retailers.
                  </p>
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold">$</span>
                      <span className="text-3xl md:text-5xl font-bold">149</span>
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300 ml-2">/month*</span>
                    </div>
                    <div className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-2">
                      Save $1,440 {">"} 3 monthsfree
                    </div>
                  </div>
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">100 AI Fashion Generations / Month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">5 Fashion Collections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Advanced Virtual Try-On</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">AI Fashion Photoshoot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Style Analytics</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-xs md:text-sm">
                    Start Free Trial
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">*Billed yearly</p>
                </div>
              </Card>

              {/* Ultimate Plan */}
              <Card className="relative overflow-hidden border-[#FF1F8E] dark:bg-gray-800/50 dark:border-[#FF1F8E]overflow-hidden border-[#FF1F8E] dark:bg-gray-800/50 dark:border-[#FF1F8E]">
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-4 font-heading">Ultimate Plans</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4">
                    For fashion enterprises and multi-brand retailers.
                  </p>
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold">$</span>
                      <span className="text-3xl md:text-5xl font-bold">359</span>
                      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300 ml-2">/month*</span>
                    </div>
                    <div className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-2">
                      Save $2,880 {">"} 3 months free
                    </div>
                  </div>
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">500 AI Fashion Generations / Month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">10 Fashion Collections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Premium Virtual Try-On</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">AI Video Generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Advanced Analytics Suite</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#FF1F8E] text-white hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-xs md:text-sm">
                    Start Free Trial
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">*Billed yearly</p>
                </div>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative overflow-hidden dark:bg-gray-800/50 dark:border-gray-700">
                <div className="p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-4 font-heading">Enterprise plan</h3>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Custom fashion AI solutions for large-scale fashion enterprises and retail chains.
                  </p>
                  <div className="mb-4 md:mb-6">
                    <div className="text-2xl md:text-3xl font-bold">Custom price</div>
                    <div className="text-sm md:text-lg mt-2">Tailored Solutions</div>
                  </div>
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Unlimited AI Generations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Custom AI Model Training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">Dedicated Fashion AI Expert</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-[#FF1F8E]" />
                      <span className="text-xs md:text-sm">API Access &amp; Integration</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 text-xs md:text-sm">
                    Contact Sales
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-heading">FAQ</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                Your Questions, Answered. Get all the details you need to maximize your TopMaj AI Fashion experience.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ai-fashion-generation" className="dark:border-gray-700">
                <AccordionTrigger className="text-sm md:text-base dark:hover:bg-gray-800/50">
                  What is AI Fashion Generation in TopMaj?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm dark:text-gray-400">
                  AI Fashion Generation in TopMaj refers to the creation of unique fashion designs, virtual try-ons, or
                  AI-powered photoshoots. Each generation uses one credit from your monthly allowance, allowing you to
                  explore countless design possibilities.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="virtual-tryon" className="dark:border-gray-700">
                <AccordionTrigger className="text-sm md:text-base dark:hover:bg-gray-800/50">
                  How does TopMaj's Virtual Try-On feature work?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm dark:text-gray-400">
                  TopMaj's Virtual Try-On uses advanced AI to realistically simulate how clothing items look on
                  different body types and poses. You can upload your own designs or use our extensive catalog, and our
                  AI will generate photorealistic results with accurate lighting, draping, and fabric physics.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ai-model-generator" className="dark:border-gray-700">
                <AccordionTrigger className="text-sm md:text-base dark:hover:bg-gray-800/50">
                  What is the AI Model Generator?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm dark:text-gray-400">
                  The AI Model Generator creates diverse, realistic AI models for your fashion designs. You can
                  customize attributes like body type, pose, and ethnicity to showcase your designs on a wide range of
                  virtual models, perfect for inclusive marketing campaigns.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ecommerce-generator" className="dark:border-gray-700">
                <AccordionTrigger className="text-sm md:text-base dark:hover:bg-gray-800/50">
                  How does the E-commerce Generator help my business?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm dark:text-gray-400">
                  TopMaj's E-commerce Generator produces high-quality product images for various fashion items, ready
                  for your online store. It can create consistent, professional product shots across your entire
                  catalog, saving time and resources on traditional photography.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="clothes-changer" className="dark:border-gray-700">
                <AccordionTrigger className="text-sm md:text-base dark:hover:bg-gray-800/50">
                  What is the Clothes Changer feature?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm dark:text-gray-400">
                  The Clothes Changer allows you to easily edit and modify existing fashion images. You can change
                  colors, patterns, or even entire garments in an image, enabling quick iterations and variations of
                  your designs without starting from scratch.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data-security" className="dark:border-gray-700">
                <AccordionTrigger className="text-sm md:text-base dark:hover:bg-gray-800/50">
                  How does TopMaj ensure the security of my designs and data?
                </AccordionTrigger>
                <AccordionContent className="text-xs md:text-sm dark:text-gray-400">
                  TopMaj prioritizes the security and confidentiality of your designs and data. We use industry-standard
                  encryption, secure cloud storage, and strict access controls. Your generated designs and uploaded
                  content are only accessible to you and those you explicitly share them with.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Product Screenshot Section */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-pink-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto max-w-6xl text-center">
            <img
              src="/placeholder.svg?height=800&width=1200"
              alt="TopMaj AI Platform Interface"
              className="rounded-lg shadow-2xl mx-auto w-full"
            />
            <div className="mt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 dark:bg-[#FF1F8E]/80 dark:hover:bg-[#FF1F8E] text-white"
                >
                  Try For Free Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </section>
    </div>
  )
}
