// Test Configuration for SmokeFree India
export const TEST_CONFIG = {
  // Server URLs
  API_BASE_URL: process.env.API_URL || "http://localhost:5000/api",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Test User Credentials
  TEST_USER: {
    email: "testuser@smokefree.test",
    password: "TestPass123!",
    name: "Test User",
  },

  // Second Test User (for conflict tests)
  TEST_USER_2: {
    email: "testuser2@smokefree.test",
    password: "TestPass456!",
    name: "Test User 2",
  },

  // Invalid Credentials
  INVALID_USER: {
    email: "invalid@test.com",
    password: "wrongpassword",
  },

  // Test Timeouts
  TIMEOUT: {
    API: 10000,
    PAGE_LOAD: 30000,
    ANIMATION: 2000,
  },

  // Sample Log Data
  SAMPLE_LOG: {
    date: new Date().toISOString().split("T")[0],
    cigarettes: 5,
    smokeless: 2,
    notes: "Test log entry",
  },

  // Indian States for Testing
  TEST_STATES: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh"],
}

export default TEST_CONFIG
