"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function NewsletterGenerator() {
  const [topic, setTopic] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [callToAction, setCallToAction] = useState("")
  const [generatedNewsletter, setGeneratedNewsletter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page = 1) => {
    try {
      const response = await fetch(`/api/ai-writer/newsletter-generator?userId=${user?.id}&page=${page}`)
      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }
      const data = await response.json()
      setHistory(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch history. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchHistory()
    }
  }, [user?.id, fetchHistory]) // Added fetchHistory to dependencies

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
      const response = await fetch("/api/ai-writer/newsletter-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          targetAudience,
          callToAction,
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate newsletter")
      }

      const data = await response.json()
      setGeneratedNewsletter(data.content)
      toast({
        title: "Success",
        description: "Newsletter generated successfully",
      })
      fetchHistory() // Refresh history after generation
    } catch (error) {
      console.error("Error generating newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to generate newsletter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/newsletter-generator?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete newsletter")
      }
      toast({
        title: "Success",
        description: "Newsletter deleted successfully",
      })
      fetchHistory() // Refresh history after deletion
    } catch (error) {
      console.error("Error deleting newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to delete newsletter. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Newsletter Generator</h1>
        <p className="text-gray-600">Generate engaging newsletters with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the main topic of your newsletter"
            />
          </div>
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Fashion Enthusiasts, Tech Professionals"
            />
          </div>
          <div>
            <Label htmlFor="callToAction">Call to Action</Label>
            <Input
              id="callToAction"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="e.g., Visit our website, Shop now, Learn more"
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
                Generate Newsletter
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedNewsletter && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Newsletter</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedNewsletter }} />
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">History</h2>
          <div className="space-y-4">
            {history.map((item: any) => (
              <div key={item.id} className="border-b pb-4">
                <h3 className="font-semibold">{item.topic}</h3>
                <p className="text-sm text-gray-500">Target Audience: {item.target_audience}</p>
                <p className="text-sm text-gray-500">Call to Action: {item.call_to_action}</p>
                <div className="mt-2 flex justify-between items-center">
                  <Button variant="outline" onClick={() => setGeneratedNewsletter(item.content)}>
                    View
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                  fetchHistory(currentPage - 1)
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  fetchHistory(currentPage + 1)
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      )}
    </Layout>
  )
}
