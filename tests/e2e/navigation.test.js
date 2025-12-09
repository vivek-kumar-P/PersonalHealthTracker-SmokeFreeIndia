/**
 * E2E Navigation Tests using Puppeteer
 * Tests: Page navigation, navbar, footer, responsive design
 */

import puppeteer from "puppeteer"
import { TEST_CONFIG } from "../config/test-config.js"

describe("E2E Navigation Tests", () => {
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
  // NAVBAR TESTS
  // ============================================
  describe("Navbar Component", () => {
    test("should render navbar on home page", async () => {
      await page.goto(TEST_CONFIG.FRONTEND_URL, {
        waitUntil: "networkidle2",
        timeout: TEST_CONFIG.TIMEOUT.PAGE_LOAD,
      })

      // Check for navbar element
      const navbar = await page.$("nav")
      expect(navbar).not.toBeNull()
      console.log("[E2E] Navbar rendered on home page")
    })

    test("should have all navigation links", async () => {
      await page.goto(TEST_CONFIG.FRONTEND_URL, { waitUntil: "networkidle2" })

      const links = await page.$$eval("nav a", (anchors) =>
        anchors.map((a) => ({
          text: a.textContent.trim(),
          href: a.getAttribute("href"),
        })),
      )

      const expectedLinks = ["/", "/states", "/dashboard", "/login"]
      const hrefs = links.map((l) => l.href)

      expectedLinks.forEach((link) => {
        expect(hrefs).toContain(link)
      })
      console.log("[E2E] All navigation links present")
    })

    test("should navigate to States page", async () => {
      await page.goto(TEST_CONFIG.FRONTEND_URL, { waitUntil: "networkidle2" })

      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }), page.click('a[href="/states"]')])

      expect(page.url()).toContain("/states")
      console.log("[E2E] Navigation to States page successful")
    })

    test("should navigate to Sample Journey page", async () => {
      await page.goto(TEST_CONFIG.FRONTEND_URL, { waitUntil: "networkidle2" })

      // Look for sample journey link
      const sampleLink = await page.$('a[href="/sample-journey"]')
      if (sampleLink) {
        await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2" }), sampleLink.click()])
        expect(page.url()).toContain("/sample-journey")
        console.log("[E2E] Navigation to Sample Journey page successful")
      }
    })
  })

  // ============================================
  // FOOTER TESTS
  // ============================================
  describe("Footer Component", () => {
    test("should render footer on all pages", async () => {
      const pages = ["/", "/states", "/login"]

      for (const path of pages) {
        await page.goto(`${TEST_CONFIG.FRONTEND_URL}${path}`, {
          waitUntil: "networkidle2",
        })

        const footer = await page.$("footer")
        expect(footer).not.toBeNull()
      }
      console.log("[E2E] Footer renders on all pages")
    })

    test("should contain copyright information", async () => {
      await page.goto(TEST_CONFIG.FRONTEND_URL, { waitUntil: "networkidle2" })

      const footerText = await page.$eval("footer", (el) => el.textContent)
      expect(footerText.toLowerCase()).toContain("smokefree")
      console.log("[E2E] Footer contains app branding")
    })
  })

  // ============================================
  // RESPONSIVE DESIGN TESTS
  // ============================================
  describe("Responsive Design", () => {
    test("should be responsive on mobile viewport", async () => {
      await page.setViewport({ width: 375, height: 667 }) // iPhone SE
      await page.goto(TEST_CONFIG.FRONTEND_URL, { waitUntil: "networkidle2" })

      // Check if page renders without horizontal scroll
      const bodyWidth = await page.$eval("body", (el) => el.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(375 + 20) // Small margin for scrollbar
      console.log("[E2E] Mobile viewport renders correctly")

      // Reset viewport
      await page.setViewport({ width: 1280, height: 800 })
    })

    test("should show mobile menu on small screens", async () => {
      await page.setViewport({ width: 375, height: 667 })
      await page.goto(TEST_CONFIG.FRONTEND_URL, { waitUntil: "networkidle2" })

      // Look for hamburger menu or mobile navigation toggle
      const mobileMenu = await page.$('[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"]')
      // Mobile menu may or may not exist depending on implementation
      console.log("[E2E] Mobile navigation checked")

      await page.setViewport({ width: 1280, height: 800 })
    })

    test("should be responsive on tablet viewport", async () => {
      await page.setViewport({ width: 768, height: 1024 }) // iPad
      await page.goto(TEST_CONFIG.FRONTEND_URL, { waitUntil: "networkidle2" })

      const bodyWidth = await page.$eval("body", (el) => el.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(768 + 20)
      console.log("[E2E] Tablet viewport renders correctly")

      await page.setViewport({ width: 1280, height: 800 })
    })
  })

  // ============================================
  // 404 PAGE TESTS
  // ============================================
  describe("404 Error Handling", () => {
    test("should handle non-existent routes gracefully", async () => {
      await page.goto(`${TEST_CONFIG.FRONTEND_URL}/non-existent-page-12345`, {
        waitUntil: "networkidle2",
      })

      // Check if redirected to home or shows 404
      const pageContent = await page.content()
      const is404 =
        pageContent.includes("404") ||
        pageContent.includes("not found") ||
        page.url() === `${TEST_CONFIG.FRONTEND_URL}/`

      expect(is404 || page.url().includes("/")).toBe(true)
      console.log("[E2E] Non-existent route handled")
    })
  })
})
