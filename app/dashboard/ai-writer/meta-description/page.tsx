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

export default function MetaDescription() {
  const [pageTitle, setPageTitle] = useState("")
  const [keywords, setKeywords] = useState("")
  const [pageContent, setPageContent] = useState("")
  const [generatedDescription, setGeneratedDescription] = useState("")
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
      const response = await fetch(`/api/ai-writer/meta-description?userId=${user.id}&page=${currentPage}`)
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
    if (!pageTitle || !pageContent) {
      toast({
        title: "Error",
        description: "Please enter a page title and content",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      if (!user?.id) {
        throw new Error("User ID is not available")
      }
      const response = await fetch("/api/ai-writer/meta-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageTitle, keywords, pageContent, userId: user.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedDescription(data.content)
      fetchHistory()
    } catch (error) {
      console.error("Error generating meta description:", error)
      toast({
        title: "Error",
        description: "Failed to generate meta description",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (!user?.id) {
        throw new Error("User ID is not available")
      }
      const response = await fetch(`/api/ai-writer/meta-description?id=${id}&userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete meta description: ${response.statusText}`)
      }

      fetchHistory()
      toast({
        title: "Success",
        description: "Meta description deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting meta description:", error)
      toast({
        title: "Error",
        description: "Failed to delete meta description",
        variant: "destructive",
      })
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Meta description copied to clipboard",
    })
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Meta Description Generator</h1>
        <p className="text-gray-600">Create SEO-friendly meta descriptions for your web pages</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="pageTitle">Page Title</Label>
            <Input
              id="pageTitle"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Enter your page title"
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords, separated by commas"
            />
          </div>
          <div>
            <Label htmlFor="pageContent">Page Content Summary</Label>
            <Textarea
              id="pageContent"
              value={pageContent}
              onChange={(e) => setPageContent(e.target.value)}
              placeholder="Enter a brief summary of your page content"
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
                Generate Meta Description
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedDescription && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Meta Description</h2>
          <p className="text-gray-700 dark:text-gray-300">{generatedDescription}</p>
          <p className="text-sm text-gray-500 mt-2">Character count: {generatedDescription.length}</p>
          <Button variant="outline" size="sm" onClick={() => handleCopy(generatedDescription)} className="mt-4">
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
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Page Title: {item.page_title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Keywords: {item.keywords}</p>
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
