import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import statesRoutes from "./routes/states.js"
import logsRoutes from "./routes/logs.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/smokefree-india")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err))

// Root route
app.get("/", (req, res) => {
  res.json({ message: "SmokeFree India API is running", version: "1.0.0" })
})

// Routes
app.use("/auth", authRoutes)
app.use("/states", statesRoutes)
app.use("/logs", logsRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "SmokeFree India API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!", message: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
