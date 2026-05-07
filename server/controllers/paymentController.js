const stripe = require('../config/stripe');
const { User } = require('../models');

/**
 * Create a Stripe Express Connected Account for a lender
 * POST /api/payments/create-account
 */
exports.createAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'lender') {
      return res.status(403).json({ error: 'Only lenders can create a Stripe account' });
    }

    if (user.stripeAccountId) {
      return res.status(400).json({ error: 'Stripe account already exists for this user' });
    }

    // Create Stripe Express Account
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Save account ID to user
    user.stripeAccountId = account.id;
    await user.save();

    res.status(201).json({
      message: 'Stripe account created successfully',
      stripeAccountId: account.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate a Stripe onboarding link for a lender
 * GET /api/payments/account-link
 */
exports.getOnboardingLink = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.stripeAccountId) {
      return res.status(400).json({ error: 'Stripe account not found. Create one first.' });
    }

    // Generate Account Link
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${process.env.CLIENT_URL}/stripe-refresh`,
      return_url: `${process.env.CLIENT_URL}/dashboard?stripe=success`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    next(error);
  }
};
