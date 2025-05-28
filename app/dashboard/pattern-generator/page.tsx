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
import { Palette, Download } from "lucide-react"

export default function PatternGenerator() {
  const [generatedPatterns, setGeneratedPatterns] = useState<string[]>([])

  const handleGenerate = () => {
    // Simulating AI generation with placeholder images
    setGeneratedPatterns([
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
    ])
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pattern Generator</h1>
        <p className="text-gray-600">Create unique patterns and prints for your fashion designs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Pattern Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pattern-description" className="block mb-2">
                Pattern Description
              </Label>
              <Textarea
                id="pattern-description"
                placeholder="Describe the pattern you want to generate..."
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="pattern-style" className="block mb-2">
                Pattern Style
              </Label>
              <Select>
                <SelectTrigger id="pattern-style">
                  <SelectValue placeholder="Choose a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geometric">Geometric</SelectItem>
                  <SelectItem value="floral">Floral</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="animal-print">Animal Print</SelectItem>
                  <SelectItem value="retro">Retro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color-scheme" className="block mb-2">
                Color Scheme
              </Label>
              <Input id="color-scheme" placeholder="e.g., Pastel, Monochrome, Vibrant" />
            </div>
            <div>
              <Label htmlFor="complexity" className="block mb-2">
                Pattern Complexity
              </Label>
              <Slider id="complexity" min={1} max={10} step={1} defaultValue={[5]} className="w-full" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Options</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="repeat-type" className="block mb-2">
                Repeat Type
              </Label>
              <Select>
                <SelectTrigger id="repeat-type">
                  <SelectValue placeholder="Choose a repeat type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight Repeat</SelectItem>
                  <SelectItem value="half-drop">Half-Drop Repeat</SelectItem>
                  <SelectItem value="brick">Brick Repeat</SelectItem>
                  <SelectItem value="diamond">Diamond Repeat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scale" className="block mb-2">
                Pattern Scale
              </Label>
              <Slider id="scale" min={1} max={10} step={1} defaultValue={[5]} className="w-full" />
            </div>
            <div>
              <Label htmlFor="texture" className="block mb-2">
                Texture
              </Label>
              <Input id="texture" placeholder="e.g., Smooth, Rough, Metallic" />
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
          <h2 className="text-xl font-semibold mb-4">Generated Patterns</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedPatterns.map((pattern, index) => (
                <div key={index} className="relative group">
                  <img src={pattern} alt={`Generated Pattern ${index + 1}`} className="w-full h-auto rounded-lg" />
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
              <Palette className="w-4 h-4 mr-2" />
              Generate Patterns
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
