"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ShirtIcon as Tshirt,
  Video,
  Palette,
  UserCircle2,
  Settings,
  Bell,
  Search,
  Sparkles,
  CreditCard,
  Menu,
  X,
  ImageIcon,
  Wand2,
  ShoppingBag,
  Loader2,
  Edit,
  RouteIcon as Runway,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/lib/use-user"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SimpleLanguageSwitcher, LanguageProvider, useLanguage } from "@/components/simple-language-switcher"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user } = useUser()
  const avatarUrl = user?.user_metadata?.avatar_url
  const { isRTL, t } = useLanguage()

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true
    if (path === "/dashboard/ai-writer" && pathname === "/dashboard/ai-writer") return true
    if (path !== "/dashboard" && pathname.startsWith(path)) return true
    return false
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [sidebarOpen])

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data, error } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

        if (error) {
          console.error("Error checking admin status:", error)
        } else {
          setIsAdmin(data.is_admin)
        }
      }
    }

    checkAdminStatus()
  }, [user])

  // RTL styles for sidebar
  const rtlStyles = isRTL
    ? {
        right: 0,
        left: "auto",
        borderRight: "none",
        borderLeft: "1px solid rgb(229, 231, 235)",
      }
    : {}

  // RTL styles for main content
  const mainContentStyles = isRTL
    ? {
        marginRight: "280px",
        marginLeft: "0",
      }
    : {}

  // RTL styles for menu items
  const menuItemStyles = isRTL
    ? {
        display: "flex",
        flexDirection: "row-reverse" as const,
        justifyContent: "flex-start",
        textAlign: "right" as const,
      }
    : {}

  // RTL styles for icon margins
  const iconMarginStyles = isRTL
    ? {
        marginLeft: "8px",
        marginRight: "0",
      }
    : {
        marginRight: "8px",
        marginLeft: "0",
      }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" aria-hidden="true" />}

      {/* Mobile sidebar toggle */}
      <button
        className={`fixed top-4 ${isRTL ? "right-4" : "left-4"} z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="h-5 w-5 dark:text-white" /> : <Menu className="h-5 w-5 dark:text-white" />}
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={rtlStyles}
        className={`fixed ${isRTL ? "right-0" : "left-0"} top-0 w-[280px] h-full bg-white dark:bg-gray-800 border-${isRTL ? "l" : "r"} border-gray-200 dark:border-gray-700 p-4 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
        } lg:translate-x-0 z-40`}
      >
        <div className={`flex items-center gap-2 mb-8 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
          <Tshirt className="w-8 h-8 text-pink-500" />
          <span className="font-semibold text-xl">{t("sidebar.title")}</span>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {isActive("/dashboard") ? (
                <Loader2 className="w-4 h-4 animate-spin" style={iconMarginStyles} />
              ) : (
                <Sparkles className="w-4 h-4" style={iconMarginStyles} />
              )}
              {t("sidebar.allAiTools")}
            </Link>
            <div
              className={`px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-4 ${isRTL ? "text-right" : ""}`}
            >
              {t("sidebar.aiTools")}
            </div>
            <Link
              href="/dashboard/virtual-try-on"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/virtual-try-on")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Tshirt className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.virtualTryOn")}
            </Link>
            <Link
              href="/dashboard/fashion-design"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/fashion-design")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Palette className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.fashionDesign")}
            </Link>
            <Link
              href="/dashboard/fashion-edit"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/fashion-edit")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.clothesChanger")}
            </Link>
            <Link
              href="/dashboard/image-variation"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/image-variation")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Wand2 className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.imageVariation")}
            </Link>
            <Link
              href="/dashboard/ai-model-generator"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/ai-model-generator")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <UserCircle2 className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.aiModelGenerator")}
              <span className="text-xs bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full ml-auto">
                {t("common.new")}
              </span>
            </Link>
            <Link
              href="/dashboard/ai-model-editor"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/ai-model-editor")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Edit className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.aiModelEditor")}
            </Link>
            <Link
              href="/dashboard/ecommerce-generator"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/ecommerce-generator")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <ShoppingBag className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.ecommerceGenerator")}
            </Link>
            <Link
              href="/dashboard/fashion-video"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/fashion-video")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Video className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.fashionVideos")}
              <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-0.5 rounded-full ml-auto">
                {t("common.pro")}
              </span>
            </Link>
            <Link
              href="/dashboard/runway"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/runway")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Runway className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.aiRunwayModel")}
              <span className="text-xs bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full ml-auto">
                {t("common.new")}
              </span>
            </Link>

            <div
              className={`px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-4 ${isRTL ? "text-right" : ""}`}
            >
              {t("sidebar.results")}
            </div>
            <Link
              href="/dashboard/generations"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/generations")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.generations")}
            </Link>

            <div
              className={`px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mt-4 ${isRTL ? "text-right" : ""}`}
            >
              {t("sidebar.account")}
            </div>
            <Link
              href="/dashboard/credits"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/credits")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <CreditCard className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.credits")}
            </Link>
            <Link
              href="/dashboard/settings"
              style={menuItemStyles}
              className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
                isActive("/dashboard/settings")
                  ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Settings className="w-4 h-4" style={iconMarginStyles} />
              {t("sidebar.settings")}
            </Link>
          </nav>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <main className={`${isRTL ? "mr-[280px]" : "lg:ml-[280px]"} min-h-screen`} style={isRTL ? mainContentStyles : {}}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 lg:p-6 gap-4">
            <div className={`flex items-center gap-4 w-full lg:w-auto ${isRTL ? "pr-12 lg:pr-0" : "pl-12 lg:pl-0"}`}>
              <div className="relative flex-1 lg:w-64">
                <div
                  className={`absolute inset-0 -m-1 rounded-lg transition-all ${
                    isSearchFocused ? "bg-pink-100/50" : ""
                  }`}
                />
                <Search
                  className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                    isSearchFocused ? "text-pink-500" : "text-gray-400"
                  }`}
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={t("common.searchPlaceholder")}
                  className={`${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all dark:text-white`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4 w-full lg:w-auto justify-end">
              <ThemeToggle />
              <SimpleLanguageSwitcher />
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 hidden"
              >
                <span className="hidden sm:inline">{t("common.upgradeToPro")}</span>
                <Sparkles className="sm:ml-2 h-4 w-4" />
              </Button>
              <Link href="/dashboard/credits">
                <Button variant="outline" size="sm">
                  <span className="hidden sm:inline">{t("common.buyCredits")}</span>
                  <span className={`${isRTL ? "sm:mr-2" : "sm:ml-2"}`}>💎</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                    <img
                      src={avatarUrl || "/placeholder.svg?height=32&width=32"}
                      alt="Profile"
                      className="rounded-full w-8 h-8"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"}>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/credits">{t("sidebar.credits")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">{t("common.profile")}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users">
                        {t("common.admin")} {t("common.dashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>{t("common.logout")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LayoutContent>{children}</LayoutContent>
    </LanguageProvider>
  )
}
