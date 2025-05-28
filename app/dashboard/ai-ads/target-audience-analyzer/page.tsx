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

export default function TargetAudienceAnalyzer() {
  const [brand, setBrand] = useState("")
  const [product, setProduct] = useState("")
  const [targetMarket, setTargetMarket] = useState("")
  const [generatedAnalysis, setGeneratedAnalysis] = useState("")
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
      const response = await fetch(`/api/ai-ads/target-audience-analyzer?userId=${user.id}&page=${currentPage}`)
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
    if (!brand || !product || !targetMarket) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-ads/target-audience-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brand, product, targetMarket, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedAnalysis(data.analysis)
      fetchHistory()
    } catch (error) {
      console.error("Error generating analysis:", error)
      toast({
        title: "Error",
        description: "Failed to generate analysis",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-ads/target-audience-analyzer?id=${id}&userId=${user?.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Analysis deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting analysis:", error)
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Analysis copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Target Audience Analyzer</h1>
        <p className="text-gray-600">Gain insights into your target audience.</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g., Nike" />
          </div>
          <div>
            <Label htmlFor="product">Product</Label>
            <Input
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g., Running shoes"
            />
          </div>
          <div>
            <Label htmlFor="targetMarket">Target Market</Label>
            <Input
              id="targetMarket"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="e.g., US fitness enthusiasts"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Target Audience
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedAnalysis && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Target Audience Analysis</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            {generatedAnalysis}
          </pre>
          <Button variant="outline" size="sm" onClick={() => handleCopy(generatedAnalysis)} className="mt-4">
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Analysis History</h2>
        {history.map((item) => (
          <Card key={item.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Brand: {item.brand}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Product: {item.product}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Target Market: {item.target_market}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-800 dark:text-gray-200 mt-2">{item.analysis}</p>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(item.analysis)} className="mt-2">
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
