const { Loan } = require('../models');

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
