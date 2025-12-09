"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../lib/auth-context"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">SmokeFree India</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              isActive("/") ? "text-emerald-600" : "text-gray-700"
            }`}
          >
            Home
          </Link>
          <Link
            to="/states"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              isActive("/states") ? "text-emerald-600" : "text-gray-700"
            }`}
          >
            All States Insights
          </Link>
          <Link
            to="/sample-journey"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              isActive("/sample-journey") ? "text-emerald-600" : "text-gray-700"
            }`}
          >
            Sample Journey
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
              isActive("/dashboard") ? "text-emerald-600" : "text-gray-700"
            }`}
          >
            My Dashboard
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                Login / Signup
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
