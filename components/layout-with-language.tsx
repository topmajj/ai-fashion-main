"use client"

import { Layout } from "@/components/layout"
import { LanguageToggle } from "@/components/language-selector"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"

export function LayoutWithLanguage({ children }: { children: ReactNode }) {
  // Use state to track if the component is mounted to avoid hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to inject the language toggle into the header
  useEffect(() => {
    if (!mounted) return

    // Find the header element where we want to inject our language toggle
    const headerButtonsContainer = document.querySelector(
      "header .flex.items-center.gap-2.lg\\:gap-4.w-full.lg\\:w-auto.justify-end",
    )

    if (headerButtonsContainer) {
      // Create a container for our language toggle
      const languageToggleContainer = document.createElement("div")
      languageToggleContainer.id = "language-toggle-container"

      // Only append if it doesn't already exist
      if (!document.getElementById("language-toggle-container")) {
        // Insert the container as the first child of the header buttons container
        headerButtonsContainer.insertBefore(languageToggleContainer, headerButtonsContainer.firstChild)

        // Render the LanguageToggle component into the container
        const root = document.getElementById("language-toggle-container")
        if (root) {
          // Use a setTimeout to ensure the DOM is fully ready
          setTimeout(() => {
            // We'll use a custom event to trigger rendering from our main component
            const event = new CustomEvent("render-language-toggle")
            document.dispatchEvent(event)
          }, 0)
        }
      }
    }
  }, [mounted])

  return (
    <>
      <Layout>{children}</Layout>
      {mounted && <LanguageTogglePortal />}
    </>
  )
}

// This component will be responsible for rendering the LanguageToggle into the portal
function LanguageTogglePortal() {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Function to render the language toggle
    const renderToggle = () => {
      const toggleContainer = document.getElementById("language-toggle-container")
      if (toggleContainer) {
        setContainer(toggleContainer)
      }
    }

    // Listen for the custom event
    document.addEventListener("render-language-toggle", renderToggle)

    // Also try to render immediately
    renderToggle()

    return () => {
      document.removeEventListener("render-language-toggle", renderToggle)
    }
  }, [])

  // If we have a container, render the LanguageToggle into it using createPortal
  if (container) {
    // We'll use React's createPortal in the browser
    const { createPortal } = require("react-dom")
    return createPortal(<LanguageToggle />, container)
  }

  return null
}
