"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Wand2 } from "lucide-react"

export default function StyleGenerator() {
  const [generatedStyles, setGeneratedStyles] = useState<string[]>([])

  const handleGenerate = () => {
    // Simulating AI generation with placeholder images
    setGeneratedStyles([
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
    ])
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Style Generator</h1>
        <p className="text-gray-600">Generate unique fashion styles and combinations based on your preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Style Preferences</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="style-prompt" className="block mb-2">
                Style Description
              </Label>
              <Textarea id="style-prompt" placeholder="Describe the style you're looking for..." className="w-full" />
            </div>
            <div>
              <Label htmlFor="occasion" className="block mb-2">
                Occasion
              </Label>
              <Input id="occasion" placeholder="e.g., Casual, Formal, Party" />
            </div>
            <div>
              <Label htmlFor="color-scheme" className="block mb-2">
                Color Scheme
              </Label>
              <Input id="color-scheme" placeholder="e.g., Monochrome, Pastel, Bold" />
            </div>
            <div>
              <Label htmlFor="num-styles" className="block mb-2">
                Number of Styles
              </Label>
              <Slider id="num-styles" min={1} max={8} step={1} defaultValue={[4]} className="w-full" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Options</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="body-type" className="block mb-2">
                Body Type
              </Label>
              <Input id="body-type" placeholder="e.g., Hourglass, Pear, Athletic" />
            </div>
            <div>
              <Label htmlFor="season" className="block mb-2">
                Season
              </Label>
              <Input id="season" placeholder="e.g., Summer, Winter, All-season" />
            </div>
            <div>
              <Label htmlFor="style-inspiration" className="block mb-2">
                Style Inspiration
              </Label>
              <Input id="style-inspiration" placeholder="e.g., Vintage, Minimalist, Bohemian" />
            </div>
            <div>
              <Label htmlFor="accessories" className="block mb-2">
                Accessories
              </Label>
              <Input id="accessories" placeholder="e.g., Minimal, Statement pieces, None" />
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Generated Styles</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedStyles.map((style, index) => (
                <img
                  key={index}
                  src={style}
                  alt={`Generated Style ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
            <Button onClick={handleGenerate} className="w-full">
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Styles
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
