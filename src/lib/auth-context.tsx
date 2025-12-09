"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from "./api"

interface AuthContextType {
  isAuthenticated: boolean
  user: any
  login: (token: string, user: any) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUserState] = useState<any>(null)

  useEffect(() => {
    const token = getToken()
    const savedUser = getUser()
    if (token && savedUser) {
      setIsAuthenticated(true)
      setUserState(savedUser)
    }
  }, [])

  const login = (token: string, user: any) => {
    setToken(token)
    setUser(user)
    setIsAuthenticated(true)
    setUserState(user)
  }

  const logout = () => {
    removeToken()
    removeUser()
    setIsAuthenticated(false)
    setUserState(null)
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
