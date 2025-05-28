"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function TwoPieceModelGenerator() {
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [mask1, setMask1] = useState<File | null>(null)
  const [mask2, setMask2] = useState<File | null>(null)
  const [gender, setGender] = useState("")
  const [country, setCountry] = useState("")
  const [age, setAge] = useState("")
  const [generatedImageUrl, setGeneratedImageUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const handleGenerate = async () => {
    if (!image1 || !image2 || !mask1 || !mask2 || !gender || !country || !age) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("image", image1)
    formData.append("image2", image2)
    formData.append("mask", mask1)
    formData.append("mask2", mask2)
    formData.append("gender", gender)
    formData.append("country", country)
    formData.append("age", age)
    formData.append("pose", "pose1")

    try {
      const response = await fetch("/api/generate-two-piece-model", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setGeneratedImageUrl(data.imageUrl)
      toast({
        title: "Success",
        description: "Two-piece model generated successfully!",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="image1">First Clothing Image</Label>
        <Input id="image1" type="file" onChange={(e) => handleImageUpload(e, setImage1)} />
      </div>
      <div>
        <Label htmlFor="image2">Second Clothing Image</Label>
        <Input id="image2" type="file" onChange={(e) => handleImageUpload(e, setImage2)} />
      </div>
      <div>
        <Label htmlFor="mask1">First Mask Image</Label>
        <Input id="mask1" type="file" onChange={(e) => handleImageUpload(e, setMask1)} />
      </div>
      <div>
        <Label htmlFor="mask2">Second Mask Image</Label>
        <Input id="mask2" type="file" onChange={(e) => handleImageUpload(e, setMask2)} />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select onValueChange={setGender}>
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="man">Man</SelectItem>
            <SelectItem value="woman">Woman</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g., France" />
      </div>
      <div>
        <Label htmlFor="age">Age</Label>
        <Input id="age" type="number" min="20" max="70" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Two-Piece Model"}
      </Button>
      {generatedImageUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Generated Model:</h3>
          <img
            src={generatedImageUrl || "/placeholder.svg"}
            alt="Generated two-piece model"
            className="max-w-full h-auto"
          />
        </div>
      )}
    </div>
  )
}
