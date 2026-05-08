const { Bid, Loan } = require('../models');
const mongoose = require('mongoose');

/**
 * Place Bid (Lenders only)
 */
exports.placeBid = async (req, res) => {
  try {
    const { proposedRate, message } = req.body;
    const loanId = req.params.loanId;

    // 1) Check if loan exists and is pending
    const loan = await Loan.findById(loanId);
    if (!loan || loan.status !== 'pending') {
      return res.status(400).json({ error: 'Loan is not available for bidding' });
    }

    // 2) Check if lender already bid
    const existingBid = await Bid.findOne({ loan: loanId, lender: req.user.id });
    if (existingBid) {
      return res.status(400).json({ error: 'You have already placed a bid on this loan' });
    }

    // 3) Create bid
    const newBid = await Bid.create({
      loan: loanId,
      lender: req.user.id,
      proposedRate,
      message,
    });

    res.status(201).json({
      status: 'success',
      bid: newBid
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get Bids for a Loan
 */
exports.getLoanBids = async (req, res) => {
  try {
    const bids = await Bid.find({ loan: req.params.loanId })
      .populate('lender', 'name stripeOnboardingComplete')
      .sort('proposedRate');

    res.status(200).json({
      status: 'success',
      results: bids.length,
      bids
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Accept Bid (Borrowers only)
 */
exports.acceptBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { loanId, bidId } = req.params;

    // 1) Verify loan belongs to borrower and is pending
    const loan = await Loan.findOne({ _id: loanId, borrower: req.user.id });
    if (!loan || loan.status !== 'pending') {
      throw new Error('Loan not found or already processed');
    }

    // 2) Verify bid exists and belongs to this loan
    const bid = await Bid.findOne({ _id: bidId, loan: loanId });
    if (!bid) {
      throw new Error('Bid not found');
    }

    // 3) Update Loan status and set acceptedBid
    loan.status = 'awaiting_payment';
    loan.acceptedBid = bid._id;
    loan.lender = bid.lender;
    loan.interestRate = bid.proposedRate; // use the negotiated rate
    await loan.save({ session });

    // 4) Update Bid status
    bid.status = 'accepted';
    await bid.save({ session });

    // 5) Reject all other bids for this loan
    await Bid.updateMany(
      { loan: loanId, _id: { $ne: bidId } },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();
    
    res.status(200).json({
      status: 'success',
      message: 'Bid accepted. Awaiting payment from lender.',
      loan
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};
