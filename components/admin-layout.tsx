"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ShirtIcon as Tshirt,
  Users,
  PenToolIcon as Tools,
  CreditCard,
  Settings,
  Bell,
  Menu,
  X,
  BarChart,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/lib/use-user"
import type React from "react" // Added import for React

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { user } = useUser()
  const avatarUrl = user?.user_metadata?.avatar_url
  const sidebarRef = useRef(null)

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white shadow-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40`}
      >
        <div className="flex items-center gap-2 mb-8">
          <Tshirt className="w-8 h-8 text-pink-500" />
          <span className="font-semibold text-xl">TopMaj Admin</span>
        </div>

        <nav className="space-y-1">
          <Link
            href="/admin/analytics"
            className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
              isActive("/admin/analytics")
                ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <BarChart className="w-4 h-4" />
            Analytics
          </Link>
          <Link
            href="/admin/users"
            className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
              isActive("/admin/users")
                ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Users className="w-4 h-4" />
            Users
          </Link>
          <Link
            href="/admin/tools"
            className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
              isActive("/admin/tools")
                ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Tools className="w-4 h-4" />
            Tools
          </Link>
          <Link
            href="/admin/credits"
            className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
              isActive("/admin/credits")
                ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Credits
          </Link>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 ${
              isActive("/admin/settings")
                ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">User Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
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
