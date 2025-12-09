import express from "express"
import State from "../models/State.js"

const router = express.Router()

// Get all states
router.get("/", async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 })
    res.json(states)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch states", message: error.message })
  }
})

// Get specific state
router.get("/:stateName", async (req, res) => {
  try {
    const state = await State.findOne({
      name: new RegExp(`^${req.params.stateName}$`, "i"),
    })

    if (!state) {
      return res.status(404).json({ error: "State not found" })
    }

    res.json(state)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch state", message: error.message })
  }
})

export default router
