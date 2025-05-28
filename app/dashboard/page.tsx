import DashboardContent from "@/components/DashboardContent"
import { LanguageProvider } from "@/components/simple-language-switcher"

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  )
}
