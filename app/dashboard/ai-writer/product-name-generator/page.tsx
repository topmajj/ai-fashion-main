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

export default function ProductNameGenerator() {
  const [productDescription, setProductDescription] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [industry, setIndustry] = useState("")
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  const fetchHistory = async (page: number) => {
    if (!user) {
      console.log("No user found, skipping history fetch")
      return
    }

    try {
      console.log(`Fetching history for user ${user.id}, page ${page}`)
      const response = await fetch(`/api/ai-writer/product-name-generator?userId=${user.id}&page=${page}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Fetched history:", data)
      setHistory(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch generation history",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      fetchHistory(currentPage)
    }
  }, [currentPage, user]) // Added user to dependencies

  const handleGenerate = async () => {
    if (!productDescription) {
      toast({
        title: "Error",
        description: "Please enter a product description",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to generate product names",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("Generating product names with the following input:", {
        productDescription,
        targetAudience,
        industry,
      })
      const response = await fetch("/api/ai-writer/product-name-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productDescription,
          targetAudience,
          industry,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Generated product names:", data.names)
      setGeneratedNames(data.names)
      fetchHistory(1) // Refresh history after generating new names
    } catch (error) {
      console.error("Error generating product names:", error)
      toast({
        title: "Error",
        description: "Failed to generate product names",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete product names",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/ai-writer/product-name-generator?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Product name deleted successfully",
      })
      fetchHistory(currentPage) // Refresh the current page
    } catch (error) {
      console.error("Error deleting product name:", error)
      toast({
        title: "Error",
        description: "Failed to delete product name",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Product name copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Product Name Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate catchy product names with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="productDescription">Product Description</Label>
            <Textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Describe your product"
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
          <div>
            <Label htmlFor="industry">Industry (optional)</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Enter the industry"
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
                Generate Names
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedNames.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Product Names</h2>
          <ul className="space-y-2">
            {generatedNames.map((name, index) => (
              <li key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded flex justify-between items-center">
                <span className="text-gray-900 dark:text-gray-100">{name}</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(name)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generation History</h2>
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.product_description}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Target Audience: {item.target_audience || "Not specified"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Industry: {item.industry || "Not specified"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ul className="mt-2 space-y-1">
                  {item.names.map((name: string, index: number) => (
                    <li key={index} className="flex justify-between items-center bg-white dark:bg-gray-700 p-2 rounded">
                      <span className="text-gray-900 dark:text-gray-100">{name}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(name)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex justify-center space-x-2">
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </Card>
      )}
    </Layout>
  )
}
