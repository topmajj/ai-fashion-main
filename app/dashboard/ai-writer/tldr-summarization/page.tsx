"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function TLDRSummarization() {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page: number) => {
    if (!user) return
    try {
      const response = await fetch(`/api/ai-writer/tldr-summarization?userId=${user.id}&page=${page}`)
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
    if (user) {
      fetchHistory(currentPage)
    }
  }, [user, currentPage]) // Added currentPage to dependencies

  const handleSummarize = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to use this feature",
        variant: "destructive",
      })
      return
    }

    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to summarize",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/tldr-summarization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, userId: user.id }),
      })

      if (!response.ok) throw new Error("Failed to generate summary")

      const data = await response.json()
      setSummary(data.summary)
      fetchHistory(1) // Refresh history after generating new summary
      setCurrentPage(1) // Reset to first page
    } catch (error) {
      console.error("Error generating summary:", error)
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    try {
      const response = await fetch(`/api/ai-writer/tldr-summarization?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete summary")
      fetchHistory(currentPage) // Refresh current page
      toast({
        title: "Success",
        description: "Summary deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting summary:", error)
      toast({
        title: "Error",
        description: "Failed to delete summary",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">TL;DR Summarization</h1>
        <p className="text-gray-600">Generate concise summaries of long texts with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter the text you want to summarize"
            rows={10}
          />
          <Button onClick={handleSummarize} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate TL;DR
              </>
            )}
          </Button>
        </div>
      </Card>

      {summary && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">TL;DR Summary</h2>
          <p>{summary}</p>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="border-b pb-4">
                <h3 className="font-semibold">Original Text:</h3>
                <p className="mb-2">{item.original_text}</p>
                <h3 className="font-semibold">Summary:</h3>
                <p>{item.summary}</p>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="mt-2">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-2" />
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
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}
    </Layout>
  )
}
