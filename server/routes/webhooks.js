// ─── Stripe Webhook Handler ──────────────────────────────────
// TODO (Phase 2 — Dev C): Implement webhook handler
// POST /api/webhooks/stripe
//
// IMPORTANT: This route must receive the RAW body, not JSON-parsed.
// In index.js, the line:
//   app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }))
// must appear BEFORE app.use(express.json()). This is already done in the scaffold.
//
// Events to handle:
//   payment_intent.succeeded  → update Loan status to 'funded', create Transaction
//   account.updated           → mark lender stripeOnboardingComplete = true
//   transfer.created          → record payout Transaction

const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Stripe requires the raw body to verify the signature
// This is already handled in server/index.js with express.raw()
router.post('/stripe', webhookController.handleStripeWebhook);

module.exports = router;
