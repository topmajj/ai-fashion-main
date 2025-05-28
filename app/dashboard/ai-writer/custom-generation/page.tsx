"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function CustomGeneration() {
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page: number) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/ai-writer/custom-generation?userId=${user.id}&page=${page}`)
      if (!response.ok) throw new Error("Failed to fetch history")
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

  useEffect(() => {
    if (user?.id) {
      fetchHistory(currentPage)
    }
  }, [user, currentPage, fetchHistory]) // Added fetchHistory to dependencies

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/custom-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      fetchHistory(1) // Refresh history after generating new content
      setCurrentPage(1) // Reset to first page
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/ai-writer/custom-generation?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete item")

      toast({
        title: "Success",
        description: "Item deleted successfully",
      })

      fetchHistory(currentPage) // Refresh the current page
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Custom Generation</h1>
        <p className="text-gray-600">Generate any type of text content with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here"
              rows={5}
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
                Generate Content
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedContent && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            {generatedContent}
          </pre>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="border p-4 rounded-md">
                <h3 className="font-bold">Prompt:</h3>
                <p>{item.prompt}</p>
                <h3 className="font-bold mt-2">Generated Content:</h3>
                <p>{item.content}</p>
                <Button variant="destructive" size="sm" className="mt-2" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
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
