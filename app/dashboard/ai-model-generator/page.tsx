import { Suspense } from "react"
import AIModelGeneratorContent from "./ai-model-generator-content"

export default function AIModelGeneratorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIModelGeneratorContent />
    </Suspense>
  )
}
