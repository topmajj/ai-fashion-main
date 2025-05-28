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

export default function FacebookHeadlines() {
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [tone, setTone] = useState("")
  const [numberOfHeadlines, setNumberOfHeadlines] = useState("3")
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page: number) => {
    if (!user) return
    try {
      const response = await fetch(`/api/ai-writer/facebook-headlines?userId=${user.id}&page=${page}`)
      if (!response.ok) throw new Error("Failed to fetch history")
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
  }, [user, currentPage]) // Added currentPage to dependencies

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/facebook-headlines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          keywords,
          tone,
          numberOfHeadlines: Number(numberOfHeadlines),
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate headlines")
      }

      const data = await response.json()
      setGeneratedHeadlines(data.content.split("\n").filter((line: string) => line.trim() !== ""))
      fetchHistory(1) // Refresh history after generating new headlines
      setCurrentPage(1)
    } catch (error) {
      console.error("Error generating headlines:", error)
      toast({
        title: "Error",
        description: "Failed to generate headlines. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/facebook-headlines?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete headline")
      }

      toast({
        title: "Success",
        description: "Headline deleted successfully",
      })
      fetchHistory(currentPage) // Refresh the current page after deletion
    } catch (error) {
      console.error("Error deleting headline:", error)
      toast({
        title: "Error",
        description: "Failed to delete headline. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Facebook Headlines Generator</h1>
        <p className="text-gray-600">Create attention-grabbing headlines for your Facebook posts</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the main topic of your post"
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords (optional)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter relevant keywords, separated by commas"
            />
          </div>
          <div>
            <Label htmlFor="tone">Tone (optional)</Label>
            <Input
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g., Excited, Professional, Casual"
            />
          </div>
          <div>
            <Label htmlFor="numberOfHeadlines">Number of Headlines</Label>
            <Input
              id="numberOfHeadlines"
              type="number"
              value={numberOfHeadlines}
              onChange={(e) => setNumberOfHeadlines(e.target.value)}
              min="1"
              max="5"
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
                Generate Headlines
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedHeadlines.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Facebook Headlines</h2>
          <ul className="list-disc pl-5 space-y-2">
            {generatedHeadlines.map((headline, index) => (
              <li key={index}>{headline}</li>
            ))}
          </ul>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <ul className="space-y-4">
            {history.map((item) => (
              <li key={item.id} className="border-b pb-4">
                <p className="font-semibold">{item.topic}</p>
                <p className="text-sm text-gray-600">
                  Keywords: {item.keywords || "N/A"} | Tone: {item.tone || "N/A"}
                </p>
                <p className="mt-2">{item.headlines}</p>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="mt-2">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </li>
            ))}
          </ul>
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
      )}
    </Layout>
  )
}
