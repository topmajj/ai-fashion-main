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
import { Upload, Camera } from "lucide-react"

export default function AIPhotoshoot() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

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
    setGeneratedImages([
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
      "/placeholder.svg?height=512&width=512",
    ])
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Fashion Photoshoot</h1>
        <p className="text-gray-600">Generate professional fashion photographs with AI models wearing your designs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Your Design</h2>
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
                <img src={uploadedImage} alt="Uploaded Design" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Photoshoot Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="block mb-2">
                Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="Describe the style and setting for your photoshoot..."
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="num-images" className="block mb-2">
                Number of Images
              </Label>
              <Slider id="num-images" min={1} max={10} step={1} defaultValue={[4]} className="w-full" />
            </div>
            <div>
              <Label htmlFor="style" className="block mb-2">
                Photography Style
              </Label>
              <Input id="style" placeholder="e.g., Editorial, Street, Studio" />
            </div>
            <div>
              <Label htmlFor="background" className="block mb-2">
                Background
              </Label>
              <Input id="background" placeholder="e.g., Urban, Nature, Minimalist" />
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Generated Photoshoot</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {generatedImages.map((image, index) => (
                <img key={index} src={image} alt={`Generated ${index + 1}`} className="w-full h-auto rounded-lg" />
              ))}
            </div>
            <Button onClick={handleGenerate} className="w-full" disabled={!uploadedImage}>
              <Camera className="w-4 h-4 mr-2" />
              Generate Photoshoot
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
