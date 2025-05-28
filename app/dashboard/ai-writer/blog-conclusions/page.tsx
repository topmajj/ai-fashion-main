"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Layout } from "@/components/layout"
import { useAuth } from "@/lib/AuthContext"
import { Sparkles, Copy, Trash2 } from "lucide-react"

export default function BlogConclusionsPage() {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("")
  const [generatedConclusion, setGeneratedConclusion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()
  const { toast } = useToast()

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
      console.log(`fetchHistory: Fetching history for user ${user.id}, page ${currentPage}`)
      const response = await fetch(`/api/ai-writer/blog-conclusions?userId=${user.id}&page=${currentPage}`)
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
    if (!topic || !tone) {
      toast({
        title: "Error",
        description: "Please enter both a topic and a tone",
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
      console.log(`handleGenerate: Generating conclusion for topic: ${topic}, tone: ${tone}`)
      const response = await fetch("/api/ai-writer/blog-conclusions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, tone, userId: user.id }),
      })

      console.log(`handleGenerate: Response status: ${response.status}`)
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`handleGenerate: HTTP error! status: ${response.status}, message:`, errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log("handleGenerate: Received data:", data)
      setGeneratedConclusion(data.conclusion)
      fetchHistory()
    } catch (error) {
      console.error("Error generating conclusion:", error)
      toast({
        title: "Error",
        description: `Failed to generate conclusion: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      console.log(`handleDelete: Deleting conclusion with id: ${id}`)
      const response = await fetch(`/api/ai-writer/blog-conclusions?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      console.log(`handleDelete: Response status: ${response.status}`)
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`handleDelete: HTTP error! status: ${response.status}, message:`, errorData)
        throw new Error(`Failed to delete conclusion: ${JSON.stringify(errorData)}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Conclusion deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting conclusion:", error)
      toast({
        title: "Error",
        description: `Failed to delete conclusion: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Conclusion copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Blog Conclusions Generator</h1>
        <p className="text-gray-600">Generate engaging blog conclusions with AI</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your blog post topic" />
          </div>
          <div>
            <Input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Enter the desired tone" />
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
                Generate Conclusion
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedConclusion && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Generated Blog Conclusion</h2>
          <p className="text-gray-700 dark:text-gray-300">{generatedConclusion}</p>
          <Button variant="outline" size="sm" onClick={() => handleCopy(generatedConclusion)} className="mt-4">
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.length > 0 ? (
          <>
            {history.map((item) => (
              <Card key={item.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Topic: {item.topic}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tone: {item.tone}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-gray-800 dark:text-gray-200 mt-2">{item.conclusion}</p>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(item.conclusion)} className="mt-2">
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
          </>
        ) : (
          <p className="text-gray-600">No history available. Generate some conclusions to see them here.</p>
        )}
      </Card>
    </Layout>
  )
}
