"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Copy, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function InstagramCaptions() {
  const [imageDescription, setImageDescription] = useState("")
  const [mood, setMood] = useState("")
  const [brandVoice, setBrandVoice] = useState("")
  const [generatedCaption, setGeneratedCaption] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user]) // Removed currentPage from dependencies

  const fetchHistory = async () => {
    try {
      if (!user?.id) {
        console.error("fetchHistory: User ID is not available")
        throw new Error("User ID is not available")
      }
      const response = await fetch(`/api/ai-writer/instagram-captions?userId=${user.id}&page=${currentPage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHistory(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch history",
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async () => {
    if (!imageDescription) {
      toast({
        title: "Error",
        description: "Please enter an image description",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/instagram-captions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageDescription, mood, brandVoice, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedCaption(data.caption)
      fetchHistory()
    } catch (error) {
      console.error("Error generating caption:", error)
      toast({
        title: "Error",
        description: "Failed to generate caption",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/instagram-captions?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Caption deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting caption:", error)
      toast({
        title: "Error",
        description: "Failed to delete caption",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Caption copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Instagram Captions Generator</h1>
        <p className="text-gray-600">Create engaging Instagram captions with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="imageDescription">Image Description</Label>
            <Textarea
              id="imageDescription"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Describe the image you're posting"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="mood">Mood</Label>
            <Input
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., Joyful, Reflective, Energetic"
            />
          </div>
          <div>
            <Label htmlFor="brandVoice">Brand Voice (optional)</Label>
            <Input
              id="brandVoice"
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              placeholder="Describe your brand's voice"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Caption
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedCaption && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Instagram Caption</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            {generatedCaption}
          </pre>
          <Button variant="outline" size="sm" onClick={() => handleCopy(generatedCaption)} className="mt-4">
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.map((item) => (
          <Card key={item.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Image Description: {item.topic}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mood: {item.mood}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mt-2">{item.caption}</p>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(item.caption)} className="mt-2">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </Card>
        ))}
        <div className="flex justify-between mt-4">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </Card>
    </Layout>
  )
}
