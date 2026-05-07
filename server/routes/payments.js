// ─── Payment Routes ──────────────────────────────────────────
// TODO (Phase 2 — Dev C): Implement Stripe payment endpoints
// POST /api/payments/create-intent     — create PaymentIntent for loan funding
// POST /api/payments/create-account    — create Stripe Express connected account (lender)
// GET  /api/payments/account-link      — get onboarding URL for lender

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

// 🔐 Protected routes — Lenders only
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('lender'));

router.post('/create-account', paymentController.createConnectAccount);
router.get('/account-link', paymentController.getOnboardingLink);

module.exports = router;
