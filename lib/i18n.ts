import type { Locale, TranslationDictionary, TranslationKey, TranslationValues } from "@/types/i18n"
import en from "@/translations/en"
import ar from "@/translations/ar"

export const locales: Record<Locale, TranslationDictionary> = {
  en,
  ar,
}

export const defaultLocale: Locale = "en"

export function getNestedValue(obj: TranslationDictionary, path: string): string {
  const keys = path.split(".")
  let current: any = obj

  for (const key of keys) {
    if (current === undefined || current === null) {
      return path
    }
    current = current[key]
  }

  return typeof current === "string" ? current : path
}

export function translate(locale: Locale, key: TranslationKey, values?: TranslationValues): string {
  const dictionary = locales[locale] || locales[defaultLocale]
  let text = getNestedValue(dictionary, key)

  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{{${k}}}`, "g"), String(v))
    })
  }

  return text
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr"
}

export function getLocalFromStorage(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale
  }

  const storedLocale = localStorage.getItem("locale") as Locale

  // Ensure we have a valid locale
  if (storedLocale && Object.keys(locales).includes(storedLocale)) {
    return storedLocale
  }

  // If no valid locale is found, set it to the default and return
  localStorage.setItem("locale", defaultLocale)
  return defaultLocale
}

export function setLocaleInStorage(locale: Locale): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale)
  }
}

export function resetLanguageToEnglish(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", "en")
    document.documentElement.dir = "ltr"
    document.documentElement.lang = "en"
  }
}
