"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Copy, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function ArticleGenerator() {
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [wordCount, setWordCount] = useState("500")
  const [generatedArticle, setGeneratedArticle] = useState("")
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
    if (!user?.id) return

    try {
      const response = await fetch(`/api/ai-writer/article-generator?userId=${user.id}&page=${currentPage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHistory(data.articles)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch article history",
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic for the article",
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to generate articles",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/article-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, keywords, wordCount, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedArticle(data.article)
      fetchHistory()
    } catch (error) {
      console.error("Error generating article:", error)
      toast({
        title: "Error",
        description: "Failed to generate article",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return

    try {
      const response = await fetch("/api/ai-writer/article-generator", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Article deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Article copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Article Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate unique articles on any topic</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the article topic"
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords (optional)</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords, separated by commas"
            />
          </div>
          <div>
            <Label htmlFor="wordCount">Word Count</Label>
            <Input
              id="wordCount"
              type="number"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              placeholder="Enter desired word count"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Article"
            )}
          </Button>
        </div>
      </Card>

      {generatedArticle && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Article</h2>
          <div className="prose max-w-none dark:prose-invert">
            <Textarea value={generatedArticle} readOnly className="w-full h-64 p-2 border rounded" />
          </div>
          <Button onClick={() => handleCopy(generatedArticle)} className="mt-4" variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy Article
          </Button>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.map((item) => (
          <Card key={item.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.topic}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Keywords: {item.keywords || "None"}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Word Count: {item.word_count}</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => handleCopy(item.article)} variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleDelete(item.id)} variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        <div className="flex justify-center mt-4 space-x-2">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </Button>
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
