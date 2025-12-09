"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
