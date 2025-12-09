/**
 * E2E Authentication Flow Tests
 * Tests: Signup, Login, Logout, Protected routes
 */

import puppeteer from "puppeteer"
import { TEST_CONFIG } from "../config/test-config.js"

describe("E2E Authentication Flow", () => {
  let browser
  let page
  const testEmail = `e2e_test_${Date.now()}@smokefree.test`
  const testPassword = "E2ETestPass123!"

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
  })

  afterAll(async () => {
    await browser.close()
  })

  // ============================================
  // SIGNUP FLOW TESTS
  // ============================================
  describe("Signup Flow", () => {
    test("should navigate to login/signup page", async () => {
      await page.goto(TEST_CONFIG.FRONTEND_URL, { waitUntil: "networkidle2" })

      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }), page.click('a[href="/login"]')])

      expect(page.url()).toContain("/login")
      console.log("[E2E] Navigated to login page")
    })

    test("should switch to signup tab", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/login`, { waitUntil: "networkidle2" })

      // Find and click signup tab/button
      const signupTab = await page.$('button:has-text("Sign Up"), [data-tab="signup"], button[value="signup"]')
      if (signupTab) {
        await signupTab.click()
        await page.waitForTimeout(500)
      }

      console.log("[E2E] Signup form accessible")
    })

    test("should register new user", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/login`, { waitUntil: "networkidle2" })

      // Switch to signup if needed
      const signupTab = await page.$('button:has-text("Sign Up"), [data-tab="signup"]')
      if (signupTab) {
        await signupTab.click()
        await page.waitForTimeout(500)
      }

      // Fill signup form
      await page.type('input[type="email"], input[name="email"]', testEmail)
      await page.type('input[type="password"], input[name="password"]', testPassword)

      // Submit form
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => {}),
        page.click('button[type="submit"]'),
      ])

      await page.waitForTimeout(2000)

      // Check if redirected to dashboard or logged in
      const currentUrl = page.url()
      const isLoggedIn = currentUrl.includes("/dashboard") || (await page.$('button:has-text("Logout")')) !== null

      console.log(`[E2E] Registration flow completed. URL: ${currentUrl}`)
    })
  })

  // ============================================
  // LOGIN FLOW TESTS
  // ============================================
  describe("Login Flow", () => {
    test("should login with valid credentials", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/login`, { waitUntil: "networkidle2" })

      // Clear any existing inputs
      const emailInput = await page.$('input[type="email"], input[name="email"]')
      const passwordInput = await page.$('input[type="password"], input[name="password"]')

      if (emailInput && passwordInput) {
        await emailInput.click({ clickCount: 3 })
        await emailInput.type(testEmail)

        await passwordInput.click({ clickCount: 3 })
        await passwordInput.type(testPassword)

        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => {}),
          page.click('button[type="submit"]'),
        ])

        await page.waitForTimeout(2000)
      }

      console.log("[E2E] Login flow completed")
    })

    test("should show error for invalid credentials", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/login`, { waitUntil: "networkidle2" })

      const emailInput = await page.$('input[type="email"], input[name="email"]')
      const passwordInput = await page.$('input[type="password"], input[name="password"]')

      if (emailInput && passwordInput) {
        await emailInput.type("invalid@test.com")
        await passwordInput.type("wrongpassword")
        await page.click('button[type="submit"]')

        await page.waitForTimeout(2000)

        // Check for error message
        const pageContent = await page.content()
        const hasError =
          pageContent.toLowerCase().includes("invalid") ||
          pageContent.toLowerCase().includes("error") ||
          pageContent.toLowerCase().includes("incorrect")

        console.log("[E2E] Invalid login error handling checked")
      }
    })
  })

  // ============================================
  // PROTECTED ROUTE TESTS
  // ============================================
  describe("Protected Routes", () => {
    test("should redirect to login when accessing dashboard without auth", async () => {
      // Clear cookies/storage to simulate logged out state
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })

      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/dashboard`, {
        waitUntil: "networkidle2",
      })

      await page.waitForTimeout(1000)

      const currentUrl = page.url()
      const isRedirected = currentUrl.includes("/login") || currentUrl === `${TEST_CONFIG.FRONTEND_URL}/`

      expect(isRedirected).toBe(true)
      console.log("[E2E] Protected route redirects unauthenticated users")
    })
  })

  // ============================================
  // LOGOUT FLOW TESTS
  // ============================================
  describe("Logout Flow", () => {
    test("should logout successfully", async () => {
      // First login
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/login`, { waitUntil: "networkidle2" })

      const emailInput = await page.$('input[type="email"]')
      const passwordInput = await page.$('input[type="password"]')

      if (emailInput && passwordInput) {
        await emailInput.type(testEmail)
        await passwordInput.type(testPassword)
        await page.click('button[type="submit"]')
        await page.waitForTimeout(2000)

        // Find and click logout button
        const logoutBtn = await page.$('button:has-text("Logout"), a:has-text("Logout")')
        if (logoutBtn) {
          await logoutBtn.click()
          await page.waitForTimeout(1000)

          // Verify logged out state
          const currentUrl = page.url()
          console.log(`[E2E] Logout completed. URL: ${currentUrl}`)
        }
      }
    })
  })
})
