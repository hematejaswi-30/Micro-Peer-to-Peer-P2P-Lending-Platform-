const stripe = require('../config/stripe');
const { Loan, Transaction } = require('../models');
const mongoose = require('mongoose');

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
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      if (paymentIntent.metadata.type === 'loan_funding') {
        await handleLoanFunding(paymentIntent);
      }
      break;
    }
    
    // Add other cases as needed (e.g., payment_intent.payment_failed)
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

/**
 * Logic for successful loan funding
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
  } catch (err) {
    await session.abortTransaction();
    console.error('❌ Error handling loan funding webhook:', err.message);
  } finally {
    session.endSession();
  }
}
