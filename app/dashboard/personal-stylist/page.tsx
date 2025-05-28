"use client"

import type React from "react"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { UserCircle2, Upload } from "lucide-react"

export default function PersonalAIStylist() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedOutfits, setGeneratedOutfits] = useState<string[]>([])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    // Simulating AI generation with placeholder images
    setGeneratedOutfits([
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
    ])
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Personal AI Stylist</h1>
        <p className="text-gray-600">Receive personalized fashion advice and outfit recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <Input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Label>
            </div>
            {uploadedImage && (
              <div className="mt-4">
                <img src={uploadedImage} alt="Uploaded" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
            <div>
              <Label htmlFor="body-type" className="block mb-2">
                Body Type
              </Label>
              <Input id="body-type" placeholder="e.g., Hourglass, Pear, Athletic" />
            </div>
            <div>
              <Label htmlFor="skin-tone" className="block mb-2">
                Skin Tone
              </Label>
              <Input id="skin-tone" placeholder="e.g., Fair, Medium, Dark" />
            </div>
            <div>
              <Label htmlFor="hair-color" className="block mb-2">
                Hair Color
              </Label>
              <Input id="hair-color" placeholder="e.g., Blonde, Brunette, Red" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Style Preferences</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="style-description" className="block mb-2">
                Describe Your Style
              </Label>
              <Textarea
                id="style-description"
                placeholder="e.g., Casual chic with a touch of bohemian..."
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="favorite-colors" className="block mb-2">
                Favorite Colors
              </Label>
              <Input id="favorite-colors" placeholder="e.g., Blue, Green, Earth tones" />
            </div>
            <div>
              <Label htmlFor="occasion" className="block mb-2">
                Occasion
              </Label>
              <Input id="occasion" placeholder="e.g., Work, Casual weekend, Night out" />
            </div>
            <div>
              <Label htmlFor="num-outfits" className="block mb-2">
                Number of Outfits
              </Label>
              <Slider id="num-outfits" min={1} max={8} step={1} defaultValue={[4]} className="w-full" />
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Personalized Outfit Recommendations</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedOutfits.map((outfit, index) => (
                <img key={index} src={outfit} alt={`Outfit ${index + 1}`} className="w-full h-auto rounded-lg" />
              ))}
            </div>
            <Button onClick={handleGenerate} className="w-full" disabled={!uploadedImage}>
              <UserCircle2 className="w-4 h-4 mr-2" />
              Generate Personalized Outfits
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
