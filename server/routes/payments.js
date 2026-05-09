const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');

// 🔐 Protected routes
router.use(authMiddleware.protect);

// Public config for authenticated users
router.get('/config', (req, res) => {
  res.status(200).json({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

// Lenders only actions
router.use(authMiddleware.restrictTo('lender'));
router.post('/create-account', paymentController.createConnectAccount);
router.get('/account-link', paymentController.getOnboardingLink);
router.post('/create-intent', paymentController.createPaymentIntent);

module.exports = router;

