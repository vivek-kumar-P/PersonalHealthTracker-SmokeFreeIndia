<div align="center">
  <h1>SmokeFree India</h1>
  <p><strong>India's Premier Quit Smoking Platform - Data-Driven Insights & Personal Tracking</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Chart.js-4.4-FF6384?style=flat-square&logo=chartdotjs" alt="Chart.js" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#demo">Demo</a> •
    <a href="#installation">Installation</a> •
    <a href="#charts--visualizations">Charts</a> •
    <a href="#api-documentation">API</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## Overview

**SmokeFree India** is a comprehensive full-stack health application empowering individuals to quit smoking through data-driven insights, interactive visualizations, and personal progress tracking. The platform features real tobacco usage statistics from the GATS India survey covering all 29 Indian states and 8 Union Territories, along with powerful personal tracking tools.

### Why SmokeFree India?

- **Data-Driven Approach**: Real statistics from GATS India survey for all 37 states/UTs
- **17+ Interactive Charts**: Comprehensive visualizations using Chart.js with hover effects
- **Personal Tracking**: Monitor daily consumption, money saved, and health improvements
- **Sample Journey**: View a real 30-day quit journey to inspire your own path
- **Milestone Celebrations**: Confetti animations at 7, 30, and 100 smoke-free days
- **Mobile Responsive**: Optimized for all devices with minimalist design

---

## Demo

### Landing Page
The landing page features:
- Dynamic hero section with animated background gradients
- Interactive journey timeline with hover effects
- Feature cards with image transitions
- Real testimonials with statistics
- Call-to-action sections

### States Insights Page
View comprehensive tobacco statistics for any Indian state with 9 different chart types and real GATS survey data.

### Sample Journey Page
Explore a real 30-day quit journey with 8 interactive charts showing progress, cravings, mood, and savings.

---

## Features

### Public Pages (No Login Required)

| Page | Description |
|------|-------------|
| **Home** | Interactive landing page with animations, hover effects, and motivational content |
| **All States Insights** | 9 Chart.js visualizations for 37 states/UTs with real GATS survey data |
| **Sample Journey** | 30-day quit journey showcase with 8 charts and detailed statistics |

### Protected Pages (Login Required)

| Page | Description |
|------|-------------|
| **My Dashboard** | Personal tracking with daily logs, 6 chart types, and milestone celebrations |
| **CSV Upload** | Bulk import smoking logs via CSV/Excel files |

---

## Charts & Visualizations

SmokeFree India features **17+ interactive charts** powered by Chart.js with smooth animations and hover effects.

### States Insights Charts (9 Types)

| Chart | Type | Description | Hover Effect |
|-------|------|-------------|--------------|
| **Prevalence Comparison** | Horizontal Bar | Overall tobacco usage metrics | Scale + highlight |
| **Smoked vs Smokeless** | Doughnut | Distribution between tobacco types | Offset animation |
| **Product Types** | Pie | Cigarettes, Bidis, Paan Masala breakdown | Scale + rotate |
| **Urban vs Rural** | Grouped Bar | Regional consumption comparison | Bar highlight |
| **Quit Attempts** | Radar | Cessation behavior profile (tried, wanted, quit) | Point enlarge |
| **Exposure Locations** | Polar Area | Where youth encounter tobacco smoke | Segment scale |
| **Age of Initiation** | Line (Filled) | When tobacco use typically begins | Point + crosshair |
| **E-Cigarette Awareness** | Bar | Modern tobacco trends & future risk | Bar glow |
| **State vs India** | Bar | Benchmark against national average | Comparison highlight |

### Sample Journey Charts (8 Types)

| Chart | Type | Description | Data Points |
|-------|------|-------------|-------------|
| **Daily Consumption** | Line | Cigarettes & smokeless over 30 days | 30 days |
| **Craving Levels** | Line (Gradient) | Craving intensity trend | 30 days |
| **Money Saved** | Line (Filled) | Cumulative savings in INR | 30 days |
| **Weekly Summary** | Bar | Average consumption per week | 4 weeks |
| **Mood Distribution** | Doughnut | Mood frequency breakdown | 10 moods |
| **Progress Phases** | Pie | Journey phases (Heavy → Smoke-Free) | 4 phases |
| **Health Metrics** | Radar | Comprehensive health score | 5 metrics |
| **Daily Progress** | Stacked Bar | Combined view of all metrics | 30 days |

### Personal Dashboard Charts (6 Types)

