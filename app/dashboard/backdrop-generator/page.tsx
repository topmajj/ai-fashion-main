"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image, Download } from "lucide-react"

export default function BackdropGenerator() {
  const [generatedBackdrops, setGeneratedBackdrops] = useState<string[]>([])

  const handleGenerate = () => {
    // Simulating AI generation with placeholder images
    setGeneratedBackdrops([
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
    ])
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Fashion Backdrop Generator</h1>
        <p className="text-gray-600">Generate professional backdrops for your fashion photography</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Backdrop Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="backdrop-description" className="block mb-2">
                Backdrop Description
              </Label>
              <Textarea
                id="backdrop-description"
                placeholder="Describe the backdrop you want to generate..."
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="backdrop-style" className="block mb-2">
                Backdrop Style
              </Label>
              <Select>
                <SelectTrigger id="backdrop-style">
                  <SelectValue placeholder="Choose a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="futuristic">Futuristic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color-scheme" className="block mb-2">
                Color Scheme
              </Label>
              <Input id="color-scheme" placeholder="e.g., Neutral, Bold, Pastel" />
            </div>
            <div>
              <Label htmlFor="mood" className="block mb-2">
                Mood
              </Label>
              <Input id="mood" placeholder="e.g., Elegant, Edgy, Romantic" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Options</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lighting" className="block mb-2">
                Lighting
              </Label>
              <Select>
                <SelectTrigger id="lighting">
                  <SelectValue placeholder="Choose lighting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                  <SelectItem value="low-key">Low Key</SelectItem>
                  <SelectItem value="high-key">High Key</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="texture" className="block mb-2">
                Texture
              </Label>
              <Input id="texture" placeholder="e.g., Smooth, Rough, Fabric" />
            </div>
            <div>
              <Label htmlFor="props" className="block mb-2">
                Props (optional)
              </Label>
              <Input id="props" placeholder="e.g., Plants, Furniture, Abstract shapes" />
            </div>
            <div>
              <Label htmlFor="num-variations" className="block mb-2">
                Number of Variations
              </Label>
              <Slider id="num-variations" min={1} max={8} step={1} defaultValue={[4]} className="w-full" />
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Generated Backdrops</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {generatedBackdrops.map((backdrop, index) => (
                <div key={index} className="relative group">
                  <img src={backdrop} alt={`Generated Backdrop ${index + 1}`} className="w-full h-auto rounded-lg" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleGenerate} className="w-full">
              <Image className="w-4 h-4 mr-2" />
              Generate Backdrops
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
