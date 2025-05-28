"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function BlogConclusion() {
  const [blogTitle, setBlogTitle] = useState("")
  const [mainPoints, setMainPoints] = useState("")
  const [callToAction, setCallToAction] = useState("")
  const [generatedConclusion, setGeneratedConclusion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleGenerate = async () => {
    if (!blogTitle || !mainPoints) {
      toast({
        title: "Error",
        description: "Please enter a blog title and main points",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // TODO: Implement API call to generate blog conclusion
    // For now, we'll just simulate a delay and return a dummy conclusion
    setTimeout(() => {
      setGeneratedConclusion(
        `In conclusion, we've explored the fascinating world of ${blogTitle} and uncovered some valuable insights. We've discussed ${mainPoints}, which are crucial aspects to consider. By implementing these strategies, you'll be well on your way to mastering ${blogTitle} and reaping its benefits. Remember, the journey doesn't end here – continue to explore, learn, and grow in your understanding of this topic. ${callToAction} Don't hesitate to share your thoughts and experiences in the comments below. Together, we can create a community of knowledge and support around ${blogTitle}. Thank you for joining us on this enlightening journey!`,
      )
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Blog Conclusion Generator</h1>
        <p className="text-gray-600">Create impactful blog conclusions with AI</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="blogTitle">Blog Title</Label>
            <Input
              id="blogTitle"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Enter your blog post title"
            />
          </div>
          <div>
            <Label htmlFor="mainPoints">Main Points</Label>
            <Textarea
              id="mainPoints"
              value={mainPoints}
              onChange={(e) => setMainPoints(e.target.value)}
              placeholder="Enter the main points discussed in your blog post"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="callToAction">Call to Action (optional)</Label>
            <Input
              id="callToAction"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="e.g., Subscribe to our newsletter, Try our product"
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
                Generate Conclusion
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedConclusion && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Generated Blog Conclusion</h2>
          <p className="text-gray-700 dark:text-gray-300">{generatedConclusion}</p>
        </Card>
      )}
    </Layout>
  )
}
