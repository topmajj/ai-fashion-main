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

interface ProsConsItem {
  id: string
  topic: string
  context: string
  number_of_points: number
  pros: string[]
  cons: string[]
  created_at: string
}

export default function ProsCons() {
  const [topic, setTopic] = useState("")
  const [context, setContext] = useState("")
  const [numberOfPoints, setNumberOfPoints] = useState("3")
  const [generatedProsConsItem, setGeneratedProsConsItem] = useState<ProsConsItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<ProsConsItem[]>([])
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
      const response = await fetch(`/api/ai-writer/pros-cons?userId=${user.id}&page=${currentPage}`)
      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }
      const { data, totalPages } = await response.json()
      setHistory(data)
      setTotalPages(totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch history",
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to generate pros and cons",
        variant: "destructive",
      })
      return
    }

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
      const response = await fetch("/api/ai-writer/pros-cons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, context, numberOfPoints, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate pros and cons")
      }

      const { pros, cons } = await response.json()
      setGeneratedProsConsItem({
        id: Date.now().toString(),
        topic,
        context,
        number_of_points: Number.parseInt(numberOfPoints),
        pros,
        cons,
        created_at: new Date().toISOString(),
      })
      await fetchHistory()
    } catch (error) {
      console.error("Error generating pros and cons:", error)
      toast({
        title: "Error",
        description: "Failed to generate pros and cons",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/ai-writer/pros-cons?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      await fetchHistory()
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return <Layout>Please log in to use this feature.</Layout>
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pros & Cons Generator</h1>
        <p className="text-gray-600">Generate balanced pros and cons for any topic</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the topic for pros and cons"
            />
          </div>
          <div>
            <Label htmlFor="context">Context (Optional)</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Provide any additional context"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="numberOfPoints">Number of Points</Label>
            <Input
              id="numberOfPoints"
              type="number"
              value={numberOfPoints}
              onChange={(e) => setNumberOfPoints(e.target.value)}
              min="1"
              max="5"
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
                Generate Pros & Cons
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedProsConsItem && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Pros & Cons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Pros</h3>
              <ul className="list-disc pl-5 space-y-2">
                {generatedProsConsItem.pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Cons</h3>
              <ul className="list-disc pl-5 space-y-2">
                {generatedProsConsItem.cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">History</h2>
        {history.map((item) => (
          <div key={item.id} className="mb-4 p-4 border rounded">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{item.topic}</h3>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-2">Context: {item.context || "N/A"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Pros:</h4>
                <ul className="list-disc pl-5">
                  {item.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Cons:</h4>
                <ul className="list-disc pl-5">
                  {item.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center mt-4">
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
