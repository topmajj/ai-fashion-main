"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface FacebookAdPlan {
  id: string
  prompt: string
  plan: string
  created_at: string
}

export default function FacebookAdsPlanPage() {
  const [prompt, setPrompt] = useState("")
  const [generatedPlan, setGeneratedPlan] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<FacebookAdPlan[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/ai-writer/facebook-ads-plan")
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
      const response = await fetch("/api/ai-writer/facebook-ads-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      if (!response.ok) throw new Error("Failed to generate Facebook ad plan")
      const data = await response.json()
      setGeneratedPlan(data.plan)
      fetchHistory()
      toast({
        title: "Success",
        description: "Facebook ad plan generated successfully!",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to generate Facebook ad plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/ai-writer/facebook-ads-plan?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete Facebook ad plan")
      fetchHistory()
      toast({
        title: "Success",
        description: "Facebook ad plan deleted successfully!",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to delete Facebook ad plan. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Facebook Ads Plan Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Facebook Ads Plan</CardTitle>
            <CardDescription>
              Enter details about your business and target audience to generate a Facebook ads plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your business details and target audience"
                className="mb-4"
              />
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Plan"}
              </Button>
            </form>
          </CardContent>
          {generatedPlan && (
            <CardFooter>
              <Textarea value={generatedPlan} readOnly className="w-full h-40" />
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
              history.map((plan) => (
                <Card key={plan.id} className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Prompt: {plan.prompt}</CardTitle>
                    <CardDescription>{new Date(plan.created_at).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{plan.plan}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="destructive" onClick={() => handleDelete(plan.id)}>
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
