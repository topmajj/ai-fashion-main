"use client"

import { useI18n } from "@/context/i18n-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { locale, changeLocale, t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale("en")} className={locale === "en" ? "bg-accent" : ""}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("ar")} className={locale === "ar" ? "bg-accent" : ""}>
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LanguageToggle() {
  const { locale, changeLocale } = useI18n()

  const toggleLanguage = () => {
    changeLocale(locale === "en" ? "ar" : "en")
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="px-2 h-8">
      {locale === "en" ? "العربية" : "English"}
    </Button>
  )
}
