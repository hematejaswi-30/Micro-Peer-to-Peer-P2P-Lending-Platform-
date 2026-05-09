const { Loan, RepaymentSchedule } = require('../models');
const stripe = require('../config/stripe');

/**
 * Create Loan Request (Borrowers only)
 */
exports.createLoan = async (req, res) => {
  try {
    const { amount, purpose, interestRate, termMonths } = req.body;

    const newLoan = await Loan.create({
      borrower: req.user.id,
      amount,
      purpose,
      interestRate,
      termMonths,
    });

    res.status(201).json({
      status: 'success',
      loan: newLoan
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get All Open Loans (Marketplace)
 */
exports.getAllLoans = async (req, res) => {
  try {
    // Only show 'pending' loans in the marketplace
    const loans = await Loan.find({ status: 'pending' })
      .populate('borrower', 'name')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: loans.length,
      loans
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get Single Loan Detail
 */
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('borrower', 'name')
      .populate({
        path: 'acceptedBid',
        populate: { path: 'lender', select: 'name' }
      });

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json({
      status: 'success',
      loan
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get My Loans (Borrower: requested, Lender: funded)
 */
exports.getMyLoans = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'borrower') {
      query = { borrower: req.user.id };
    } else {
      query = { lender: req.user.id };
    }

    const loans = await Loan.find(query).sort('-updatedAt');

    res.status(200).json({
      status: 'success',
      results: loans.length,
      loans
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get Repayment Schedule for a Loan
 */
exports.getRepaymentSchedule = async (req, res) => {
  try {
    const { loanId } = req.params;

    // Verify loan exists and user is part of it
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.borrower.toString() !== req.user.id && loan.lender.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this schedule' });
    }

    const schedule = await RepaymentSchedule.find({ loan: loanId }).sort('instalmentNumber');

    res.status(200).json({
      status: 'success',
      schedule
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Initiate Repayment for an Installment
 */
exports.repayLoan = async (req, res) => {
  try {
    const { loanId, installmentId } = req.params;

    // 1) Find the installment
    const installment = await RepaymentSchedule.findOne({
      _id: installmentId,
      loan: loanId,
      status: { $ne: 'paid' }
    }).populate('loan');

    if (!installment) {
      return res.status(404).json({ error: 'Installment not found or already paid' });
    }

    // 2) Verify borrower
    if (installment.loan.borrower.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the borrower can repay this loan' });
    }

    // 3) Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(installment.totalAmount * 100), // cents
      currency: 'inr',
      payment_method_types: ['card'],
      metadata: {
        loanId: loanId,
        installmentId: installmentId,
        type: 'repayment'
      }
    });

    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
      installment
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
