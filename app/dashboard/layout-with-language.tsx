"use client"

import { LayoutWithLanguage } from "@/components/layout-with-language"
import { I18nProvider } from "@/context/i18n-context"
import type { ReactNode } from "react"

export default function DashboardLayoutWithLanguage({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LayoutWithLanguage>{children}</LayoutWithLanguage>
    </I18nProvider>
  )
}
