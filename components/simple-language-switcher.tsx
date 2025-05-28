"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import en from "@/translations/en"
import ar from "@/translations/ar"

type Locale = "en" | "ar"

// Create a context to share the language state
interface LanguageContextType {
  locale: Locale
  toggleLanguage: () => void
  isRTL: boolean
  t: (key: string) => string
}

const translations = {
  en,
  ar,
}

// Default translation function that returns the key if no translation is found
const defaultTranslate = (key: string) => key

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  toggleLanguage: () => {},
  isRTL: false,
  t: defaultTranslate,
})

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext)

// Provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  const [isClient, setIsClient] = useState(false)
  const isRTL = locale === "ar"

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)

    // Force English for initial load to prevent caching issues
    setLocale("en")

    // Then check local storage
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        // Get stored locale or default to "en"
        const storedLocale = localStorage.getItem("locale") as Locale
        // Validate the stored locale
        const validLocale = storedLocale === "ar" ? "ar" : "en"

        // Only update if different from default
        if (validLocale !== "en") {
          setLocale(validLocale)

          // Apply RTL direction if Arabic
          if (typeof document !== "undefined") {
            document.documentElement.dir = "rtl"
            document.documentElement.lang = "ar"
          }
        } else if (typeof document !== "undefined") {
          document.documentElement.dir = "ltr"
          document.documentElement.lang = "en"
        }

        console.log("Language provider initialized with locale:", validLocale)
      }
    } catch (error) {
      console.error("Error reading language from localStorage:", error)
      // In case of any error, use English
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("locale", "en")
      }
    }
  }, [])

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en"
    setLocale(newLocale)

    if (isClient) {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("locale", newLocale)
        }
      } catch (error) {
        console.error("Error saving language to localStorage:", error)
      }
    }

    // Apply RTL direction if Arabic
    if (typeof document !== "undefined") {
      if (newLocale === "ar") {
        document.documentElement.dir = "rtl"
        document.documentElement.lang = "ar"
      } else {
        document.documentElement.dir = "ltr"
        document.documentElement.lang = "en"
      }
    }

    console.log("Language switched to:", newLocale)

    // Force reload to clear any cached states
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  // Translation function
  const t = (key: string): string => {
    if (!key) return ""

    try {
      const keys = key.split(".")

      // Force use English dictionary if locale is 'en'
      const dictionary = locale === "en" ? translations.en : translations[locale]

      if (!dictionary) {
        console.warn(`No translations found for locale: ${locale}, using English`)
        return getTranslation(keys, translations.en, key)
      }

      return getTranslation(keys, dictionary, key)
    } catch (error) {
      console.error("Translation error:", error)
      return key
    }
  }

  // Helper function to get translation
  function getTranslation(keys: string[], dictionary: any, fallback: string): string {
    let value = dictionary

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k]
      } else {
        // If not found and we're already using English, return fallback
        if (dictionary === translations.en) {
          return fallback
        }

        // Try English fallback
        return getTranslation(keys, translations.en, fallback)
      }
    }

    return typeof value === "string" ? value : fallback
  }

  return <LanguageContext.Provider value={{ locale, toggleLanguage, isRTL, t }}>{children}</LanguageContext.Provider>
}

export function SimpleLanguageSwitcher() {
  const { locale, toggleLanguage } = useLanguage()

  return (
    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleLanguage}>
      <Globe className="h-5 w-5" />
      <span className="sr-only">{locale === "en" ? "Switch to Arabic" : "Switch to English"}</span>
    </Button>
  )
}
