const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const {
  Loan,
  User,
  Transaction,
} = require('../models');

exports.handleWebhook = async (req, res) => {

  const event = req.body;

  try {

    // Payment success
    if (event.type === 'payment_intent.succeeded') {

      const paymentIntent = event.data.object;

      console.log('✅ Payment received');

      /*
        Example:
        paymentIntent.metadata.loanId
      */

      const loanId = paymentIntent.metadata?.loanId;

      if (!loanId) {
        return res.status(400).json({
          error: 'Loan ID missing in metadata',
        });
      }

      // Find loan
      const loan = await Loan.findById(loanId)
        .populate('lender');

      if (!loan || !loan.lender) {
        return res.status(404).json({
          error: 'Loan or lender not found',
        });
      }

      const lender = loan.lender;

      // Total repayment amount
      const repaymentAmount = paymentIntent.amount;

      /*
        Example platform fee:
        10%
      */

      const platformFee = Math.floor(repaymentAmount * 0.10);

      // Lender gets remaining amount
      const lenderPayoutAmount =
        repaymentAmount - platformFee;

      // Transfer to lender
      const transfer = await stripe.transfers.create({
        amount: lenderPayoutAmount,
        currency: 'usd',
        destination: lender.stripeAccountId,
      });

      console.log('✅ Transfer sent to lender');

      // Save transaction
      await Transaction.create({
        loan: loan._id,
        type: 'payout',
        amount: lenderPayoutAmount / 100,
        stripePaymentIntentId: paymentIntent.id,
        stripeTransferId: transfer.id,
        paidTo: lender._id,
        status: 'completed',
      });
    }

    res.status(200).json({
      received: true,
    });

  } catch (error) {

    console.error('❌ Webhook Error:', error.message);

    res.status(500).json({
      error: error.message,
    });
  }
};