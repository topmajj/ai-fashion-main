import { Poppins, Space_Grotesk, Inter, Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import SupabaseProvider from "./supabase-provider"
import { AuthProvider } from "@/lib/AuthContext"
import { LanguageProvider } from "@/components/simple-language-switcher"
import type React from "react"
import type { Metadata } from "next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "TopMaj Fashion AI | AI-Powered Fashion Design & Generation",
  description:
    "Transform your fashion design process with TopMaj Fashion AI. Create stunning designs, photoshoots, and videos with advanced AI technology.",
  keywords: [
    "AI fashion",
    "fashion design",
    "AI photoshoot",
    "fashion generation",
    "AI model",
    "fashion technology",
    "digital fashion",
    "TopMaj",
  ],
  authors: [{ name: "TopMaj Fashion AI" }],
  creator: "TopMaj Fashion AI",
  publisher: "TopMaj Fashion AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://topmaj.ai",
    title: "TopMaj Fashion AI | AI-Powered Fashion Design & Generation",
    description:
      "Transform your fashion design process with TopMaj Fashion AI. Create stunning designs, photoshoots, and videos with advanced AI technology.",
    siteName: "TopMaj Fashion AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TopMaj AI Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TopMaj Fashion AI | AI-Powered Fashion Design & Generation",
    description:
      "Transform your fashion design process with TopMaj Fashion AI. Create stunning designs, photoshoots, and videos with advanced AI technology.",
    images: ["/twitter-image.jpg"],
    creator: "@topmajAI",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${poppins.variable} ${cairo.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            <AuthProvider>
              <LanguageProvider>{children}</LanguageProvider>
            </AuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"
