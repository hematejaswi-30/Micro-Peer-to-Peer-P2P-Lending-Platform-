const stripe = require('../config/stripe');
const { User, Loan } = require('../models');

/**
 * Create Stripe Express Account
 */
exports.createConnectAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.stripeAccountId) {
      return res.status(400).json({ error: 'Stripe account already exists' });
    }

    // 1) Create Express account
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // 2) Save ID to user
    user.stripeAccountId = account.id;
    await user.save();

    res.status(200).json({
      status: 'success',
      stripeAccountId: account.id
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Create Account Link for Onboarding
 */
exports.getOnboardingLink = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.stripeAccountId) {
      // Auto-create if not exists
      const account = await stripe.accounts.create({ type: 'express' });
      user.stripeAccountId = account.id;
      await user.save();
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${process.env.CLIENT_URL}/dashboard`,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
      type: 'account_onboarding',
    });

    res.status(200).json({
      status: 'success',
      url: accountLink.url
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Create Payment Intent to Fund Loan (Lenders only)
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { loanId } = req.body;

    // 1) Find the loan
    const loan = await Loan.findOne({
      _id: loanId,
      lender: req.user.id,
      status: 'awaiting_payment'
    }).populate('borrower', 'stripeAccountId');

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found or not ready for payment' });
    }

    // 2) Create Payment Intent
    // In a real P2P app, we might use "destination" charges or "separate charges and transfers"
    // Here we use a simple PaymentIntent. The platform receives the funds.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: loan.amount * 100, // Stripe expects amounts in cents
      currency: 'inr',
      payment_method_types: ['card'],
      metadata: {
        loanId: loan._id.toString(),
        type: 'loan_funding'
      }
    });

    // 3) Save intent ID to loan
    loan.stripePaymentIntentId = paymentIntent.id;
    await loan.save();

    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
