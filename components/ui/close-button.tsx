"use client"
import { X } from "lucide-react"
import { Button } from "./button"

export function CloseButton() {
  return (
    <Button variant="ghost" size="icon" className="text-gray-900 dark:text-gray-50">
      <X className="h-4 w-4" />
    </Button>
  )
}
