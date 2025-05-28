"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language, I18nContextType } from "@/types/i18n"
import en from "@/translations/en"
import ar from "@/translations/ar"

const translations = {
  en,
  ar,
}

const defaultLocale: Language = "en"

export const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  t: (key: string) => key,
  changeLocale: () => {},
  dir: "ltr",
})

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Language>(defaultLocale)
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")

  useEffect(() => {
    // Check if there's a saved locale in localStorage
    const savedLocale = localStorage.getItem("locale") as Language
    if (savedLocale && (savedLocale === "en" || savedLocale === "ar")) {
      setLocale(savedLocale)
    } else {
      // Default to English if no valid locale is found
      setLocale("en")
      localStorage.setItem("locale", "en")
    }
  }, [])

  useEffect(() => {
    // Update dir based on locale
    setDir(locale === "ar" ? "rtl" : "ltr")

    // Update document direction
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"

    // Save locale to localStorage
    localStorage.setItem("locale", locale)
  }, [locale])

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split(".")
    let value: any = translations[locale]

    // Try to get the translation in the current locale
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        // If translation not found in current locale, try English
        if (locale !== "en") {
          let enValue: any = translations["en"]
          for (const enK of keys) {
            if (enValue && enValue[enK]) {
              enValue = enValue[enK]
            } else {
              console.warn(`Translation key not found: ${key}`)
              return key
            }
          }
          return typeof enValue === "string" ? enValue : key
        }
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    if (typeof value !== "string") {
      console.warn(`Translation value is not a string for key: ${key}`)
      return key
    }

    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{{${paramKey}}}`, "g"), paramValue)
      }, value)
    }

    return value
  }

  const changeLocale = (newLocale: Language) => {
    setLocale(newLocale)
  }

  return <I18nContext.Provider value={{ locale, t, changeLocale, dir }}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
