"use client"

import { useI18n } from "@/context/i18n-context"
import DashboardLayoutWithLanguage from "../layout-with-language"

export default function WithLanguagePage() {
  const { t } = useI18n()

  return (
    <DashboardLayoutWithLanguage>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("dashboard.title")}</h1>
        <p className="mb-4">{t("dashboard.welcome")}</p>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">{t("dashboard.instructions")}</h2>
          <p className="mb-2">{t("dashboard.languageInfo")}</p>
          <p>{t("dashboard.enjoyMessage")}</p>
        </div>
      </div>
    </DashboardLayoutWithLanguage>
  )
}
