// ─── Loan Routes ─────────────────────────────────────────────
// TODO (Phase 2 — Dev A): Implement all loan endpoints
// POST   /api/loans                         — borrower creates loan request
// GET    /api/loans                         — list open loans (marketplace)
// GET    /api/loans/:id                     — get single loan
// PATCH  /api/loans/:id/status              — internal: update loan status
// POST   /api/loans/:id/bids                — lender places a bid
// GET    /api/loans/:id/bids                — list bids on a loan
// PATCH  /api/loans/:id/bids/:bidId         — borrower accepts/rejects a bid
// POST   /api/loans/:id/repay               — borrower makes a repayment

const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/auth');

// 🌐 Public routes
router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);

// 🔐 Protected routes
router.use(authMiddleware.protect);

// My Dashboard data
router.get('/my/all', loanController.getMyLoans);

// Borrower actions
router.post('/', authMiddleware.restrictTo('borrower'), loanController.createLoan);
router.patch('/:loanId/bids/:bidId', authMiddleware.restrictTo('borrower'), bidController.acceptBid);
router.get('/:loanId/repayments', loanController.getRepaymentSchedule);
router.post('/:loanId/repay/:installmentId', authMiddleware.restrictTo('borrower'), loanController.repayLoan);

// Lender actions
router.post('/:loanId/bids', authMiddleware.restrictTo('lender'), bidController.placeBid);
router.get('/:loanId/bids', bidController.getLoanBids);

module.exports = router;
