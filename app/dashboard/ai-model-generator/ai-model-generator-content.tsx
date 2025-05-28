"use client"

import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import AIModelGeneratorClient from "./ai-model-generator-client"

export default function AIModelGeneratorContent() {
  return (
    <ProtectedRoute>
      <Layout>
        <AIModelGeneratorClient />
      </Layout>
    </ProtectedRoute>
  )
}
