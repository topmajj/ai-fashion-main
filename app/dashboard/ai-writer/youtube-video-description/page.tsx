"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function YoutubeVideoDescription() {
  const [videoTitle, setVideoTitle] = useState("")
  const [keywords, setKeywords] = useState("")
  const [tone, setTone] = useState("")
  const [generatedDescription, setGeneratedDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page = 1) => {
    if (!user) return
    try {
      const response = await fetch(`/api/ai-writer/youtube-video-description?userId=${user.id}&page=${page}`)
      if (!response.ok) throw new Error("Failed to fetch history")
      const { data, totalPages } = await response.json()
      setHistory(data)
      setTotalPages(totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch history. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user, fetchHistory]) // Added fetchHistory to dependencies

  const handleGenerate = async () => {
    if (!videoTitle) {
      toast({
        title: "Error",
        description: "Please enter a video title",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/youtube-video-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoTitle,
          keywords,
          tone,
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate description")
      }

      const { content } = await response.json()
      setGeneratedDescription(content)
      toast({
        title: "Success",
        description: "YouTube video description generated successfully!",
      })
      fetchHistory()
    } catch (error) {
      console.error("Error generating description:", error)
      toast({
        title: "Error",
        description: "Failed to generate description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/youtube-video-description?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete description")
      }

      toast({
        title: "Success",
        description: "Description deleted successfully!",
      })
      fetchHistory(currentPage)
    } catch (error) {
      console.error("Error deleting description:", error)
      toast({
        title: "Error",
        description: "Failed to delete description. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">YouTube Video Description Generator</h1>
        <p className="text-gray-600">Create compelling descriptions for your YouTube videos</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="videoTitle">Video Title</Label>
            <Input
              id="videoTitle"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter your video title"
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter relevant keywords, separated by commas"
            />
          </div>
          <div>
            <Label htmlFor="tone">Tone</Label>
            <Input
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g., Informative, Entertaining, Educational"
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
                Generate Description
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedDescription && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated YouTube Video Description</h2>
          <Textarea value={generatedDescription} readOnly className="w-full h-40" />
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {history.map((item: any) => (
              <Card key={item.id} className="p-4">
                <h3 className="font-bold">{item.video_title}</h3>
                <p className="text-sm text-gray-500">Keywords: {item.keywords}</p>
                <p className="text-sm text-gray-500">Tone: {item.tone}</p>
                <p className="mt-2">{item.description}</p>
                <Button variant="destructive" size="sm" className="mt-2" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1))
                fetchHistory(currentPage - 1)
              }}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                fetchHistory(currentPage + 1)
              }}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}
    </Layout>
  )
}
