"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      // TODO: Handle the generated image data
      console.log("Generated image:", data)

      // Redirect to the gallery page
      router.push("/gallery")
    } catch (error) {
      console.error("Error:", error)
      // TODO: Show error message to user
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Generate Fashion Ideas</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the fashion idea you want to generate..."
          className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  )
}
