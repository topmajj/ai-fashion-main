"use client"
import { Suspense } from "react"
import dynamic from "next/dynamic"

const FashionVideoClient = dynamic(() => import("./fashion-video-client"), { ssr: false })

export default function FashionVideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FashionVideoClient />
    </Suspense>
  )
}
