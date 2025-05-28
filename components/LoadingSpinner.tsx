import { Loader2 } from "lucide-react"

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto" />
        <p className="mt-2 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}
