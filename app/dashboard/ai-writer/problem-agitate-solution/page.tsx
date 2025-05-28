"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Copy, Trash } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

interface PASFramework {
  id: string
  problem: string
  target_audience: string
  solution: string
  generated_content: string
  created_at: string
}

export default function ProblemAgitateSolution() {
  const [problem, setProblem] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [solution, setSolution] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<PASFramework[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page: number) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/ai-writer/problem-agitate-solution?userId=${user.id}&page=${page}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHistory(data.data)
      setTotalPages(Math.ceil(data.count / 5))
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
    fetchHistory(currentPage)
  }, [currentPage, user?.id])

  const handleGenerate = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to generate content.",
        variant: "destructive",
      })
      return
    }

    if (!problem || !solution) {
      toast({
        title: "Error",
        description: "Please fill in the problem and solution fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/problem-agitate-solution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem, targetAudience, solution, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedContent(data.generatedContent)
      fetchHistory(1)
      setCurrentPage(1)
    } catch (error) {
      console.error("Error generating PAS framework:", error)
      toast({
        title: "Error",
        description: "Failed to generate PAS framework. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/ai-writer/problem-agitate-solution?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "PAS framework deleted successfully.",
      })
      fetchHistory(currentPage)
    } catch (error) {
      console.error("Error deleting PAS framework:", error)
      toast({
        title: "Error",
        description: "Failed to delete PAS framework. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Problem Agitate Solution Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Create compelling PAS content with AI</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="problem">Problem</Label>
            <Input
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the problem your audience faces"
            />
          </div>
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Describe your target audience"
            />
          </div>
          <div>
            <Label htmlFor="solution">Solution</Label>
            <Textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Describe your solution to the problem"
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
                Generate PAS Content
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedContent && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Generated PAS Content</h2>
          <div className="prose max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded">{generatedContent}</pre>
          </div>
          <Button className="mt-4" onClick={() => handleCopy(generatedContent)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </Card>
      )}

      <h2 className="text-2xl font-bold mb-4">Generation History</h2>
      {history.map((item) => (
        <Card key={item.id} className="p-6 mb-4 bg-gray-50 dark:bg-gray-800">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{item.problem}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Target Audience: {item.target_audience}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Solution: {item.solution}</p>
          <pre className="whitespace-pre-wrap bg-white dark:bg-gray-700 p-4 rounded text-gray-800 dark:text-gray-200 mb-4">
            {item.generated_content}
          </pre>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleCopy(item.generated_content)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(item.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </Card>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </Layout>
  )
}
