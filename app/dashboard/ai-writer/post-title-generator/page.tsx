"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Copy, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function PostTitleGenerator() {
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [brevity, setBrevity] = useState("medium")
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user])

  const fetchHistory = async () => {
    try {
      if (!user?.id) {
        console.error("fetchHistory: User ID is not available")
        throw new Error("User ID is not available")
      }
      console.log(`fetchHistory: Fetching history for user ${user.id}, page ${currentPage}`)
      const response = await fetch(`/api/ai-writer/post-title-generator?userId=${user.id}&page=${currentPage}`)
      console.log(`fetchHistory: Response status: ${response.status}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`fetchHistory: HTTP error! status: ${response.status}, message: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      const data = await response.json()
      console.log("fetchHistory: Received data:", data)
      setHistory(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: `Failed to fetch history: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      if (!user?.id) {
        console.error("handleGenerate: User ID is not available")
        throw new Error("User ID is not available")
      }
      console.log(`handleGenerate: Generating titles for topic: ${topic}, keywords: ${keywords}, brevity: ${brevity}`)
      const response = await fetch("/api/ai-writer/post-title-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, keywords, brevity, userId: user.id }),
      })

      console.log(`handleGenerate: Response status: ${response.status}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`handleGenerate: HTTP error! status: ${response.status}, message: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log("handleGenerate: Received data:", data)
      setGeneratedTitles(data.titles)
      fetchHistory()
    } catch (error) {
      console.error("Error generating titles:", error)
      toast({
        title: "Error",
        description: `Failed to generate titles: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (!user?.id) {
        console.error("handleDelete: User ID is not available")
        throw new Error("User ID is not available")
      }
      console.log(`handleDelete: Deleting title with id: ${id}`)
      const response = await fetch(`/api/ai-writer/post-title-generator?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      console.log(`handleDelete: Response status: ${response.status}`)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`handleDelete: HTTP error! status: ${response.status}, message: ${errorText}`)
        throw new Error(`Failed to delete title: ${errorText}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Title deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting title:", error)
      toast({
        title: "Error",
        description: `Failed to delete title: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Title copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post Title Generator</h1>
        <p className="text-gray-600">Generate captivating post titles with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your topic" />
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
            <Label htmlFor="brevity">Brevity</Label>
            <Select value={brevity} onValueChange={setBrevity}>
              <SelectTrigger>
                <SelectValue placeholder="Select brevity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
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
                Generate Titles
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedTitles.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Titles</h2>
          <ul className="space-y-2">
            {generatedTitles.map((title, index) => (
              <li key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded flex justify-between items-center">
                <span className="text-gray-900 dark:text-gray-100">{title}</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(title)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.map((item) => (
          <Card key={item.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Topic: {item.topic}</h3>
                {item.keywords && <p className="text-sm text-gray-600 dark:text-gray-400">Keywords: {item.keywords}</p>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <ul className="space-y-1">
              {item.titles.map((title: string, index: number) => (
                <li key={index} className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                  <span>{title}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(title)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
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
