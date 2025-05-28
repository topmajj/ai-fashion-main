"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { AnimatedAIWriter } from "./animated-ai-writer"

export function AIWriter() {
  return (
    <section className="py-12 px-4">
      <Card className="max-w-[1200px] mx-auto rounded-3xl overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl">
        <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Left Column - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-[#FF1F8E] text-2xl font-semibold mb-4">AI-Powered Fashion Content Creation</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Craft compelling fashion content{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF1F8E] to-[#FF8E1F]">
                  5x faster
                </span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Generate engaging product descriptions, blog posts, and marketing copy for your fashion brand. Our AI
                writer understands fashion trends and brand voice to create content that resonates with your audience.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "SEO-optimized product descriptions",
                  "Trend-aware blog post generation",
                  "Multilingual content creation",
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      <Sparkles className="h-4 w-4" />
                    </Badge>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-[#FF1F8E] hover:bg-[#FF1F8E]/90 text-white px-8">
                  Start Writing Now
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Process Visualization */}
          <AnimatedAIWriter />
        </div>
      </Card>
    </section>
  )
}
