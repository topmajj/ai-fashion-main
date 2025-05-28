"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, History } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

interface BlogPostIdea {
  id: string
  topic: string
  target_audience: string
  number_of_ideas: number
  ideas: string
  created_at: string
}

export default function BlogPostIdeas() {
  const [topic, setTopic] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [numberOfIdeas, setNumberOfIdeas] = useState("5")
  const [generatedIdeas, setGeneratedIdeas] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<BlogPostIdea[]>([])
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
      const response = await fetch(`/api/ai-writer/blog-post-ideas?userId=${user?.id}&page=${currentPage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.data) {
        setHistory(data.data)
        setTotalPages(data.totalPages)
      }
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
      const response = await fetch("/api/ai-writer/blog-post-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, targetAudience, numberOfIdeas, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.ideas) {
        setGeneratedIdeas(data.ideas)
        fetchHistory()
      } else {
        throw new Error("Failed to generate ideas")
      }
    } catch (error) {
      console.error("Error generating ideas:", error)
      toast({
        title: "Error",
        description: "Failed to generate ideas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/blog-post-ideas?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Idea deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting idea:", error)
      toast({
        title: "Error",
        description: "Failed to delete idea",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Blog Post Ideas Generator</h1>
        <p className="text-gray-600">Generate creative blog post ideas with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the main topic for your blog posts"
            />
          </div>
          <div>
            <Label htmlFor="targetAudience">Target Audience (optional)</Label>
            <Input
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Enter your target audience"
            />
          </div>
          <div>
            <Label htmlFor="numberOfIdeas">Number of Ideas</Label>
            <Input
              id="numberOfIdeas"
              type="number"
              value={numberOfIdeas}
              onChange={(e) => setNumberOfIdeas(e.target.value)}
              min="1"
              max="10"
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
                Generate Ideas
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedIdeas && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Blog Post Ideas</h2>
          <div className="whitespace-pre-wrap">{generatedIdeas}</div>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <History className="mr-2" />
            Recent Generations
          </h2>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="border-b pb-4">
                <h3 className="font-semibold">{item.topic}</h3>
                <p className="text-sm text-gray-500">
                  Target Audience: {item.target_audience} | Ideas: {item.number_of_ideas}
                </p>
                <p className="text-sm text-gray-500">Generated on: {new Date(item.created_at).toLocaleString()}</p>
                <div className="mt-2 whitespace-pre-wrap">{item.ideas}</div>
                <Button variant="destructive" size="sm" className="mt-2" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
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
