/**
 * States API Tests
 * Tests: Fetching all states, individual state data
 */

import axios from "axios"
import { TEST_CONFIG } from "../config/test-config.js"
import { fail } from "assert"

const API = axios.create({
  baseURL: TEST_CONFIG.API_BASE_URL,
  timeout: TEST_CONFIG.TIMEOUT.API,
})

describe("States API Tests", () => {
  // ============================================
  // GET ALL STATES TESTS
  // ============================================
  describe("GET /states", () => {
    test("should fetch all states", async () => {
      const response = await API.get("/states")

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)
      console.log(`[TEST] Fetched ${response.data.length} states`)
    })

    test("should return states sorted alphabetically", async () => {
      const response = await API.get("/states")

      if (response.data.length >= 2) {
        const names = response.data.map((s) => s.name)
        const sortedNames = [...names].sort()
        expect(names).toEqual(sortedNames)
        console.log("[TEST] States sorted alphabetically")
      }
    })

    test("should include required fields for each state", async () => {
      const response = await API.get("/states")

      if (response.data.length > 0) {
        const state = response.data[0]
        expect(state).toHaveProperty("name")
        expect(state).toHaveProperty("totalPrevalence")
        expect(state).toHaveProperty("smokedPrevalence")
        expect(state).toHaveProperty("smokelessPrevalence")
        console.log("[TEST] State objects have required fields")
      }
    })

    test("should be accessible without authentication", async () => {
      // No auth header
      const response = await API.get("/states")
      expect(response.status).toBe(200)
      console.log("[TEST] States endpoint is public (no auth required)")
    })
  })

  // ============================================
  // GET INDIVIDUAL STATE TESTS
  // ============================================
  describe("GET /states/:stateName", () => {
    test("should fetch a specific state by name", async () => {
      const response = await API.get("/states/Maharashtra")

      expect(response.status).toBe(200)
      expect(response.data.name.toLowerCase()).toBe("maharashtra")
      console.log("[TEST] Individual state fetched successfully")
    })

    test("should handle case-insensitive state names", async () => {
      const responses = await Promise.all([
        API.get("/states/DELHI"),
        API.get("/states/delhi"),
        API.get("/states/Delhi"),
      ])

      responses.forEach((response) => {
        expect(response.status).toBe(200)
        expect(response.data.name.toLowerCase()).toBe("delhi")
      })
      console.log("[TEST] Case-insensitive state lookup works")
    })

    test("should return 404 for non-existent state", async () => {
      try {
        await API.get("/states/NonExistentState")
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(404)
        expect(error.response.data.error).toContain("not found")
        console.log("[TEST] Non-existent state returns 404")
      }
    })

    test("should handle states with spaces in name", async () => {
      const response = await API.get("/states/Tamil%20Nadu")

      expect(response.status).toBe(200)
      console.log("[TEST] State with spaces handled correctly")
    })

    test("should include tobacco statistics", async () => {
      const response = await API.get("/states/Karnataka")

      expect(response.data).toHaveProperty("totalPrevalence")
      expect(response.data).toHaveProperty("malePrevalence")
      expect(response.data).toHaveProperty("femalePrevalence")
      expect(typeof response.data.totalPrevalence).toBe("number")
      console.log("[TEST] State includes tobacco statistics")
    })
  })
})
