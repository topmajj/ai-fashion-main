"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/AuthContext"
import { Sparkles, Loader2 } from "lucide-react"
import Image from "next/image"

interface Pack {
  id: number
  title: string
  cover_image: string // Cover image URL
}

export default function HeadshotGenerator() {
  const { user, session } = useAuth()
  const [packs, setPacks] = useState<Pack[]>([])
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [tuneName, setTuneName] = useState("")
  const [tuneTitle, setTuneTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await fetch("/api/astria/packs", {
          headers: {
            Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch packs")
        }
        const data = await response.json()
        // Update packs state with cover images
        const updatedPacks = data.map((pack, index) => {
          const coverImage = [
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/J.%20CREW.jpg-pb6CscSUMrH3WgIcE8OwcZwNckPtHA.jpeg",
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AMERICANA.jpg-l5uBAsDrh5UOzHgqALNMDjKhmNOQnf.jpeg",
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STYLES%20FOR%20SUCESS.jpg-DjtIUDqMVJC2jve9tm8aTZXJ6vtKoh.jpeg",
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STYLISH%20PRO.jpg-EBJdvOVe7BLiw4TSNJc8RuE7YFKLQD.jpeg",
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DATING.jpg-rddteJbheWCsdKfU6NtnEvWwZ2thp5.jpeg",
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CORPORATE.jpg-6KWy51zi66NUH3KbMZ5t7cvvqd6cnY.jpeg",
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CHRISTMAS.jpg-HUoeBzk1SpKBiTlw2TgEeXrhddBpPz.jpeg",
          ][index % 7] // Cycle through the provided images
          return {
            ...pack,
            cover_image: coverImage,
          }
        })
        setPacks(updatedPacks)
      } catch (error) {
        console.error("Error fetching packs:", error)
        toast({
          title: "Error fetching packs",
          description: "Failed to load available packs. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchPacks()
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setImages(files)
  }

  const handleCreateTune = async () => {
    if (!selectedPack || images.length === 0 || !tuneName || !tuneTitle) {
      toast({
        title: "Missing information",
        description: "Please select a pack, upload images, and provide tune name and title.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("tuneName", tuneName)
      formData.append("tuneTitle", tuneTitle)
      images.forEach((image) => formData.append("images", image))

      const response = await fetch(`/api/astria/packs/${selectedPack.id}/tunes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create tune")
      }

      toast({
        title: "Tune created successfully!",
        description: "Your tune is being processed. You'll be notified when it's ready.",
      })

      // Reset form
      setSelectedPack(null)
      setImages([])
      setTuneName("")
      setTuneTitle("")
    } catch (error) {
      console.error("Error creating tune:", error)
      toast({
        title: "Error creating tune",
        description: error.message || "Failed to create tune. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Headshot Generator</h1>
        <p className="text-gray-600">Generate professional headshots with AI</p>
      </div>

      {/* Pack Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {packs.map((pack) => (
          <Card
            key={pack.id}
            className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 relative ${
              selectedPack?.id === pack.id ? "bg-gray-200 dark:bg-gray-600" : ""
            }`}
            onClick={() => setSelectedPack(pack)}
          >
            <Image
              src={pack.cover_image || "/placeholder.svg"}
              alt={pack.title}
              width={200}
              height={150}
              className="rounded-md mb-4"
            />
            <h2 className="font-semibold mb-2">{pack.title}</h2>
          </Card>
        ))}
      </div>

      {/* Tune Creation Form */}
      {selectedPack && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create Tune</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="images">Upload Images</Label>
              <Input id="images" type="file" multiple onChange={handleImageUpload} />
              <p className="text-sm text-gray-500 mt-1">Upload at least 4 images for best results.</p>
            </div>
            <div>
              <Label htmlFor="tuneName">Tune Name (e.g., man, woman)</Label>
              <Input
                id="tuneName"
                value={tuneName}
                onChange={(e) => setTuneName(e.target.value)}
                placeholder="Enter tune name"
              />
            </div>
            <div>
              <Label htmlFor="tuneTitle">Tune Title</Label>
              <Input
                id="tuneTitle"
                value={tuneTitle}
                onChange={(e) => setTuneTitle(e.target.value)}
                placeholder="Enter tune title"
              />
            </div>
            <Button onClick={handleCreateTune} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Tune...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Tune
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </Layout>
  )
}
