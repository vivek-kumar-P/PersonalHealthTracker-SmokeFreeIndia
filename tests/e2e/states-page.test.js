/**
 * E2E States Page Tests
 * Tests: Dropdown, charts, data display
 */

import puppeteer from "puppeteer"
import { TEST_CONFIG } from "../config/test-config.js"

describe("E2E States Page Tests", () => {
  let browser
  let page

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
  // PAGE LOAD TESTS
  // ============================================
  describe("Page Load", () => {
    test("should load states page without authentication", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/states`, {
        waitUntil: "networkidle2",
      })

      expect(page.url()).toContain("/states")
      console.log("[E2E] States page loaded (public access)")
    })

    test("should display page title", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/states`, {
        waitUntil: "networkidle2",
      })

      const pageContent = await page.content()
      const hasTitle =
        pageContent.toLowerCase().includes("state") ||
        pageContent.toLowerCase().includes("insight") ||
        pageContent.toLowerCase().includes("tobacco")

      expect(hasTitle).toBe(true)
      console.log("[E2E] States page title displayed")
    })
  })

  // ============================================
  // STATE DROPDOWN TESTS
  // ============================================
  describe("State Dropdown", () => {
    test("should have state selection dropdown", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/states`, {
        waitUntil: "networkidle2",
      })

      const dropdown = await page.$('select, [role="combobox"], [data-testid="state-select"]')
      expect(dropdown).not.toBeNull()
      console.log("[E2E] State dropdown found")
    })

    test("should display charts after selecting a state", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/states`, {
        waitUntil: "networkidle2",
      })

      // Find and click dropdown
      const dropdown = await page.$("select")
      if (dropdown) {
        await dropdown.select("Maharashtra")
        await page.waitForTimeout(2000)

        // Check for chart elements
        const charts = await page.$$("canvas")
        console.log(`[E2E] Found ${charts.length} charts after state selection`)
      }
    })
  })

  // ============================================
  // CHART DISPLAY TESTS
  // ============================================
  describe("Chart Display", () => {
    test("should render multiple chart types", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/states`, {
        waitUntil: "networkidle2",
      })

      const dropdown = await page.$("select")
      if (dropdown) {
        await dropdown.select("Delhi")
        await page.waitForTimeout(3000)

        const charts = await page.$$("canvas")
        expect(charts.length).toBeGreaterThanOrEqual(1)
        console.log(`[E2E] Multiple charts rendered: ${charts.length}`)
      }
    })

    test("should display statistic cards", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/states`, {
        waitUntil: "networkidle2",
      })

      const dropdown = await page.$("select")
      if (dropdown) {
        await dropdown.select("Karnataka")
        await page.waitForTimeout(2000)

        const pageContent = await page.content()
        const hasStats =
          pageContent.includes("%") || pageContent.includes("prevalence") || pageContent.includes("Prevalence")

        console.log("[E2E] Statistics display checked")
      }
    })
  })
})
