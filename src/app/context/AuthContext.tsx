"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { http } from "../../lib/http"

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      await http.get("/auth/me")
      setIsAuthenticated(true)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await http.post("/auth/logout")
    setIsAuthenticated(false)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error("useAuth must be used inside AuthProvider")
  return context
}