"use client"

import { useAuth } from "./AuthContext"

export function useUser() {
  const { user, loading } = useAuth()
  return { user, loading }
}