| Chart | Type | Description |
|-------|------|-------------|
| **Daily Trend** | Line | Personal cigarette consumption over time |
| **Weekly Pattern** | Bar | Average by day of week |
| **Calendar Heatmap** | Custom | Visual consumption history |
| **Money Saved** | Counter | Real-time savings calculator |
| **Days Smoke-Free** | Counter | Streak counter with confetti |
| **Life Regained** | Counter | Minutes/hours of life gained |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Library |
| TypeScript | 5.6 | Type Safety |
| Vite | 6.0 | Build Tool |
| Tailwind CSS | 4.1 | Styling |
| Chart.js | 4.4 | Visualizations |
| React Router | 6.28 | Navigation |
| Canvas Confetti | 1.9 | Celebrations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.18 | API Framework |
| MongoDB | 8.0 | Database |
| Mongoose | 8.0 | ODM |
| JWT | 9.0 | Authentication |
| Bcrypt | 5.1 | Password Hashing |
| Multer | 1.4 | File Upload |
| SheetJS | 0.20 | CSV/Excel Parsing |

---

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite + TypeScript)              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │     Home     │  │    States    │  │   Sample     │               │
│  │  (Landing)   │  │   Insights   │  │   Journey    │               │
│  │  Interactive │  │  9 Charts    │  │  8 Charts    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐                                 │
│  │  Dashboard   │  │    Login     │    Auth Context                 │
│  │  (Protected) │  │   Signup     │    API Layer                    │
│  │  6 Charts    │  │              │    State Mgmt                   │
│  └──────────────┘  └──────────────┘                                 │
│                                                                      │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ REST API (HTTP/JSON)
┌───────────────────────────┴─────────────────────────────────────────┐
│                    Backend (Node.js + Express)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  Auth API    │  │  States API  │  │   Logs API   │               │
│  │  /api/auth   │  │  /api/states │  │  /api/logs   │               │
│  │  JWT + BCrypt│  │  GATS Data   │  │  CRUD + CSV  │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                      │
│                    JWT Middleware Protection                         │
│                                                                      │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud Database)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │    users     │  │    states    │  │     logs     │               │
│  │  - email     │  │  - name      │  │  - userId    │               │
│  │  - password  │  │  - type      │  │  - date      │               │
│  │  - createdAt │  │  - 30+ fields│  │  - cigarettes│               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## Project Structure

