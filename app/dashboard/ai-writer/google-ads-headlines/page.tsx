"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Copy, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function GoogleAdsHeadlines() {
  const [productName, setProductName] = useState("")
  const [keyFeatures, setKeyFeatures] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [numberOfHeadlines, setNumberOfHeadlines] = useState("3")
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([])
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
      const response = await fetch(`/api/ai-writer/google-ads-headlines?userId=${user.id}&page=${currentPage}`)
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
    if (!productName || !keyFeatures || !targetAudience || !numberOfHeadlines) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
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
      console.log(`handleGenerate: Generating headlines for product: ${productName}`)
      const response = await fetch("/api/ai-writer/google-ads-headlines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productName, keyFeatures, targetAudience, numberOfHeadlines, userId: user.id }),
      })

      console.log(`handleGenerate: Response status: ${response.status}`)
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`handleGenerate: HTTP error! status: ${response.status}, message:`, errorData)
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      console.log("handleGenerate: Received data:", data)
      setGeneratedHeadlines(data.headlines)
      fetchHistory()
    } catch (error) {
      console.error("Error generating headlines:", error)
      toast({
        title: "Error",
        description: `Failed to generate headlines: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      console.log(`handleDelete: Deleting headline with id: ${id}`)
      const response = await fetch(`/api/ai-writer/google-ads-headlines?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      console.log(`handleDelete: Response status: ${response.status}`)
      if (!response.ok) {
        const errorData = await response.json()
        console.error(`handleDelete: HTTP error! status: ${response.status}, message:`, errorData)
        throw new Error(`Failed to delete headline: ${JSON.stringify(errorData)}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Headline deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting headline:", error)
      toast({
        title: "Error",
        description: `Failed to delete headline: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Headline copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Google Ads Headlines Generator</h1>
        <p className="text-gray-600">Create compelling headlines for your Google Ads</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter your product or service name"
            />
          </div>
          <div>
            <Label htmlFor="keyFeatures">Key Features</Label>
            <Textarea
              id="keyFeatures"
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              placeholder="Enter key features, separated by commas"
              rows={3}
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
            <Label htmlFor="numberOfHeadlines">Number of Headlines</Label>
            <Input
              id="numberOfHeadlines"
              type="number"
              value={numberOfHeadlines}
              onChange={(e) => setNumberOfHeadlines(e.target.value)}
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
                Generate Headlines
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedHeadlines.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Google Ads Headlines</h2>
          <ul className="list-disc pl-5 space-y-2">
            {generatedHeadlines.map((headline, index) => (
              <li key={index}>{headline}</li>
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
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Product: {item.product_name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Target Audience: {item.target_audience}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mt-2">{item.content}</p>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(item.content)} className="mt-2">
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
