/**
 * Cypress E2E Tests for SmokeFree India
 * Run with: npx cypress open (interactive) or npx cypress run (headless)
 */

// Import Cypress commands
const { describe, beforeEach, it, expect, cy } = require("cypress")

const baseUrl = "http://localhost:3000"
const apiUrl = "http://localhost:5000/api"
const testEmail = `cypress_${Date.now()}@test.com`
const testPassword = "CypressTest123!"

// ============================================
// HOMEPAGE TESTS
// ============================================
describe("Homepage", () => {
  beforeEach(() => {
    cy.visit(baseUrl)
  })

  it("should load the homepage", () => {
    cy.url().should("eq", `${baseUrl}/`)
  })

  it("should display the hero section", () => {
    cy.get("h1, h2").should("exist")
  })

  it("should have working navigation links", () => {
    cy.get("nav").should("exist")
    cy.get("nav a").should("have.length.at.least", 3)
  })

  it("should display the footer", () => {
    cy.get("footer").should("exist")
  })
})

// ============================================
// AUTHENTICATION TESTS
// ============================================
describe("Authentication", () => {
  it("should navigate to login page", () => {
    cy.visit(baseUrl)
    cy.get('a[href="/login"]').click()
    cy.url().should("include", "/login")
  })

  it("should register a new user", () => {
    cy.visit(`${baseUrl}/login`)

    // Look for signup tab and click if exists
    cy.get("body").then(($body) => {
      if ($body.find('button:contains("Sign Up")').length) {
        cy.contains("button", "Sign Up").click()
      }
    })

    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button[type="submit"]').click()

    // Wait for response
    cy.wait(2000)
  })

  it("should login with valid credentials", () => {
    cy.visit(`${baseUrl}/login`)
    cy.get('input[type="email"]').type(testEmail)
    cy.get('input[type="password"]').type(testPassword)
    cy.get('button[type="submit"]').click()

    cy.wait(2000)
  })

  it("should show error for invalid login", () => {
    cy.visit(`${baseUrl}/login`)
    cy.get('input[type="email"]').type("invalid@test.com")
    cy.get('input[type="password"]').type("wrongpassword")
    cy.get('button[type="submit"]').click()

    // Should show error or stay on login page
    cy.url().should("include", "/login")
  })
})

// ============================================
// STATES PAGE TESTS
// ============================================
describe("States Page", () => {
  beforeEach(() => {
    cy.visit(`${baseUrl}/states`)
  })

  it("should load states page without authentication", () => {
    cy.url().should("include", "/states")
  })

  it("should have state dropdown", () => {
    cy.get("select").should("exist")
  })

  it("should load charts when state is selected", () => {
    cy.get("select").select("Maharashtra")
    cy.wait(2000)
    cy.get("canvas").should("have.length.at.least", 1)
  })
})

// ============================================
// SAMPLE JOURNEY TESTS
// ============================================
describe("Sample Journey Page", () => {
  beforeEach(() => {
    cy.visit(`${baseUrl}/sample-journey`)
  })

  it("should load sample journey page", () => {
    cy.url().should("include", "/sample-journey")
  })

  it("should display charts", () => {
    cy.wait(1000)
    cy.get("canvas").should("have.length.at.least", 1)
  })

  it("should be accessible without login", () => {
    // Clear any auth
    cy.clearLocalStorage()
    cy.visit(`${baseUrl}/sample-journey`)
    cy.url().should("include", "/sample-journey")
  })
})

// ============================================
// DASHBOARD TESTS
// ============================================
describe("Dashboard (Protected)", () => {
  it("should redirect to login when not authenticated", () => {
    cy.clearLocalStorage()
    cy.visit(`${baseUrl}/dashboard`)
    cy.wait(1000)
    cy.url().should("satisfy", (url) => {
      return url.includes("/login") || url === `${baseUrl}/`
    })
  })
})

// ============================================
// API TESTS
// ============================================
describe("API Endpoints", () => {
  it("should fetch all states", () => {
    cy.request(`${apiUrl}/states`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an("array")
    })
  })

  it("should fetch specific state", () => {
    cy.request(`${apiUrl}/states/Maharashtra`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property("name")
    })
  })

  it("should return 404 for non-existent state", () => {
    cy.request({
      url: `${apiUrl}/states/FakeState`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it("should reject unauthenticated log access", () => {
    cy.request({
      url: `${apiUrl}/logs`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})

// ============================================
// RESPONSIVE TESTS
// ============================================
describe("Responsive Design", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 800 },
  ]

  viewports.forEach((viewport) => {
    it(`should render correctly on ${viewport.name}`, () => {
      cy.viewport(viewport.width, viewport.height)
      cy.visit(baseUrl)
      cy.get("nav").should("be.visible")
      cy.get("body").should("not.have.css", "overflow-x", "scroll")
    })
  })
})
