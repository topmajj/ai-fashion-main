"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface FacebookAd {
  id: string
  prompt: string
  content: string
  created_at: string
}

export default function FacebookAdsPage() {
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<FacebookAd[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/ai-writer/facebook-ads")
      if (!response.ok) throw new Error("Failed to fetch history")
      const data = await response.json()
      setHistory(data.history)
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to fetch history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai-writer/facebook-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      if (!response.ok) throw new Error("Failed to generate ad content")
      const data = await response.json()
      setGeneratedContent(data.content)
      fetchHistory()
      toast({
        title: "Success",
        description: "Facebook ad content generated successfully!",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to generate ad content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/facebook-ads?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete ad")
      fetchHistory()
      toast({
        title: "Success",
        description: "Facebook ad deleted successfully!",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to delete ad. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Facebook Ad Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Facebook Ad</CardTitle>
            <CardDescription>Enter a prompt to generate Facebook ad content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here"
                className="mb-4"
              />
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Ad"}
              </Button>
            </form>
          </CardContent>
          {generatedContent && (
            <CardFooter>
              <Textarea value={generatedContent} readOnly className="w-full h-40" />
            </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generation History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p>No history available.</p>
            ) : (
              history.map((ad) => (
                <Card key={ad.id} className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Prompt: {ad.prompt}</CardTitle>
                    <CardDescription>{new Date(ad.created_at).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{ad.content}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="destructive" onClick={() => handleDelete(ad.id)}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
