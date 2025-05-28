import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ShirtIcon as Tshirt, Zap, Building } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$25",
      description: "Perfect for small fashion brands and individual designers starting with AI.",
      features: [
        "10 AI Fashion Generations / Month",
        "2 Fashion Collections",
        "Basic Virtual Try-On",
        "AI Style Generator",
        "Fashion Copy Generator",
      ],
      icon: <Tshirt className="w-12 h-12 text-[#FF1F8E] mb-4" />,
    },
    {
      name: "Professional",
      price: "$149",
      description: "Ideal for growing fashion brands and boutique retailers.",
      features: [
        "100 AI Fashion Generations / Month",
        "5 Fashion Collections",
        "Advanced Virtual Try-On",
        "AI Fashion Photoshoot",
        "Style Analytics",
        "Priority Support",
      ],
      icon: <Zap className="w-12 h-12 text-[#FF1F8E] mb-4" />,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large-scale fashion enterprises and retail chains.",
      features: [
        "Unlimited AI Generations",
        "Custom AI Model Training",
        "Dedicated Fashion AI Expert",
        "API Access & Integration",
        "Advanced Analytics Suite",
        "24/7 Premium Support",
      ],
      icon: <Building className="w-12 h-12 text-[#FF1F8E] mb-4" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16">
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#1a1a47] to-[#373773] dark:from-pink-300 dark:to-purple-300">
            Pricing Plans for Every Fashion Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan to elevate your fashion brand with AI-powered solutions. Scale as you grow with our
            flexible pricing options.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-6 flex flex-col ${plan.popular ? "border-[#FF1F8E] border-2" : ""} dark:bg-gray-800/50 dark:border-gray-700`}
            >
              <div className="text-center mb-6">
                {plan.icon}
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="text-4xl font-bold mb-2">{plan.price}</div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#FF1F8E] flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${plan.popular ? "bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 text-white" : ""}`}>
                {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
              </Button>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#FF1F8E] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </div>
              )}
            </Card>
          ))}
        </section>

        <section className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-b border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2">What is an AI Fashion Generation?</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">
                <p>
                  An AI Fashion Generation is a single use of our AI to create a design, virtual try-on, or photoshoot.
                  Each plan comes with a set number of generations per month.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">
                <p>Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2">Do you offer a free trial?</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">
                <p>
                  Yes, we offer a 14-day free trial on our Starter and Professional plans so you can experience the
                  power of TopMaj AI Fashion.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-b border-gray-200 dark:border-gray-700">
              <AccordionTrigger className="hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2">What kind of support do you offer?</h3>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-300">
                <p>
                  We offer email support for all plans, with priority support for Professional plans and 24/7 premium
                  support for Enterprise customers.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Fashion Business?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of fashion brands already using TopMaj AI to create stunning designs and boost their sales.
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
