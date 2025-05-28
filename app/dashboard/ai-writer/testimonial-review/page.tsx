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

export default function TestimonialReview() {
  const [productName, setProductName] = useState("")
  const [productFeatures, setProductFeatures] = useState("")
  const [customerExperience, setCustomerExperience] = useState("")
  const [generatedTestimonial, setGeneratedTestimonial] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user]) // Removed currentPage from dependencies

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/ai-writer/testimonial-review?userId=${user?.id}&page=${currentPage}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHistory(data.testimonials)
      setTotalPages(Math.ceil(data.total / 5))
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
    if (!productName || !productFeatures || !customerExperience) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-writer/testimonial-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          productFeatures,
          customerExperience,
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedTestimonial(data.testimonial)
      fetchHistory()
    } catch (error) {
      console.error("Error generating testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to generate testimonial. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/ai-writer/testimonial-review", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      toast({
        title: "Error",
        description: "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Testimonial copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Testimonial Review Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate authentic testimonials with AI</p>
      </div>

      <Card className="p-6">
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
            <Label htmlFor="productFeatures">Key Product Features</Label>
            <Textarea
              id="productFeatures"
              value={productFeatures}
              onChange={(e) => setProductFeatures(e.target.value)}
              placeholder="List the main features of the product"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="customerExperience">Customer Experience</Label>
            <Textarea
              id="customerExperience"
              value={customerExperience}
              onChange={(e) => setCustomerExperience(e.target.value)}
              placeholder="Describe the customer's experience with the product"
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
                Generate Testimonial
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedTestimonial && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Testimonial</h2>
          <blockquote className="italic border-l-4 border-gray-300 pl-4 py-2 mb-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            "{generatedTestimonial}"
          </blockquote>
          <Button onClick={() => handleCopy(generatedTestimonial)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Testimonial
          </Button>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.map((item) => (
          <Card key={item.id} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">{item.product_name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Features: {item.product_features}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Experience: {item.customer_experience}</p>
            <blockquote className="italic border-l-4 border-gray-300 pl-4 py-2 mb-2 text-gray-900 dark:text-gray-100">
              "{item.testimonial}"
            </blockquote>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleCopy(item.testimonial)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </Layout>
  )
}
