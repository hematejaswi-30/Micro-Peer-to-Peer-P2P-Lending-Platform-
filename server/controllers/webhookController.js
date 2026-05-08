const stripe = require('../config/stripe');
const { Loan, User, Transaction } = require('../models');
const mongoose = require('mongoose');
const loanService = require('../services/loanService');

/**
 * Stripe Webhook Handler
 */
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const type = paymentIntent.metadata?.type;

        if (type === 'loan_funding') {
          await handleLoanFunding(paymentIntent);
        } else if (type === 'repayment') {
          await handleLoanRepayment(paymentIntent);
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('❌ Error processing webhook event:', err.message);
    res.status(500).json({ error: 'Internal server error processing webhook' });
  }
};

/**
 * Logic for successful loan funding (Phase 2)
 */
async function handleLoanFunding(paymentIntent) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const loanId = paymentIntent.metadata.loanId;
    const loan = await Loan.findById(loanId);

    if (!loan || loan.status !== 'awaiting_payment') {
      console.warn('Loan not found or already funded:', loanId);
      return;
    }

    // 1) Update Loan
    loan.status = 'funded';
    loan.fundedAt = new Date();
    await loan.save({ session });

    // 2) Create Transaction record
    await Transaction.create([{
      loan: loan._id,
      type: 'funding',
      amount: loan.amount,
      stripePaymentIntentId: paymentIntent.id,
      paidBy: loan.lender,
      status: 'completed'
    }], { session });

    await session.commitTransaction();
    console.log(`✅ Loan ${loanId} successfully funded.`);

    // 3) Trigger state machine to generate EMI schedule
    await loanService.finalizeFunding(loanId);
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Logic for successful repayment & payout to lender (Phase 3)
 */
async function handleLoanRepayment(paymentIntent) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const loanId = paymentIntent.metadata?.loanId;
    if (!loanId) throw new Error('Loan ID missing in metadata');

    const loan = await Loan.findById(loanId).populate('lender');
    if (!loan || !loan.lender) throw new Error('Loan or lender not found');

    const lender = loan.lender;
    const repaymentAmount = paymentIntent.amount; // in cents

    // Calculate platform fee (10%)
    const platformFee = Math.floor(repaymentAmount * 0.10);
    const lenderPayoutAmount = repaymentAmount - platformFee;

    // 1) Transfer to lender
    const transfer = await stripe.transfers.create({
      amount: lenderPayoutAmount,
      currency: 'inr',
      destination: lender.stripeAccountId,
    });

    // 2) Save transaction record
    await Transaction.create([{
      loan: loan._id,
      type: 'payout',
      amount: lenderPayoutAmount / 100,
      stripePaymentIntentId: paymentIntent.id,
      stripeTransferId: transfer.id,
      paidTo: lender._id,
      status: 'completed',
    }], { session });

    // Note: In a full implementation, we would also update the RepaymentSchedule status here.
    // For now, we commit the payout transaction.

    await session.commitTransaction();
    console.log('✅ Repayment received and transfer sent to lender');
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
