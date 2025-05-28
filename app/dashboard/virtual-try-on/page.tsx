import { Suspense } from "react"
import VirtualTryOnContent from "./virtual-try-on-content"

export default function VirtualTryOnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VirtualTryOnContent />
    </Suspense>
  )
}
