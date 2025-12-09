import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../styles/globals.css"
import App from "./App.tsx"

console.log("main.tsx is loading")
console.log("root element:", document.getElementById("root"))

const rootElement = document.getElementById("root")
if (!rootElement) {
  console.error("Root element not found!")
} else {
  console.log("Creating React root...")
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log("React render called")
}
