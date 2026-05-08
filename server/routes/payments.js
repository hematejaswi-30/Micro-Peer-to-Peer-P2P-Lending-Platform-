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

