"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function EmailAnswerGenerator() {
  const [originalEmail, setOriginalEmail] = useState("")
  const [tone, setTone] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [generatedAnswer, setGeneratedAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
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
      const response = await fetch(`/api/ai-writer/email-answer-generator?userId=${user.id}&page=${currentPage}`)
      if (!response.ok) throw new Error("Failed to fetch history")
      const { data, totalPages } = await response.json()
      setHistory(data)
      setTotalPages(totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async () => {
    if (!originalEmail) {
      toast({
        title: "Error",
        description: "Please enter the original email content",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/email-answer-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalEmail, tone, additionalInfo, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate email answer")
      }

      const { content } = await response.json()
      setGeneratedAnswer(content)
      fetchHistory()
    } catch (error) {
      console.error("Error generating email answer:", error)
      toast({
        title: "Error",
        description: "Failed to generate email answer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/ai-writer/email-answer-generator?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete email answer")
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Email answer deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting email answer:", error)
      toast({
        title: "Error",
        description: "Failed to delete email answer. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Email Answer Generator</h1>
        <p className="text-gray-600">Generate professional email responses with ease</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="originalEmail">Original Email</Label>
            <Textarea
              id="originalEmail"
              value={originalEmail}
              onChange={(e) => setOriginalEmail(e.target.value)}
              placeholder="Paste the content of the email you're responding to"
              rows={5}
            />
          </div>
          <div>
            <Label htmlFor="tone">Tone</Label>
            <Input
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="e.g., Professional, Friendly, Formal"
            />
          </div>
          <div>
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any additional points you want to address in your response"
              rows={3}
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
                Generate Email Answer
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedAnswer && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Email Answer</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            {generatedAnswer}
          </pre>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">History</h2>
        {history.map((item) => (
          <div key={item.id} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">{item.original_email}</h3>
            <p className="text-sm text-gray-600">Tone: {item.tone}</p>
            <p className="mt-2">{item.generated_answer}</p>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="mt-2">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
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
