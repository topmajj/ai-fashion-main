import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Fashion Design",
      excerpt: "Explore how artificial intelligence is revolutionizing the fashion industry...",
    },
    {
      id: 2,
      title: "Sustainable Fashion: AI's Role in Reducing Waste",
      excerpt: "Learn how AI is helping fashion brands become more environmentally friendly...",
    },
    {
      id: 3,
      title: "Virtual Try-Ons: The Next Big Thing in E-commerce",
      excerpt: "Discover how virtual try-on technology is changing the online shopping experience...",
    },
    {
      id: 4,
      title: "AI-Powered Trend Forecasting in Fashion",
      excerpt: "Find out how AI is predicting the next big trends in fashion...",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <SiteHeader />

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">TopMaj AI Fashion Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="p-6 dark:bg-gray-800/50 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
              <Link href={`/blog/${post.id}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
