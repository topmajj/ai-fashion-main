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

export default function ProductDescription() {
  const [productName, setProductName] = useState("")
  const [productFeatures, setProductFeatures] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchHistory(1)
    }
  }, [user])

  const fetchHistory = async (page: number) => {
    if (!user?.id) return

    console.log(`fetchHistory: Fetching history for user ${user.id}, page ${page}`)
    try {
      const response = await fetch(`/api/ai-writer/product-description?userId=${user.id}&page=${page}`)
      console.log(`fetchHistory: Response status: ${response.status}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`fetchHistory: Received ${data.descriptions.length} descriptions`)
      setHistory(data.descriptions)
      setTotalPages(Math.ceil(data.total / 5))
      setCurrentPage(page)
    } catch (error) {
      console.error("fetchHistory: Error details:", error)
      toast({
        title: "Error",
        description: `Failed to fetch history: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async () => {
    if (!productName || !productFeatures) {
      toast({
        title: "Error",
        description: "Please enter the product name and features",
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    console.log(`handleGenerate: Generating description for product ${productName}`)
    try {
      const response = await fetch("/api/ai-writer/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, productFeatures, targetAudience, userId: user.id }),
      })
      console.log(`handleGenerate: Response status: ${response.status}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("handleGenerate: Description generated successfully")
      setDescription(data.description)
      await fetchHistory(1)
    } catch (error) {
      console.error("handleGenerate: Error details:", error)
      toast({
        title: "Error",
        description: `Failed to generate description: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.id) return

    console.log(`handleDelete: Deleting description ${id}`)
    try {
      const response = await fetch(`/api/ai-writer/product-description?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })
      console.log(`handleDelete: Response status: ${response.status}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("handleDelete: Description deleted successfully")
      await fetchHistory(currentPage)
      toast({
        title: "Success",
        description: "Description deleted successfully",
      })
    } catch (error) {
      console.error("handleDelete: Error details:", error)
      toast({
        title: "Error",
        description: `Failed to delete description: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Description copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Product Description Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Create compelling product descriptions with AI</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter the product name"
            />
          </div>
          <div>
            <Label htmlFor="productFeatures">Product Features</Label>
            <Textarea
              id="productFeatures"
              value={productFeatures}
              onChange={(e) => setProductFeatures(e.target.value)}
              placeholder="Enter the main features of the product"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="targetAudience">Target Audience (optional)</Label>
            <Input
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Enter the target audience"
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
                Generate Description
              </>
            )}
          </Button>
        </div>
      </Card>

      {description && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Generated Description</h2>
          <p className="text-gray-800 dark:text-gray-200">{description}</p>
          <Button className="mt-4" onClick={() => handleCopy(description)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.map((item) => (
          <Card key={item.id} className="p-4 mb-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{item.product_name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Features: {item.product_features}</p>
            {item.target_audience && (
              <p className="text-sm text-gray-600 dark:text-gray-400">Target Audience: {item.target_audience}</p>
            )}
            <p className="mt-2 text-gray-800 dark:text-gray-200">{item.description}</p>
            <div className="mt-2 flex space-x-2">
              <Button size="sm" onClick={() => handleCopy(item.description)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => fetchHistory(page)}
                variant={currentPage === page ? "default" : "outline"}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  )
}
