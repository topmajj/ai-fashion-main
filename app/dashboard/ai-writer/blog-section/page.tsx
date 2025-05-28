"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Copy, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function BlogSection() {
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [tone, setTone] = useState("")
  const [generatedSection, setGeneratedSection] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page: number) => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/ai-writer/blog-section?userId=${user.id}&page=${page}`)
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

  useEffect(() => {
    if (user?.id) {
      fetchHistory(currentPage)
    }
  }, [user, currentPage]) // Added currentPage to dependencies

  const handleGenerate = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to generate a blog section",
        variant: "destructive",
      })
      return
    }

    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic for the blog section",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/blog-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords, tone, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedSection(data.content)
      fetchHistory(1)
      setCurrentPage(1)
    } catch (error) {
      console.error("Error generating blog section:", error)
      toast({
        title: "Error",
        description: "Failed to generate blog section",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/ai-writer/blog-section?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHistory(currentPage)
      toast({
        title: "Success",
        description: "Blog section deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting blog section:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog section",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Blog section copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Blog Section Generator</h1>
        <p className="text-gray-600">Create engaging blog sections with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the main topic for your blog section"
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
              placeholder="e.g., Professional, Casual, Humorous"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Blog Section"
            )}
          </Button>
        </div>
      </Card>

      {generatedSection && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Blog Section</h2>
          <div className="prose max-w-none">
            <p>{generatedSection}</p>
          </div>
          <Button className="mt-4" onClick={() => handleCopy(generatedSection)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.map((item) => (
          <Card key={item.id} className="mb-4 p-4">
            <h3 className="text-xl font-semibold">{item.topic}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Keywords: {item.keywords || "None"} | Tone: {item.tone || "None"}
            </p>
            <p className="mb-4">{item.content}</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleCopy(item.content)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