\`\`\`
smokefree-india/
│
├── src/                              # Frontend Source
│   ├── components/                   # React Components
│   │   ├── navbar.tsx               # Navigation bar
│   │   ├── footer.tsx               # Footer
│   │   ├── protected-route.tsx      # Auth protection
│   │   └── ui/                      # UI components
│   │
│   ├── pages/                        # Page Components
│   │   ├── home.tsx                 # Landing page (interactive)
│   │   ├── states.tsx               # States insights (9 charts)
│   │   ├── sample-journey.tsx       # Sample journey (8 charts)
│   │   ├── dashboard.tsx            # Personal dashboard (6 charts)
│   │   └── login.tsx                # Auth page
│   │
│   ├── lib/                          # Utilities
│   │   ├── api.ts                   # API client
│   │   ├── auth-context.tsx         # Auth provider
│   │   └── india-states-data.ts     # GATS survey data (37 states)
│   │
│   ├── App.tsx                       # Router setup
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
│
├── server/                           # Backend Source
│   ├── models/                       # MongoDB Schemas
│   │   ├── User.js                  # User model
│   │   ├── State.js                 # State data model
│   │   └── Log.js                   # Personal logs model
│   │
│   ├── routes/                       # API Routes
│   │   ├── auth.js                  # /api/auth/*
│   │   ├── states.js                # /api/states/*
│   │   └── logs.js                  # /api/logs/*
│   │
│   ├── middleware/                   # Middleware
│   │   └── auth.js                  # JWT verification
│   │
│   ├── scripts/                      # Database Scripts
│   │   └── seedStates.js            # Seed GATS data
│   │
│   ├── index.js                      # Server entry
│   ├── .env                          # Environment vars
│   └── package.json                  # Dependencies
│
├── tests/                            # Test Suite
│   ├── api/                         # API tests (Jest)
│   ├── e2e/                         # E2E tests (Puppeteer)
│   └── MANUAL_TESTING_GUIDE.md      # Manual test scenarios
│
├── cypress/                          # Cypress E2E
│   └── e2e/                         # Cypress specs
│
├── public/                           # Static Assets
│   └── *.jpg                        # Images
│
├── app/                              # Next.js Preview (v0)
│   └── page.tsx                     # Preview page
│
├── package.json                      # Frontend deps
├── vite.config.ts                   # Vite config
├── tsconfig.json                    # TypeScript config
└── README.md                        # This file
\`\`\`

---

## Installation

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Free Signup](https://www.mongodb.com/cloud/atlas/register))
- **Git** (optional)

### Quick Start

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/yourusername/smokefree-india.git
cd smokefree-india

# 2. Install dependencies
npm install
cd server && npm install && cd ..

# 3. Configure environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI

# 4. Seed the database
npm run seed

# 5. Start the application
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev

# 6. Open http://localhost:3000
\`\`\`

### Environment Variables

Create `server/.env`:

\`\`\`env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/smokefree-india

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Port
PORT=5000
\`\`\`

---

## API Documentation

### Authentication

\`\`\`http
POST /api/auth/register
Content-Type: application/json

{ "email": "user@example.com", "password": "securepass123" }

Response: { "token": "eyJhbG...", "userId": "..." }
\`\`\`

\`\`\`http
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "securepass123" }

Response: { "token": "eyJhbG...", "userId": "..." }
\`\`\`

### States Data

\`\`\`http
GET /api/states
Response: [{ "name": "Maharashtra", "tobaccoPrevalence": 23.7, ... }]

GET /api/states/:stateName
Response: { "name": "Maharashtra", "data": [...] }
\`\`\`

### Personal Logs (Protected)

\`\`\`http
GET /api/logs
Authorization: Bearer <token>
Response: [{ "date": "2024-01-15", "cigarettes": 5, ... }]

POST /api/logs
Authorization: Bearer <token>
{ "date": "2024-01-15", "cigarettes": 5, "smokeless": 0, "notes": "..." }

POST /api/logs/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
file: <your-file.csv>
\`\`\`

---

## Data Sources

### GATS India Survey Data

The States Insights page uses real data from the **Global Adult Tobacco Survey (GATS) India**, including:

- **30+ metrics** per state including:
  - Current & ever tobacco users (%)
  - Smoked vs smokeless breakdown
  - Cigarette, Bidi, Paan Masala usage
  - Quit attempt statistics
  - Exposure locations
  - E-cigarette awareness
  - Age of initiation

- **Coverage**: All 29 states + 8 Union Territories
- **Breakdown**: Total, Urban, Rural for each state

### Sample Journey Data

A real 30-day quit journey CSV demonstrating:
- Daily cigarette and smokeless consumption reduction
- Craving levels (1-10 scale)
- Mood tracking (10 mood types)
- Money saved calculations
- Personal notes and milestones

---

## Health Calculations

| Metric | Formula |
|--------|---------|
| **Money Saved** | `cigarettes_not_smoked × ₹10` |
| **Life Regained** | `cigarettes_not_smoked × 11 minutes` |
| **Estimated Users** | `state_population × prevalence%` |
| **Estimated Deaths** | Based on WHO mortality data |

---

## Testing

### Automated Tests

\`\`\`bash
# Run all tests
cd tests && npm test

# API tests only
npm run test:api

# E2E tests only
npm run test:e2e

# Cypress interactive
npx cypress open
\`\`\`

### Manual Testing

See `tests/MANUAL_TESTING_GUIDE.md` for 15 comprehensive test scenarios.

---

## Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add env: `VITE_API_URL=https://your-api.com`

### Backend (Render/Railway)

1. Deploy `server/` directory
2. Set environment variables
3. Start command: `npm start`

---

## Design Philosophy

- **Color Palette**: Emerald/Teal (#10b981) on white
- **Typography**: Inter font family
- **Layout**: Flexbox-first, mobile responsive
- **Animations**: Smooth 300ms transitions
- **Charts**: Consistent emerald color scheme
- **Accessibility**: WCAG AA compliant

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/Amazing`)
3. Commit changes (`git commit -m 'Add Amazing'`)
4. Push to branch (`git push origin feature/Amazing`)
5. Open Pull Request

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Verify URI and IP whitelist |
| Port 5000 in use | Change PORT in .env |
| JWT errors | Clear localStorage, re-login |
| Charts not loading | Check Chart.js imports |
| CSV upload fails | Verify CSV format matches spec |

---

## License

MIT License - see [LICENSE](LICENSE) file.

---

## Acknowledgments

- **Data**: [Youth Tobacco Survey - Kaggle](https://www.kaggle.com/datasets/anshtanwar/youth-tobacco-survey)
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **UI**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

<div align="center">
  <p><strong>Made with care for a healthier India</strong></p>
  <p>Star this repo if you found it helpful!</p>
</div>
