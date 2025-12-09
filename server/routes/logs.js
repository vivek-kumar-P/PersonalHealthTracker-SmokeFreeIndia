import express from "express"
import multer from "multer"
import xlsx from "xlsx"
import Log from "../models/Log.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Get user logs
router.get("/", authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.userId }).sort({ date: -1 })
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs", message: error.message })
  }
})

// Create log
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { date, cigarettes, smokeless, notes } = req.body

    const log = new Log({
      userId: req.user.userId,
      date: new Date(date),
      cigarettes: Number(cigarettes) || 0,
      smokeless: Number(smokeless) || 0,
      notes: notes || "",
    })

    await log.save()
    res.status(201).json(log)
  } catch (error) {
    res.status(500).json({ error: "Failed to create log", message: error.message })
  }
})

// Upload CSV/Excel
router.post("/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    // Parse file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(sheet)

    if (data.length === 0) {
      return res.status(400).json({ error: "CSV file is empty" })
    }

    // Get headers and normalize them
    const headers = Object.keys(data[0])
    const normalizeHeader = (header) => {
      return header.toLowerCase().trim().replace(/[\\s_()\\/?]/g, '')
    }

    // Create mapping for flexible column detection
    const headerMap = {}
    const normalizedHeaders = headers.map(normalizeHeader)
    
    // Map flexible column names
    normalizedHeaders.forEach((normalized, idx) => {
      if (['date', 'dates'].some(h => normalized.includes(h))) {
        headerMap.date = headers[idx]
      } else if (['cigarettes'].some(h => normalized.includes(h))) {
        headerMap.cigarettes = headers[idx]
      } else if (['smokeless', 'gutkha', 'paan'].some(h => normalized.includes(h))) {
        headerMap.smokeless = headers[idx]
      } else if (['craving', 'cravinglevel'].some(h => normalized.includes(h))) {
        headerMap.craving = headers[idx]
      } else if (['mood'].some(h => normalized.includes(h))) {
        headerMap.mood = headers[idx]
      } else if (['notes'].some(h => normalized.includes(h))) {
        headerMap.notes = headers[idx]
      } else if (['money', 'moneysaved'].some(h => normalized.includes(h))) {
        headerMap.moneySaved = headers[idx]
      }
    })

    // Validate required columns
    if (!headerMap.date || !headerMap.cigarettes) {
      return res.status(400).json({ 
        error: "Missing required columns. Please include 'Date' and 'Cigarettes' columns.",
        receivedHeaders: headers
      })
    }

    // Process data
    const logs = []
    for (const row of data) {
      try {
        const dateValue = row[headerMap.date]
        if (!dateValue) continue // Skip rows without date

        // Parse DD-MM-YYYY format
        let parsedDate
        if (typeof dateValue === 'string') {
          const parts = dateValue.split('-')
          if (parts.length === 3) {
            // Try DD-MM-YYYY format first
            const day = parseInt(parts[0])
            const month = parseInt(parts[1])
            const year = parseInt(parts[2])
            if (day && month && year) {
              parsedDate = new Date(year, month - 1, day)
            }
          }
        } else {
          parsedDate = new Date(dateValue)
        }

        if (!parsedDate || isNaN(parsedDate.getTime())) {
          console.error("Invalid date format:", dateValue)
          continue
        }

        const log = new Log({
          userId: req.user.userId,
          date: parsedDate,
          cigarettes: Number(row[headerMap.cigarettes] || 0),
          smokeless: Number(row[headerMap.smokeless] || 0),
          notes: row[headerMap.notes] || "",
          craving: Number(row[headerMap.craving] || 0),
          mood: row[headerMap.mood] || "",
          moneySaved: Number(row[headerMap.moneySaved] || 0),
        })
        logs.push(log)
      } catch (rowError) {
        console.error("Error processing row:", row, rowError)
        // Continue with next row instead of failing entire upload
      }
    }

    if (logs.length === 0) {
      return res.status(400).json({ error: "No valid logs found in CSV file" })
    }

    await Log.insertMany(logs)
    res.status(201).json({ message: `${logs.length} logs uploaded successfully`, count: logs.length })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: "Failed to upload file", message: error.message })
  }
})

// Delete log
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!log) {
      return res.status(404).json({ error: "Log not found" })
    }

    res.json({ message: "Log deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete log", message: error.message })
  }
})

export default router
