"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"

export default function SeasonalIdeas() {
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([])

  const handleGenerate = () => {
    // Simulating AI generation with placeholder images
    setGeneratedIdeas([
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
    ])
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Seasonal Fashion Ideas</h1>
        <p className="text-gray-600">Get AI-powered fashion ideas and trends based on upcoming seasons</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Season Selection</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="season" className="block mb-2">
                Select Season
              </Label>
              <Select>
                <SelectTrigger id="season">
                  <SelectValue placeholder="Choose a season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="autumn">Autumn</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year" className="block mb-2">
                Year
              </Label>
              <Input id="year" type="number" placeholder="e.g., 2024" min="2023" max="2030" />
            </div>
            <div>
              <Label htmlFor="trend-focus" className="block mb-2">
                Trend Focus
              </Label>
              <Input id="trend-focus" placeholder="e.g., Sustainable, Retro, Futuristic" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customization</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="color-palette" className="block mb-2">
                Color Palette
              </Label>
              <Input id="color-palette" placeholder="e.g., Earth tones, Pastels, Neon" />
            </div>
            <div>
              <Label htmlFor="fabric-preferences" className="block mb-2">
                Fabric Preferences
              </Label>
              <Input id="fabric-preferences" placeholder="e.g., Linen, Wool, Sustainable materials" />
            </div>
            <div>
              <Label htmlFor="num-ideas" className="block mb-2">
                Number of Ideas
              </Label>
              <Slider id="num-ideas" min={3} max={12} step={3} defaultValue={[6]} className="w-full" />
            </div>
            <div>
              <Label htmlFor="additional-notes" className="block mb-2">
                Additional Notes
              </Label>
              <Textarea
                id="additional-notes"
                placeholder="Any specific requirements or preferences..."
                className="w-full"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Generated Seasonal Ideas</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generatedIdeas.map((idea, index) => (
                <img key={index} src={idea} alt={`Seasonal Idea ${index + 1}`} className="w-full h-auto rounded-lg" />
              ))}
            </div>
            <Button onClick={handleGenerate} className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Generate Seasonal Ideas
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
