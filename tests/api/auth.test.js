/**
 * Authentication API Tests
 * Tests: Registration, Login, JWT handling, Password hashing
 */

import axios from "axios"
import { TEST_CONFIG } from "../config/test-config.js"
import { fail } from "assert"

const API = axios.create({
  baseURL: TEST_CONFIG.API_BASE_URL,
  timeout: TEST_CONFIG.TIMEOUT.API,
})

describe("Authentication API Tests", () => {
  let authToken = null
  const uniqueEmail = `test_${Date.now()}@smokefree.test`

  // ============================================
  // REGISTRATION TESTS
  // ============================================
  describe("POST /auth/register", () => {
    test("should register a new user successfully", async () => {
      const response = await API.post("/auth/register", {
        email: uniqueEmail,
        password: "SecurePass123!",
        name: "Test Registration User",
      })

      expect(response.status).toBe(201)
      expect(response.data).toHaveProperty("token")
      expect(response.data).toHaveProperty("user")
      expect(response.data.user.email).toBe(uniqueEmail)
      expect(response.data.user).not.toHaveProperty("password") // Password should not be returned

      authToken = response.data.token
      console.log("[TEST] User registered successfully")
    })

    test("should reject duplicate email registration", async () => {
      try {
        await API.post("/auth/register", {
          email: uniqueEmail, // Same email as above
          password: "AnotherPass123!",
          name: "Duplicate User",
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(400)
        expect(error.response.data.error).toContain("already registered")
        console.log("[TEST] Duplicate email rejected correctly")
      }
    })

    test("should reject registration with missing fields", async () => {
      try {
        await API.post("/auth/register", {
          email: "incomplete@test.com",
          // Missing password
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(500)
        console.log("[TEST] Missing fields rejected correctly")
      }
    })

    test("should reject registration with invalid email format", async () => {
      try {
        await API.post("/auth/register", {
          email: "invalid-email-format",
          password: "ValidPass123!",
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBeGreaterThanOrEqual(400)
        console.log("[TEST] Invalid email format rejected")
      }
    })
  })

  // ============================================
  // LOGIN TESTS
  // ============================================
  describe("POST /auth/login", () => {
    test("should login with valid credentials", async () => {
      const response = await API.post("/auth/login", {
        email: uniqueEmail,
        password: "SecurePass123!",
      })

      expect(response.status).toBe(200)
      expect(response.data).toHaveProperty("token")
      expect(response.data).toHaveProperty("user")
      expect(response.data.token).toBeTruthy()

      // Verify JWT format (header.payload.signature)
      const tokenParts = response.data.token.split(".")
      expect(tokenParts).toHaveLength(3)

      authToken = response.data.token
      console.log("[TEST] Login successful, JWT received")
    })

    test("should reject login with wrong password", async () => {
      try {
        await API.post("/auth/login", {
          email: uniqueEmail,
          password: "WrongPassword123!",
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(401)
        expect(error.response.data.error).toContain("Invalid")
        console.log("[TEST] Wrong password rejected correctly")
      }
    })

    test("should reject login with non-existent email", async () => {
      try {
        await API.post("/auth/login", {
          email: "nonexistent@test.com",
          password: "AnyPassword123!",
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(401)
        expect(error.response.data.error).toContain("Invalid")
        console.log("[TEST] Non-existent email rejected correctly")
      }
    })

    test("should reject login with empty credentials", async () => {
      try {
        await API.post("/auth/login", {
          email: "",
          password: "",
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBeGreaterThanOrEqual(400)
        console.log("[TEST] Empty credentials rejected")
      }
    })
  })

  // ============================================
  // JWT TOKEN TESTS
  // ============================================
  describe("JWT Token Validation", () => {
    test("should access protected route with valid token", async () => {
      const response = await API.get("/logs", {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)
      console.log("[TEST] Protected route accessible with valid token")
    })

    test("should reject access without token", async () => {
      try {
        await API.get("/logs")
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(401)
        console.log("[TEST] Access without token rejected")
      }
    })

    test("should reject access with invalid token", async () => {
      try {
        await API.get("/logs", {
          headers: { Authorization: "Bearer invalid.token.here" },
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBe(403)
        console.log("[TEST] Invalid token rejected")
      }
    })

    test("should reject access with malformed authorization header", async () => {
      try {
        await API.get("/logs", {
          headers: { Authorization: "InvalidFormat" },
        })
        fail("Should have thrown an error")
      } catch (error) {
        expect(error.response.status).toBeGreaterThanOrEqual(400)
        console.log("[TEST] Malformed auth header rejected")
      }
    })
  })
})
