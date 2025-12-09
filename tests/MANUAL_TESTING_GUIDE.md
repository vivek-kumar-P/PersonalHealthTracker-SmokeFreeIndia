# SmokeFree India - Manual Testing Guide

## Overview
This guide provides step-by-step manual testing instructions for the SmokeFree India web application. Follow each section to verify all features work correctly.

---

## Prerequisites

1. **Start the Backend Server**
   \`\`\`bash
   cd server
   npm install
   npm start
   \`\`\`
   Backend should be running at `http://localhost:5000`

2. **Start the Frontend**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`
   Frontend should be running at `http://localhost:3000`

3. **Verify MongoDB Connection**
   - Check server console for "MongoDB connected successfully"
   - If connection fails, verify MONGODB_URI in `server/.env`

---

## Test 1: Homepage & Navigation

### Steps:
1. Open `http://localhost:3000` in your browser
2. Verify the hero section displays "Stop Cigarettes Today" or similar motivational text
3. Check that the navbar contains links:
   - Home
   - All States Insights (or States)
   - Sample Journey
   - My Dashboard
   - Login/Signup

### Expected Results:
- [x] Hero section renders with title and tagline
- [x] Background has gradient or clean design
- [x] All navbar links are visible and clickable
- [x] Footer renders at bottom of page
- [x] Page is responsive (test at 375px, 768px, 1280px widths)

---

## Test 2: User Registration

### Steps:
1. Click "Login/Signup" in navbar
2. Click "Sign Up" tab (if separate)
3. Enter test credentials:
   - Email: `manual_test@smokefree.test`
   - Password: `ManualTest123!`
4. Click "Sign Up" button

### Expected Results:
- [x] Form accepts email and password
- [x] Loading state shown during registration
- [x] Success: Redirect to dashboard
- [x] User name displayed in navbar
- [x] JWT token stored in localStorage

### Edge Cases to Test:
- [x] Empty email → Shows error
- [x] Invalid email format → Shows error
- [x] Short password (< 6 chars) → Shows error
- [x] Duplicate email → Shows "already registered" error

---

## Test 3: User Login

### Steps:
1. If logged in, click "Logout" first
2. Click "Login/Signup" in navbar
3. Enter credentials used in Test 2
4. Click "Login" button

### Expected Results:
- [x] Form accepts credentials
- [x] Success: Redirect to dashboard
- [x] "Logout" button appears in navbar
- [x] User name shown in navbar

### Edge Cases to Test:
- [x] Wrong password → Shows "Invalid" error
- [x] Non-existent email → Shows "Invalid" error
- [x] Empty fields → Shows validation error

---

## Test 4: Protected Routes

### Steps:
1. Logout if logged in (clear localStorage)
2. Try to access `http://localhost:3000/dashboard` directly

### Expected Results:
- [x] Redirected to login page
- [x] After login, redirected back to dashboard

---

## Test 5: All States Insights Page

### Steps:
1. Navigate to "All States Insights" from navbar
2. Find the state dropdown selector
3. Select "Maharashtra" from dropdown
4. Wait for charts to load

### Expected Results:
- [x] Page loads without login required
- [x] Dropdown contains 37 items (29 states + 8 UTs)
- [x] Charts appear after selection:
  - Horizontal Bar: Overall prevalence
  - Pie Chart: Smoked vs Smokeless split
  - Bar Chart: Male vs Female prevalence
  - Number Cards: Estimated users & deaths
- [x] Charts are interactive (tooltips on hover)
- [x] No console errors

### States to Test:
- Maharashtra
- Delhi
- Tamil Nadu
- Uttar Pradesh
- Andaman and Nicobar Islands (UT)

---

## Test 6: Sample Journey Page

### Steps:
1. Navigate to "Sample Journey" from navbar
2. Observe the 30-day journey visualization

### Expected Results:
- [x] Page accessible without login
- [x] Dropdown shows sample profiles
- [x] Multiple charts displayed:
  - Line Chart: Daily cigarette trend
  - Bar Chart: Weekly summary
  - Craving levels chart
  - Money saved progression
  - Mood distribution
  - Health metrics radar
- [x] Statistics cards show totals
- [x] Charts are interactive

---

## Test 7: My Dashboard (Logged In)

### Steps:
1. Login with test account
2. Navigate to "My Dashboard"
3. Observe personal statistics

### Expected Results:
- [x] Dashboard loads successfully
- [x] Personal charts displayed (may be empty initially)
- [x] Statistics cards show:
  - Days Smoke-Free
  - Money Saved (₹)
  - Life Regained (minutes/hours)
- [x] Log entry form visible

---

## Test 8: Manual Log Entry

### Steps:
1. On Dashboard, find the log entry form
2. Fill in:
   - Date: Today's date
   - Cigarettes: 5
   - Smokeless: 2
   - Notes: "Test entry"
3. Click "Add Log" or "Submit"

