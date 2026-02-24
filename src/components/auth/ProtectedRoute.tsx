"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [isLoading, user, router])

  if (isLoading || !user) {
    return null
  }

  return <>{children}</>
}