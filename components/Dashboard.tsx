"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Layout } from "@/components/layout"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/AuthContext"
import { ShirtIcon as Tshirt } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const fashionTools = [
    {
      title: "Virtual Try-On",
      description: "Upload your photo and try on AI-generated fashion items instantly",
      icon: <Tshirt className="w-6 h-6" />,
      color: "from-pink-500 to-red-500",
      isNew: true,
      path: "/dashboard/virtual-try-on",
    },
    // Add other fashion tools here
  ]

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
        <p className="text-gray-600">Explore our AI-powered fashion tools</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fashionTools.map((tool, index) => (
          <Card
            key={index}
            className="relative overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
          >
            <Link href={tool.path} className="block p-6">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4`}
              >
                <div className="text-white">{tool.icon}</div>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{tool.title}</h3>
                {tool.isNew && (
                  <span className="px-2 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">NEW</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{tool.description}</p>
            </Link>
          </Card>
        ))}
      </div>
    </Layout>
  )
}