### Expected Results:
- [x] Form submits successfully
- [x] Charts update with new data
- [x] Log appears in history (if displayed)
- [x] Statistics recalculate:
  - Money Saved increases by ₹50 (5 × ₹10)
  - Life Regained increases by 55 minutes (5 × 11)

---

## Test 9: CSV File Upload

### Correct CSV Format:

Your CSV file **must have these exact column headers**:

| Date | Cigarettes | Smokeless (gutkha/paan) | Craving_Level (1-10) | Mood | Notes | Money_Saved (₹) |
|------|-----------|--------------------------|---------------------|------|-------|-----------------||
| 01-12-2024 | 10 | 2 | 8 | Anxious | First day | 65 |
| 02-12-2024 | 8 | 1 | 7 | Good | Feeling better | 145 |
| 03-12-2024 | 5 | 0 | 5 | Happy | Great progress | 245 |

### Steps:
1. Create a CSV file with the headers shown above
2. On Dashboard, click **"CSV Format"** button to see the template
3. Click **"Upload CSV"** button
4. Select your CSV file (.csv or .xlsx)
5. Click "Upload" to import

### Required Columns:
- ✅ **Date** (required): Format `DD-MM-YYYY` (e.g., 01-12-2024)
- ✅ **Cigarettes** (required): Number value (0+)

### Optional Columns:
- 📋 **Smokeless (gutkha/paan)**: Number value
- 📋 **Craving_Level (1-10)**: Number 1-10
- 📋 **Mood**: Text (e.g., Happy, Anxious, Good)
- 📋 **Notes**: Any text notes
- 📋 **Money_Saved (₹)**: Amount in rupees

### Expected Results:
- [x] Success message: "X logs uploaded successfully"
- [x] Charts and stats update with new data
- [x] All entries appear in your logs

### Troubleshooting:
- **Missing Date or Cigarettes columns?** → Upload fails (these are required)
- **Wrong date format?** → Use YYYY-MM-DD format
- **No valid rows?** → Check if data rows are empty
- **Column names different?** → Must use exact headers shown in "CSV Format" guide

---

## Test 10: Logout Flow

### Steps:
1. While logged in, click "Logout" button
2. Observe changes

### Expected Results:
- [x] Redirected to home or login page
- [x] "Login/Signup" button reappears
- [x] localStorage cleared (no token)
- [x] Cannot access /dashboard (redirects)

---

## Test 11: Milestone Confetti

### Steps:
1. Create logs to reach 7 smoke-free days
2. (Alternative) Use CSV upload with 7+ days of 0 cigarettes

### Expected Results:
- [x] Confetti animation triggers at 7 days
- [x] Confetti triggers at 30 days
- [x] Confetti triggers at 100 days
- [x] Animation doesn't break page

---

## Test 12: Responsive Design

### Steps:
1. Open Chrome DevTools (F12)
2. Toggle device toolbar
3. Test at these viewports:
   - Mobile: 375 × 667 (iPhone SE)
   - Tablet: 768 × 1024 (iPad)
   - Desktop: 1280 × 800

### Expected Results:
- [x] No horizontal scrolling
- [x] Text readable at all sizes
- [x] Charts resize appropriately
- [x] Navigation works on mobile
- [x] Forms usable on all devices

---

## Test 13: API Endpoints (Manual)

Use curl or Postman to test API directly:

### Get All States
\`\`\`bash
curl http://localhost:5000/api/states
\`\`\`
Expected: JSON array of states

### Get Specific State
\`\`\`bash
curl http://localhost:5000/api/states/Maharashtra
\`\`\`
Expected: JSON object with state data

### Register User
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"api_test@test.com","password":"Test123!"}'
\`\`\`
Expected: JSON with token and user

### Login
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api_test@test.com","password":"Test123!"}'
\`\`\`
Expected: JSON with token

### Get Logs (Protected)
\`\`\`bash
curl http://localhost:5000/api/logs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
\`\`\`
Expected: JSON array of logs

---

## Test 14: Error Handling

### Steps:
1. Stop the backend server
2. Try to login on frontend
3. Check console for errors

### Expected Results:
- [x] User-friendly error message displayed
- [x] No unhandled exceptions
- [x] App doesn't crash

---

## Test 15: Browser Console

### Steps:
1. Open browser DevTools console
2. Navigate through all pages
3. Perform all actions

### Expected Results:
- [x] No JavaScript errors
- [x] No 404 resource errors
- [x] No CORS errors
- [x] Warnings acceptable but noted

---

## Bug Report Template

If you find a bug, use this template:

\`\`\`
**Bug Title:** [Brief description]

**Page/Feature:** [Where it occurred]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:** [What should happen]

**Actual Result:** [What actually happened]

**Browser:** [Chrome/Firefox/Safari version]

**Screenshot:** [If applicable]

**Console Errors:** [Copy any errors]
\`\`\`

---

## Sign-Off Checklist

- [ ] All 15 test sections completed
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Mobile experience good
- [ ] All API endpoints working
- [ ] Authentication secure
- [ ] Data persists correctly

**Tested By:** _______________
**Date:** _______________
**Build Version:** _______________
