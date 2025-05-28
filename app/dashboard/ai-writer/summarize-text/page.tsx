"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Copy, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SummarizeText() {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [length, setLength] = useState("medium")
  const { user } = useAuth()

  const fetchHistory = async (page: number) => {
    if (!user?.id) return
    console.log(`fetchHistory: Fetching history for user ${user.id}, page ${page}`)
    try {
      const response = await fetch(`/api/ai-writer/summarize-text?userId=${user.id}&page=${page}`)
      console.log(`fetchHistory: Response status: ${response.status}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`)
      }
      const data = await response.json()
      console.log(`fetchHistory: Received ${data.summaries.length} summaries`)
      setHistory(data.summaries)
      setTotalPages(Math.ceil(data.total / 5))
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: `Failed to fetch history: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchHistory(currentPage)
  }, [user, currentPage])

  const handleSummarize = async () => {
    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to summarize",
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
    console.log(`handleSummarize: Summarizing text for user ${user.id}, length: ${length}`)
    try {
      const response = await fetch("/api/ai-writer/summarize-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, text: inputText, length }),
      })
      console.log(`handleSummarize: Response status: ${response.status}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`)
      }
      const data = await response.json()
      console.log(`handleSummarize: Received summary: ${data.summary}`)
      setSummary(data.summary)
      fetchHistory(1)
      setCurrentPage(1)
    } catch (error) {
      console.error("Error generating summary:", error)
      toast({
        title: "Error",
        description: `Failed to generate summary: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (summaryId: string) => {
    if (!user?.id) return
    console.log(`handleDelete: Deleting summary ${summaryId} for user ${user.id}`)
    try {
      const response = await fetch(`/api/ai-writer/summarize-text?userId=${user.id}&summaryId=${summaryId}`, {
        method: "DELETE",
      })
      console.log(`handleDelete: Response status: ${response.status}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`)
      }
      fetchHistory(currentPage)
      toast({
        title: "Success",
        description: "Summary deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting summary:", error)
      toast({
        title: "Error",
        description: `Failed to delete summary: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Summarize Text</h1>
        <p className="text-gray-600 dark:text-gray-400">Condense large text into shorter summaries with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter the text you want to summarize"
            rows={10}
          />
          <div className="flex items-center space-x-4">
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSummarize} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Summarize
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {summary && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <p className="text-gray-800 dark:text-gray-200">{summary}</p>
          <Button className="mt-4" onClick={() => handleCopy(summary)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Summary
          </Button>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">History</h2>
        {history.map((item) => (
          <Card key={item.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Original Text:</p>
            <p className="text-gray-800 dark:text-gray-200 mb-2">{item.original_text.substring(0, 100)}...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Summary:</p>
            <p className="text-gray-800 dark:text-gray-200 mb-2">{item.summary}</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleCopy(item.summary)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
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
