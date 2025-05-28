"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function GrammarCorrection() {
  const [inputText, setInputText] = useState("")
  const [correctedText, setCorrectedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page = 1) => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/ai-writer/grammar-correction?userId=${user.id}&page=${page}`)
      if (!response.ok) throw new Error("Failed to fetch history")
      const { data, totalPages } = await response.json()
      setHistory(data)
      setTotalPages(totalPages)
      setCurrentPage(page)
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
      fetchHistory()
    }
  }, [user, fetchHistory]) // Added fetchHistory to dependencies

  const handleCorrect = async () => {
    if (!inputText) {
      toast({
        title: "Error",
        description: "Please enter some text to correct",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/grammar-correction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, userId: user?.id }),
      })

      if (!response.ok) throw new Error("Failed to generate correction")

      const { correctedText } = await response.json()
      setCorrectedText(correctedText)
      fetchHistory() // Refresh history after new correction
    } catch (error) {
      console.error("Error generating correction:", error)
      toast({
        title: "Error",
        description: "Failed to generate correction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/grammar-correction?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete correction")

      toast({
        title: "Success",
        description: "Correction deleted successfully",
      })
      fetchHistory(currentPage) // Refresh the current page
    } catch (error) {
      console.error("Error deleting correction:", error)
      toast({
        title: "Error",
        description: "Failed to delete correction",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Grammar Correction</h1>
        <p className="text-gray-600">Correct grammar and enhance your writing with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter the text you want to correct"
            rows={10}
          />
          <Button onClick={handleCorrect} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Correcting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Correct Grammar
              </>
            )}
          </Button>
        </div>
      </Card>

      {correctedText && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Corrected Text</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-md">{correctedText}</pre>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {history.map((item: any) => (
              <div key={item.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <h3 className="font-bold mb-2">Original Text:</h3>
                <p className="mb-4">{item.original_text}</p>
                <h3 className="font-bold mb-2">Corrected Text:</h3>
                <p className="mb-4">{item.corrected_text}</p>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={() => fetchHistory(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button onClick={() => fetchHistory(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </Card>
      )}
    </Layout>
  )
}
