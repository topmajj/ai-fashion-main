"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Copy, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function InstagramHashtags() {
  const [topic, setTopic] = useState("")
  const [niche, setNiche] = useState("")
  const [numberOfHashtags, setNumberOfHashtags] = useState("15")
  const [generatedHashtags, setGeneratedHashtags] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
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
      if (!user?.id) {
        console.error("fetchHistory: User ID is not available")
        throw new Error("User ID is not available")
      }
      console.log(`fetchHistory: Fetching history for user ${user.id}, page ${currentPage}`)
      const response = await fetch(`/api/ai-writer/instagram-hashtags?userId=${user.id}&page=${currentPage}`)
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
      console.log(
        `handleGenerate: Generating hashtags for topic: ${topic}, niche: ${niche}, number: ${numberOfHashtags}`,
      )
      const response = await fetch("/api/ai-writer/instagram-hashtags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, niche, numberOfHashtags, userId: user.id }),
      })

      console.log(`handleGenerate: Response status: ${response.status}`)
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`handleGenerate: HTTP error! status: ${response.status}, message:`, errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log("handleGenerate: Received data:", data)
      setGeneratedHashtags(data.hashtags)
      fetchHistory()
    } catch (error) {
      console.error("Error generating hashtags:", error)
      toast({
        title: "Error",
        description: `Failed to generate hashtags: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      console.log(`handleDelete: Deleting hashtags with id: ${id}`)
      const response = await fetch(`/api/ai-writer/instagram-hashtags?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      console.log(`handleDelete: Response status: ${response.status}`)
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`handleDelete: HTTP error! status: ${response.status}, message:`, errorData)
        throw new Error(`Failed to delete hashtags: ${JSON.stringify(errorData)}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Hashtags deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting hashtags:", error)
      toast({
        title: "Error",
        description: `Failed to delete hashtags: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Hashtags copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Instagram Hashtags Generator</h1>
        <p className="text-gray-600">Generate relevant hashtags for your Instagram posts</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your hashtag topic"
            />
          </div>
          <div>
            <Label htmlFor="niche">Niche (optional)</Label>
            <Input
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Enter your specific niche"
            />
          </div>
          <div>
            <Label htmlFor="numberOfHashtags">Number of Hashtags</Label>
            <Input
              id="numberOfHashtags"
              type="number"
              value={numberOfHashtags}
              onChange={(e) => setNumberOfHashtags(e.target.value)}
              min="1"
              max="30"
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
                Generate Hashtags
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedHashtags && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Instagram Hashtags</h2>
          <p className="text-gray-700 dark:text-gray-300">{generatedHashtags}</p>
          <Button variant="outline" size="sm" onClick={() => handleCopy(generatedHashtags)} className="mt-4">
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.map((item) => (
          <Card key={item.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Topic: {item.topic}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Niche: {item.niche || "N/A"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Number of Hashtags: {item.number_of_hashtags}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mt-2">{item.hashtags.join(", ")}</p>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(item.hashtags.join(", "))} className="mt-2">
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
      </Card>
    </Layout>
  )
}
