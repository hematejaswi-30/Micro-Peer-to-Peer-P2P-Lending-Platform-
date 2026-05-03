// ─── Payment Routes ──────────────────────────────────────────
// TODO (Phase 2 — Dev C): Implement Stripe payment endpoints
// POST /api/payments/create-intent     — create PaymentIntent for loan funding
// POST /api/payments/create-account    — create Stripe Express connected account (lender)
// GET  /api/payments/account-link      — get onboarding URL for lender

const express = require('express');
const router = express.Router();

router.all('*', (req, res) => {
  res.status(501).json({ message: 'Payment routes not implemented yet — Phase 2 task for Dev C.' });
});

module.exports = router;
