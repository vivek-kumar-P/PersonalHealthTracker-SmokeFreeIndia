import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./lib/auth-context"
import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"
import { HomePage } from "./pages/home"
import { LoginPage } from "./pages/login"
import { StatesPage } from "./pages/states"
import { SampleJourneyPage } from "./pages/sample-journey"
import { DashboardPage } from "./pages/dashboard"
import { ProtectedRoute } from "./components/protected-route"

export default function App() {
  console.log("App component rendering")
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/states" element={<StatesPage />} />
              <Route path="/sample-journey" element={<SampleJourneyPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
