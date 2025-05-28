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

export default function YoutubeVideoTag() {
  const [keywords, setKeywords] = useState("")
  const [generatedTags, setGeneratedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page: number) => {
    if (!user) return
    try {
      const response = await fetch(`/api/ai-writer/youtube-video-tag?userId=${user.id}&page=${page}`)
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please log in to view your history.",
            variant: "destructive",
          })
          return
        }
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

  useEffect(() => {
    if (user) {
      fetchHistory(currentPage)
    }
  }, [user, currentPage, fetchHistory]) // Added fetchHistory to dependencies

  const handleGenerate = async () => {
    if (!keywords) {
      toast({
        title: "Error",
        description: "Please enter some keywords",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to generate tags",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/youtube-video-tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keywords, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate tags")
      }

      const data = await response.json()
      setGeneratedTags(data.tags)
      fetchHistory(1) // Refresh history after generating new tags
      setCurrentPage(1)
    } catch (error) {
      console.error("Error generating tags:", error)
      toast({
        title: "Error",
        description: "Failed to generate tags. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    try {
      const response = await fetch(`/api/ai-writer/youtube-video-tag?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete tags")
      }
      fetchHistory(currentPage)
      toast({
        title: "Success",
        description: "Tags deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting tags:", error)
      toast({
        title: "Error",
        description: "Failed to delete tags. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">YouTube Video Tag Generator</h1>
        <p className="text-gray-600">Generate relevant tags for your YouTube videos</p>
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
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Tags
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedTags.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated YouTube Video Tags</h2>
          <div className="flex flex-wrap gap-2">
            {generatedTags.map((tag, index) => (
              <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Keywords: {item.keywords}</h3>
                    <p className="text-sm text-gray-500">Created at: {new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
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
