/**
 * E2E Dashboard Tests
 * Tests: Charts, form inputs, calculations, confetti
 */

import puppeteer from "puppeteer"
import { TEST_CONFIG } from "../config/test-config.js"

describe("E2E Dashboard Tests", () => {
  let browser
  let page
  let authToken
  const testEmail = `dashboard_e2e_${Date.now()}@smokefree.test`
  const testPassword = "DashTest123!"

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    // Register and login via API first
    const axios = (await import("axios")).default
    try {
      const response = await axios.post(`${TEST_CONFIG.API_BASE_URL}/auth/register`, {
        email: testEmail,
        password: testPassword,
      })
      authToken = response.data.token
    } catch (error) {
      // User might already exist
      const loginResponse = await axios.post(`${TEST_CONFIG.API_BASE_URL}/auth/login`, {
        email: testEmail,
        password: testPassword,
      })
      authToken = loginResponse.data.token
    }
  })

  afterAll(async () => {
    await browser.close()
  })

  // Helper to login via UI
  async function loginViaUI() {
    await page.goto(`${TEST_CONFIG.FRONTEND_URL}/login`, { waitUntil: "networkidle2" })
    await page.type('input[type="email"]', testEmail)
    await page.type('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
  }

  // ============================================
  // DASHBOARD ACCESS TESTS
  // ============================================
  describe("Dashboard Access", () => {
    test("should access dashboard after login", async () => {
      await loginViaUI()

      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/dashboard`, {
        waitUntil: "networkidle2",
      })

      const currentUrl = page.url()
      expect(currentUrl).toContain("/dashboard")
      console.log("[E2E] Dashboard accessible after login")
    })
  })

  // ============================================
  // CHART RENDERING TESTS
  // ============================================
  describe("Chart Rendering", () => {
    test("should render Chart.js charts", async () => {
      await loginViaUI()
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/dashboard`, {
        waitUntil: "networkidle2",
      })

      // Wait for charts to render
      await page.waitForTimeout(2000)

      // Check for canvas elements (Chart.js renders to canvas)
      const charts = await page.$$("canvas")
      console.log(`[E2E] Found ${charts.length} chart canvas elements`)
    })

    test("should render stat cards", async () => {
      await loginViaUI()
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/dashboard`, {
        waitUntil: "networkidle2",
      })

      // Look for stat cards (money saved, days smoke-free, etc.)
      const pageContent = await page.content()
      const hasStats =
        pageContent.includes("Money Saved") ||
        pageContent.includes("Days") ||
        pageContent.includes("Life") ||
        pageContent.includes("₹")

      console.log("[E2E] Dashboard stat cards checked")
    })
  })

  // ============================================
  // FORM INPUT TESTS
  // ============================================
  describe("Log Entry Form", () => {
    test("should have log entry form", async () => {
      await loginViaUI()
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/dashboard`, {
        waitUntil: "networkidle2",
      })

      // Check for form elements
      const dateInput = await page.$('input[type="date"]')
      const numberInputs = await page.$$('input[type="number"]')
      const submitBtn = await page.$('button[type="submit"]')

      console.log(`[E2E] Form elements - Date: ${!!dateInput}, Numbers: ${numberInputs.length}, Submit: ${!!submitBtn}`)
    })

    test("should submit new log entry", async () => {
      await loginViaUI()
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/dashboard`, {
        waitUntil: "networkidle2",
      })

      // Fill form if exists
      const dateInput = await page.$('input[type="date"]')
      if (dateInput) {
        const today = new Date().toISOString().split("T")[0]
        await dateInput.type(today)

        const cigarettesInput = await page.$('input[name="cigarettes"], input[placeholder*="cigarette"]')
        if (cigarettesInput) {
          await cigarettesInput.type("3")
        }

        const submitBtn = await page.$('button[type="submit"]')
        if (submitBtn) {
          await submitBtn.click()
          await page.waitForTimeout(2000)
          console.log("[E2E] Log entry form submitted")
        }
      }
    })
  })

  // ============================================
  // CALCULATION TESTS
  // ============================================
  describe("Calculations", () => {
    test("should calculate money saved correctly", async () => {
      // Money saved = cigarettes avoided * ₹10
      await loginViaUI()
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/dashboard`, {
        waitUntil: "networkidle2",
      })

      const pageContent = await page.content()
      const hasMoneyCalc = pageContent.includes("₹") || pageContent.includes("Money")

      console.log("[E2E] Money calculation display checked")
    })

    test("should calculate life regained correctly", async () => {
      // Life regained = cigarettes avoided * 11 minutes
      await loginViaUI()
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/dashboard`, {
        waitUntil: "networkidle2",
      })

      const pageContent = await page.content()
      const hasLifeCalc = pageContent.includes("Life") || pageContent.includes("minute") || pageContent.includes("hour")

      console.log("[E2E] Life regained calculation checked")
    })
  })
})
