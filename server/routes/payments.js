const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All payment routes require authentication
router.use(verifyToken);

/**
 * @route   POST /api/payments/create-account
 * @desc    Create a Stripe Express connected account (lender only)
 */
router.post('/create-account', requireRole('lender'), paymentController.createAccount);

/**
 * @route   GET /api/payments/account-link
 * @desc    Get onboarding URL for lender
 */
router.get('/account-link', requireRole('lender'), paymentController.getOnboardingLink);

module.exports = router;

