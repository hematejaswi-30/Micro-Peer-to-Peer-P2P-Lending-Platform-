# Micro P2P Lending Platform

A peer-to-peer micro-lending platform that connects borrowers with lenders directly — eliminating the bank intermediary and enabling financial inclusion through democratised credit.

**Stack:** React.js · Node.js/Express · MongoDB/Mongoose · Stripe Connect  
**Team:** 4 developers · Lead + Dev A (Backend) + Dev B (Frontend) + Dev C (Payments)  
**Timeline:** ~8 weeks across 5 phases

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
3. [Team & Responsibilities](#team--responsibilities)
4. [GitHub Workflow](#github-workflow)
5. [Environment Variables](#environment-variables)
6. [Phase Checklist](#phase-checklist)
7. [API Overview](#api-overview)
8. [Security Rules](#security-rules)

---

## Project Structure

```
p2p-lending/
├── client/                        # React frontend (Dev B)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Login, Register forms
│   │   │   ├── common/            # Button, Input, Card, Badge, Navbar
│   │   │   ├── loans/             # LoanCard, LoanForm, BidList, RepayTable
│   │   │   └── dashboard/         # Stats cards, charts
│   │   ├── pages/                 # Page-level components (one per route)
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state — JWT in memory only
│   │   ├── hooks/                 # Custom React hooks (useLoans, useAuth, etc.)
│   │   └── utils/
│   │       └── api.js             # Axios instance — all API calls go through here
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                        # Express API (Lead + Dev A)
│   ├── models/
│   │   └── index.js               # ALL 5 Mongoose schemas (Lead-owned)
│   ├── routes/                    # Route definitions (Dev A builds controllers)
│   │   ├── auth.js
│   │   ├── loans.js
│   │   ├── payments.js
│   │   └── webhooks.js
│   ├── controllers/               # Business logic (Dev A + Dev C)
│   ├── middleware/
│   │   ├── auth.js                # verifyToken, requireRole
│   │   └── errorHandler.js        # Global error handler
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── tests/                     # Integration tests (Phase 4)
│   └── index.js                   # Server entry point
│
├── docs/                          # Architecture decisions, notes
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions — runs on every PR
├── .env.example                   # ← Copy this to .env and fill in values
└── .gitignore
```

---

## Getting Started

**Prerequisites:** Node.js 18+, npm, MongoDB Atlas account, Stripe account

### 1. Clone and set up environment

```bash
git clone https://github.com/<your-org>/p2p-lending.git
cd p2p-lending

# Create your local .env files from the template
cp .env.example server/.env
# Open server/.env and fill in MONGO_URI, JWT_SECRET, and Stripe keys
```

### 2. Install and run the backend

```bash
cd server
npm install
npm run dev
# Server starts at http://localhost:5000
# Health check: GET http://localhost:5000/health
```

### 3. Install and run the frontend

```bash
cd client
npm install
npm run dev
# App opens at http://localhost:5173
# Vite proxies /api/* to localhost:5000 automatically
```

---

## Team & Responsibilities

| Member | Role | Phase 0 Task | Main Phases |
|--------|------|--------------|-------------|
| **Lead (You)** | Architecture, schemas, GitHub, security reviews | Repo setup, data models, CI | All phases |
| **Dev A** | Backend — Node/Express/MongoDB | Atlas cluster + Express scaffold | Phase 1, 2, 3 |
| **Dev B** | Frontend — React/Tailwind/Context API | Vite + Tailwind scaffold | Phase 1, 2, 3 |
| **Dev C** | Payments — Stripe Connect | Stripe test account setup | Phase 1, 2, 3 |

**The Lead is the only person who merges into `main`.** All financial logic lives exclusively in the backend — no amount calculations or Stripe calls in the React code. This rule is enforced in every PR review.

---

## GitHub Workflow

### Branch structure

```
main          ← production; Lead-only merges; all CI must pass
  └── dev     ← integration branch; everyone targets this in PRs
        └── feature/auth-backend      (Dev A)
        └── feature/auth-frontend     (Dev B)
        └── feature/stripe-onboarding (Dev C)
        └── fix/loan-status-bug       (whoever finds it)
```

### Rules

1. **Never push directly to `main` or `dev`.** Always open a PR.
2. **Branch naming:** `feature/short-description`, `fix/short-description`, `chore/short-description`.
3. **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add loan bid endpoint`
   - `fix: handle duplicate email error`
   - `chore: update dependencies`
   - `docs: add API section to README`
4. **Every PR requires at least 1 review.** PRs touching payment logic require Lead review and must be tagged `security-review`.
5. **CI must pass** (lint + tests) before any PR can be merged.

### Step-by-step for a feature

```bash
# Start from an up-to-date dev branch
git checkout dev
git pull origin dev

# Create your feature branch
git checkout -b feature/auth-backend

# ... write code, commit often ...

git add .
git commit -m "feat: add register and login endpoints"
git push origin feature/auth-backend

# Open a PR on GitHub: feature/auth-backend → dev
# Request review from Lead
```

---

## Environment Variables

Copy `.env.example` to `server/.env` and fill in all values. **Never commit `.env` to Git.**

| Variable | Description | Who provides it |
|----------|-------------|-----------------|
| `PORT` | Express server port (default: 5000) | Dev A |
| `MONGO_URI` | MongoDB Atlas connection string | Dev A |
| `JWT_SECRET` | Secret for signing JWTs — use a long random string | Lead |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) | Lead |
| `STRIPE_SECRET_KEY` | Stripe secret key (starts with `sk_test_`) | Dev C |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_`) | Dev C |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_`) | Dev C |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) | Lead |

**Never commit a real Stripe secret key or MongoDB password.** If this happens by accident, rotate the key immediately.

---

## Phase Checklist

### Phase 0 — Setup (Week 1)
- [x] GitHub repo created with `main` and `dev` branches
- [x] `.gitignore` and `.env.example` committed
- [x] Server scaffold: `index.js`, all routes, middleware, `config/db.js`
- [x] All 5 Mongoose schemas in `server/models/index.js`
- [x] Client scaffold: Vite + React + Tailwind + `AuthContext.jsx`
- [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- [ ] **Dev A:** MongoDB Atlas cluster created, `MONGO_URI` shared via .env
- [ ] **Dev C:** Stripe test account created, keys shared via .env
- [ ] **Everyone:** Clone repo, run locally, confirm health check works

### Phase 1 — Auth & Stripe Onboarding (Weeks 2–3)
- [ ] Dev A: `/api/auth/register`, `/api/auth/login`, JWT middleware
- [ ] Dev A: Role-based access middleware (`requireRole`)
- [ ] Dev B: `AuthContext` actions implemented, Login + Register pages
- [x] Dev C: Stripe Express Connected Account creation, onboarding link endpoint

### Phase 2 — Loan Lifecycle & Funding (Weeks 3–5)
- [ ] Dev A: Loan CRUD, Bid API, loan matching, ACID transaction on funding
- [ ] Dev B: Borrower dashboard, Lender marketplace
- [ ] Dev C: `POST /api/payments/create-intent`, Stripe webhook handler

### Phase 3 — Repayment & Payouts (Weeks 5–7)
- [ ] Dev A: EMI calculator, Repayment API
- [ ] Lead: Loan state machine (`loanService.js`)
- [ ] Dev C: Stripe Transfer to lender, payout tracking
- [ ] Dev B: Repayment UI, Lender portfolio dashboard

### Phase 4 — Testing & Deployment (Weeks 7–8)
- [ ] Dev A: Integration tests (Jest + Supertest)
- [ ] Dev C: Stripe E2E test with test card numbers
- [ ] Dev B: React Testing Library unit tests
- [ ] Lead: Security audit, CI finalised, deploy backend + frontend

---

## API Overview

All endpoints are prefixed with `/api`. Authentication uses `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | No | Any | Create a new user account |
| POST | `/auth/login` | No | Any | Login and receive JWT |
| GET | `/auth/me` | Yes | Any | Get current user profile |
| POST | `/loans` | Yes | Borrower | Create a loan request |
| GET | `/loans` | No | Any | List open loan requests (marketplace) |
| GET | `/loans/:id` | No | Any | Get single loan details |
| POST | `/loans/:id/bids` | Yes | Lender | Place a bid on a loan |
| GET | `/loans/:id/bids` | Yes | Any | List bids on a loan |
| PATCH | `/loans/:id/bids/:bidId` | Yes | Borrower | Accept or reject a bid |
| POST | `/loans/:id/repay` | Yes | Borrower | Make a repayment instalment |
| POST | `/payments/create-intent` | Yes | Lender | Create Stripe PaymentIntent to fund loan |
| POST | `/payments/create-account` | Yes | Lender | Create Stripe Express connected account |
| GET | `/payments/account-link` | Yes | Lender | Get Stripe onboarding URL |
| POST | `/webhooks/stripe` | No (signed) | — | Stripe event handler |

---

## Security Rules

These are non-negotiable and enforced in every PR review.

1. **Payment amounts always come from the database.** No Stripe API call may use an amount supplied by the client request body. The backend reads the loan amount from MongoDB and passes it to Stripe.

2. **JWT stored in memory only.** Never in `localStorage` or `sessionStorage`. The `AuthContext` scaffold already enforces this — do not change the storage strategy without Lead approval.

3. **Verify Stripe webhook signatures.** Use `stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)` before processing any webhook event.

4. **Multi-document state changes use ACID transactions.** Any operation that touches more than one MongoDB collection (e.g., update Loan + insert Transaction) must use `mongoose.startSession()` + `session.withTransaction()`.

5. **Never log sensitive data.** No `console.log` of passwords, tokens, or Stripe keys — especially not in production code paths.
