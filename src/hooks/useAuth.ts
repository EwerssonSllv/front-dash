"use client"
import useSWR from "swr"
import { authService } from "../services/auth.service"

export function useAuth() {
  const { data, isLoading, mutate } = useSWR(
    "/auth/me",
    authService.me,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return {
    user: data ?? null,
    isLoading,
    refreshUser: mutate,
  }
}