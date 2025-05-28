import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Add a listener for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Supabase auth state changed:", event)
  if (event === "SIGNED_OUT") {
    // Clear any user-related data from local storage
    localStorage.removeItem("user")
  } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    // Update user data in local storage
    if (session?.user) {
      localStorage.setItem("user", JSON.stringify(session.user))
    }
  }
})
