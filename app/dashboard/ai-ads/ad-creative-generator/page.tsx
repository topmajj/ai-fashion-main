"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2, Copy, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function AdCreativeGenerator() {
  const [product, setProduct] = useState("")
  const [description, setDescription] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [generatedCreative, setGeneratedCreative] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user])

  const fetchHistory = async () => {
    try {
      if (!user?.id) {
        console.error("fetchHistory: User ID is not available")
        throw new Error("User ID is not available")
      }
      const response = await fetch(`/api/ai-ads/ad-creative-generator?userId=${user.id}&page=${currentPage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
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

  const handleGenerate = async () => {
    if (!product || !description) {
      toast({
        title: "Error",
        description: "Please enter both product and description",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-ads/ad-creative-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product, description, targetAudience, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedCreative(data.creative)
      fetchHistory()
    } catch (error) {
      console.error("Error generating creative:", error)
      toast({
        title: "Error",
        description: "Failed to generate creative",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-ads/ad-creative-generator?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Creative deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting creative:", error)
      toast({
        title: "Error",
        description: "Failed to delete creative",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Creative copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ad Creative Generator</h1>
        <p className="text-gray-600">Generate eye-catching visuals for your ads.</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="product">Product/Service</Label>
            <Input
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g., Fashionable Shoes"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Comfortable and stylish shoes for everyday wear."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="targetAudience">Target Audience (optional)</Label>
            <Input
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Young professionals aged 25-35"
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
                Generate Creative
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedCreative && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Ad Creative</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            {generatedCreative}
          </pre>
          <Button variant="outline" size="sm" onClick={() => handleCopy(generatedCreative)} className="mt-4">
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
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Product: {item.product}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Description: {item.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mt-2">{item.creative}</p>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(item.creative)} className="mt-2">
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
