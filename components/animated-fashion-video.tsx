"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, Wand2, Music, Palette, Users } from "lucide-react"

const mockGeneratedVideos = [
  {
    id: 1,
    score: 98,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fashion-video-thumbnail-1-rYOdaz0YyyDR2hBEv1pIq1zNuevWuH.jpg",
  },
  {
    id: 2,
    score: 96,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fashion-video-thumbnail-2-Qkg7BdqUT1n9uUp1QUDa2BkVgUdx5F.jpg",
  },
  {
    id: 3,
    score: 94,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fashion-video-thumbnail-3-Ps62jPwvTrQyLidVnU9vLhmdjEjHwv.jpg",
  },
]

const inputCards = [
  {
    title: "Style",
    icon: Palette,
    content: {
      main: "Runway Show",
      sub: "High Fashion",
    },
    colors: ["#FF8E1F", "#FF1F8E"],
  },
  {
    title: "Models",
    icon: Users,
    content: {
      main: "Diverse Cast",
      sub: "5 Models",
    },
    colors: ["#1F8EFF", "#1FFFA0"],
  },
  {
    title: "Music",
    icon: Music,
    content: {
      main: "Electronic",
      sub: "Upbeat Tempo",
    },
    colors: ["#8E1FFF", "#FF1F8E"],
  },
  {
    title: "Duration",
    icon: Video,
    content: {
      main: "60 Seconds",
      sub: "Social Media Ready",
    },
    colors: ["#1FFF8E", "#1F8EFF"],
  },
]

export function AnimatedFashionVideo() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setProgress(0)
    setShowResults(false)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setShowResults(true)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="relative p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl">
      {/* Input Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {inputCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${card.colors[0]}, ${card.colors[1]})`,
                }}
              />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</span>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold">{card.content.main}</div>
                  <div className="text-sm text-gray-500">{card.content.sub}</div>
                </div>
              </div>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{
                  backgroundImage: `linear-gradient(to right, ${card.colors[0]}, ${card.colors[1]})`,
                }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mb-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-[#FF1F8E] to-[#FF8E1F] text-white px-8 h-14"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              "Generating Fashion Video..."
            ) : (
              <>
                Generate AI Fashion Video
                <Wand2 className="ml-2 h-5 w-5" />
              </>
            )}
            <motion.div
              className="absolute inset-0 bg-white rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: isGenerating ? 0.1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </Button>
        </motion.div>
      </div>

      {/* Generation Process */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-8"
          >
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF1F8E] to-[#FF8E1F]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Composing Scenes</span>
              <span>Rendering Models</span>
              <span>Adding Music</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">AI Generated Fashion Videos</h4>
              <p className="text-sm text-gray-500">
                Here are your AI-generated fashion videos, optimized for style and engagement
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mockGeneratedVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={`Generated Video ${video.id}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Badge className="absolute top-2 right-2 bg-white/90 text-black" variant="secondary">
                        Engagement Score: {video.score}
                      </Badge>
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                          Preview Video
                          <Video className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
