"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShirtIcon as Tshirt } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 22, minutes: 38, seconds: 40 })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Valentine's Day Banner */}
      <div className="bg-[#E94D5F] text-white text-center py-3 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
          <span>Valentine's Day Sale: 40% off yearly plans!</span>
          <Link href="#" className="underline font-medium hover:no-underline">
            Claim discount
          </Link>
          <div className="flex items-center gap-2 ml-4">
            <div className="flex items-center">
              <span>{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-xs ml-1">d</span>
            </div>
            <div className="flex items-center">
              <span>{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-xs ml-1">h</span>
            </div>
            <div className="flex items-center">
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-xs ml-1">m</span>
            </div>
            <div className="flex items-center">
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-xs ml-1">s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8 w-1/4">
              <Link href="/" className="flex items-center gap-2">
                <Tshirt className="w-8 h-8 text-[#E94D5F]" />
                <span className="font-bold text-lg">TopMaj Fashion AI</span>
              </Link>
            </div>
            <nav className="hidden lg:flex items-center justify-center gap-8 w-2/4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
              >
                Features
              </Link>
              <Link
                href="/use-cases"
                className="text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
              >
                Use Cases
              </Link>
              <Link
                href="/enterprise"
                className="text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
              >
                Enterprise
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
              >
                Pricing
              </Link>
            </nav>
            <div className="flex items-center gap-4 w-1/4 justify-end">
              <div className="hidden lg:flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
                >
                  Login
                </Link>
                <Link href="/register">
                  <Button className="bg-pink-100 hover:bg-pink-200 text-[#E94D5F] dark:bg-pink-900/20 dark:hover:bg-pink-900/30 dark:text-pink-300">
                    Try For Free Now
                  </Button>
                </Link>
              </div>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-800">
              <nav className="flex flex-col py-4 space-y-4">
                <Link
                  href="/"
                  className="px-4 text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
                >
                  Home
                </Link>
                <Link
                  href="/features"
                  className="px-4 text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
                >
                  Features
                </Link>
                <Link
                  href="/use-cases"
                  className="px-4 text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
                >
                  Use Cases
                </Link>
                <Link
                  href="/enterprise"
                  className="px-4 text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
                >
                  Enterprise
                </Link>
                <Link
                  href="/pricing"
                  className="px-4 text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
                >
                  Pricing
                </Link>
                <Link
                  href="/login"
                  className="px-4 text-sm font-medium text-gray-700 hover:text-[#E94D5F] dark:text-gray-300 dark:hover:text-[#E94D5F]"
                >
                  Login
                </Link>
                <div className="px-4">
                  <Link href="/register">
                    <Button className="w-full bg-pink-100 hover:bg-pink-200 text-[#E94D5F] dark:bg-pink-900/20 dark:hover:bg-pink-900/30 dark:text-pink-300">
                      Try For Free Now
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
