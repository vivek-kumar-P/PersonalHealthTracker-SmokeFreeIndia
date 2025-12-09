/**
 * Logs API Tests
 * Tests: CRUD operations, CSV upload, data validation
 */

import axios from "axios"
import FormData from "form-data"
import { TEST_CONFIG } from "../config/test-config.js"
import { fail } from "@jest/core"

const API = axios.create({
  baseURL: TEST_CONFIG.API_BASE_URL,
  timeout: TEST_CONFIG.TIMEOUT.API,
})

describe("Logs API Tests", () => {
  let authToken = null
  let createdLogId = null
  const uniqueEmail = `logs_test_${Date.now()}@smokefree.test`

  // Setup: Register and login before tests
  beforeAll(async () => {
    // Register new user
    const registerResponse = await API.post("/auth/register", {
      email: uniqueEmail,
      password: "TestPass123!",
      name: "Logs Test User",
    })
    authToken = registerResponse.data.token
    console.log("[SETUP] Test user created for logs tests")
  })

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${authToken}` },
  })

  // ============================================
  // CREATE LOG TESTS
  // ============================================
  describe("POST /logs", () => {
    test("should create a new log entry", async () => {
      const logData = {
        date: new Date().toISOString().split("T")[0],
        cigarettes: 5,
        smokeless: 2,
        notes: "Test log entry - feeling okay",
      }

      const response = await API.post("/logs", logData, authHeaders())

      expect(response.status).toBe(201)
      expect(response.data).toHaveProperty("_id")
      expect(response.data.cigarettes).toBe(5)
      expect(response.data.smokeless).toBe(2)

      createdLogId = response.data._id
      console.log("[TEST] Log created successfully:", createdLogId)
    })

    test("should create log with zero values", async () => {
      const logData = {
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
        cigarettes: 0,
        smokeless: 0,
        notes: "Smoke-free day!",
      }

      const response = await API.post("/logs", logData, authHeaders())

      expect(response.status).toBe(201)
      expect(response.data.cigarettes).toBe(0)
      expect(response.data.smokeless).toBe(0)
      console.log("[TEST] Zero-value log created successfully")
    })

    test("should create log without notes", async () => {
      const logData = {
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0], // 2 days ago
        cigarettes: 3,
        smokeless: 1,
      }

      const response = await API.post("/logs", logData, authHeaders())

      expect(response.status).toBe(201)
      expect(response.data.notes).toBe("")
      console.log("[TEST] Log without notes created successfully")
    })

    test("should reject log creation without authentication", async () => {
      try {
        await API.post("/logs", TEST_CONFIG.SAMPLE_LOG)
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(401)
        console.log("[TEST] Unauthenticated log creation rejected")
      }
    })
  })

  // ============================================
  // READ LOGS TESTS
  // ============================================
  describe("GET /logs", () => {
    test("should fetch all user logs", async () => {
      const response = await API.get("/logs", authHeaders())

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.data.length).toBeGreaterThanOrEqual(1)
      console.log(`[TEST] Fetched ${response.data.length} logs`)
    })

    test("should return logs sorted by date (newest first)", async () => {
      const response = await API.get("/logs", authHeaders())

      if (response.data.length >= 2) {
        const dates = response.data.map((log) => new Date(log.date).getTime())
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1])
        }
        console.log("[TEST] Logs sorted correctly by date")
      }
    })

    test("should only return logs for authenticated user", async () => {
      // Create second user
      const secondEmail = `logs_test_2_${Date.now()}@smokefree.test`
      const registerResponse = await API.post("/auth/register", {
        email: secondEmail,
        password: "TestPass123!",
        name: "Second Test User",
      })
      const secondToken = registerResponse.data.token

      // Get logs for second user (should be empty)
      const response = await API.get("/logs", {
        headers: { Authorization: `Bearer ${secondToken}` },
      })

      expect(response.status).toBe(200)
      expect(response.data.length).toBe(0)
      console.log("[TEST] User isolation verified - second user has no logs")
    })
  })

  // ============================================
  // CSV UPLOAD TESTS
  // ============================================
  describe("POST /logs/upload", () => {
    test("should upload and parse CSV file", async () => {
      // Create CSV content
      const csvContent = `Date,Cigarettes,Smokeless,Notes
2024-01-01,5,2,Day 1 of tracking
2024-01-02,4,1,Reduced by 1
2024-01-03,3,1,Making progress
2024-01-04,2,0,Almost there
2024-01-05,0,0,Smoke free!`

      const formData = new FormData()
      formData.append("file", Buffer.from(csvContent), {
        filename: "test-logs.csv",
        contentType: "text/csv",
      })

      const response = await API.post("/logs/upload", formData, {
        headers: {
          ...authHeaders().headers,
          ...formData.getHeaders(),
        },
      })

      expect(response.status).toBe(201)
      expect(response.data.count).toBe(5)
      console.log(`[TEST] CSV uploaded successfully: ${response.data.count} logs`)
    })

    test("should handle CSV with different column names", async () => {
      const csvContent = `date,cigarettes,smokeless,notes
2024-02-01,3,1,Lowercase columns test`

      const formData = new FormData()
      formData.append("file", Buffer.from(csvContent), {
        filename: "lowercase-test.csv",
        contentType: "text/csv",
      })

      const response = await API.post("/logs/upload", formData, {
        headers: {
          ...authHeaders().headers,
          ...formData.getHeaders(),
        },
      })

      expect(response.status).toBe(201)
      console.log("[TEST] CSV with lowercase columns parsed correctly")
    })

    test("should reject upload without file", async () => {
      try {
        await API.post("/logs/upload", {}, authHeaders())
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(400)
        console.log("[TEST] Upload without file rejected correctly")
      }
    })

    test("should reject upload without authentication", async () => {
      const formData = new FormData()
      formData.append("file", Buffer.from("Date,Cigarettes\n2024-01-01,1"), {
        filename: "test.csv",
        contentType: "text/csv",
      })

      try {
        await API.post("/logs/upload", formData, {
          headers: formData.getHeaders(),
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(401)
        console.log("[TEST] Unauthenticated upload rejected")
      }
    })
  })

  // ============================================
  // DELETE LOG TESTS
  // ============================================
  describe("DELETE /logs/:id", () => {
    test("should delete a log entry", async () => {
      // First create a log to delete
      const createResponse = await API.post(
        "/logs",
        {
          date: new Date().toISOString().split("T")[0],
          cigarettes: 1,
          smokeless: 0,
          notes: "To be deleted",
        },
        authHeaders(),
      )

      const logId = createResponse.data._id

      // Delete the log
      const deleteResponse = await API.delete(`/logs/${logId}`, authHeaders())

      expect(deleteResponse.status).toBe(200)
      expect(deleteResponse.data.message).toContain("deleted")
      console.log("[TEST] Log deleted successfully")
    })

    test("should return 404 for non-existent log", async () => {
      try {
        await API.delete("/logs/507f1f77bcf86cd799439011", authHeaders())
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(404)
        console.log("[TEST] Non-existent log deletion returns 404")
      }
    })

    test("should not delete another user's log", async () => {
      // Create log with first user
      const createResponse = await API.post(
        "/logs",
        {
          date: new Date().toISOString().split("T")[0],
          cigarettes: 2,
          smokeless: 1,
          notes: "First user log",
        },
        authHeaders(),
      )

      const logId = createResponse.data._id

      // Create second user and try to delete first user's log
      const secondEmail = `delete_test_${Date.now()}@smokefree.test`
      const registerResponse = await API.post("/auth/register", {
        email: secondEmail,
        password: "TestPass123!",
      })

      try {
        await API.delete(`/logs/${logId}`, {
          headers: { Authorization: `Bearer ${registerResponse.data.token}` },
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(404)
        console.log("[TEST] Cross-user deletion prevented correctly")
      }
    })
  })
})
