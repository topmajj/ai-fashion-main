"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function YoutubeVideoTitle() {
  const [keywords, setKeywords] = useState("")
  const [tone, setTone] = useState("")
  const [generatedTitle, setGeneratedTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const handleGenerate = async () => {
    if (!keywords) {
      toast({
        title: "Error",
        description: "Please enter some keywords",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/youtube-video-title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords, tone, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate title")
      }

      const data = await response.json()
      setGeneratedTitle(data.content)
      toast({
        title: "Success",
        description: "YouTube video title generated successfully!",
      })
      fetchHistory()
    } catch (error) {
      console.error("Error generating title:", error)
      toast({
        title: "Error",
        description: "Failed to generate YouTube video title. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchHistory = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/ai-writer/youtube-video-title?userId=${user.id}&page=${currentPage}`)
      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }
      const data = await response.json()
      setHistory(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/youtube-video-title?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete title")
      }
      toast({
        title: "Success",
        description: "Title deleted successfully!",
      })
      fetchHistory()
    } catch (error) {
      console.error("Error deleting title:", error)
      toast({
        title: "Error",
        description: "Failed to delete title. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchHistory()
    }
  }, [user, currentPage, fetchHistory]) // Added fetchHistory to dependencies

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">YouTube Video Title Generator</h1>
        <p className="text-gray-600">Generate catchy titles for your YouTube videos</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
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
              placeholder="e.g., Catchy, Informative, Clickbaity"
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
                Generate Title
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedTitle && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated YouTube Video Title</h2>
          <p className="text-gray-700 dark:text-gray-300">{generatedTitle}</p>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    Keywords: {item.keywords} | Tone: {item.tone}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
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
      )}
    </Layout>
  )
}
