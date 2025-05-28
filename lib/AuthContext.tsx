"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { supabase } from "./supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error("Error refreshing session:", error)
        setSession(null)
        setUser(null)
        router.push("/login")
      } else {
        setSession(data.session)
        setUser(data.session?.user ?? null)
      }
    } catch (error) {
      console.error("Unexpected error during session refresh:", error)
      setSession(null)
      setUser(null)
      router.push("/login")
    }
  }

  useEffect(() => {
    const setupAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error)
        setSession(null)
        setUser(null)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)

      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event)
        setSession(session)
        setUser(session?.user ?? null)
        if (event === "SIGNED_OUT") {
          router.push("/login")
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed")
        }
      })

      return () => {
        listener?.subscription.unsubscribe()
      }
    }

    setupAuth()
  }, [router])

  useEffect(() => {
    const refreshInterval = setInterval(refreshSession, 10 * 60 * 1000) // Refresh every 10 minutes
    return () => clearInterval(refreshInterval)
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push("/login")
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
