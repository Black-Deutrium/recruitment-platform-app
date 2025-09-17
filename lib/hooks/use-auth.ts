"use client"

import { useState, useEffect } from "react"
import { verifyToken } from "@/lib/auth"
import type { User } from "@/lib/types"

interface AuthState {
  user: Omit<User, "password_hash"> | null
  loading: boolean
  isAuthenticated: boolean
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get token from cookie
        const cookies = document.cookie.split(";")
        const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth-token="))

        if (!authCookie) {
          setAuthState({ user: null, loading: false, isAuthenticated: false })
          return
        }

        const token = authCookie.split("=")[1]
        const payload = verifyToken(token)

        if (payload) {
          // Create user object from token payload
          const user = {
            id: payload.userId,
            email: payload.email,
            role: payload.role,
            name: "", // Will be filled from API if needed
            created_at: new Date(),
            updated_at: new Date(),
          }
          setAuthState({ user, loading: false, isAuthenticated: true })
        } else {
          setAuthState({ user: null, loading: false, isAuthenticated: false })
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthState({ user: null, loading: false, isAuthenticated: false })
      }
    }

    checkAuth()
  }, [])

  return authState
}

export function logout() {
  // Clear cookie
  document.cookie = "auth-token=; path=/; max-age=0"

  // Call logout API
  fetch("/api/auth/logout", { method: "POST" })
    .then(() => {
      window.location.href = "/login"
    })
    .catch(() => {
      window.location.href = "/login"
    })
}
