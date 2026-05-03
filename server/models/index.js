// ============================================================
//  P2P Lending Platform — Mongoose Schemas (Lead-owned)
//  ALL schema changes must be reviewed and merged by the Lead.
// ============================================================

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── 1. USER ────────────────────────────────────────────────
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    passwordHash: {
      type: String,
      required: true,
      select: false  // never returned in queries by default
    },
    role: {
      type: String,
      enum: ['borrower', 'lender'],
      required: [true, 'Role is required']
    },
    // Stripe Connect — populated after lender completes onboarding
    stripeAccountId: {
      type: String,
      default: null
    },
    stripeOnboardingComplete: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

// ─── 2. LOAN ────────────────────────────────────────────────
const loanSchema = new Schema(
  {
    borrower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: [500, 'Minimum loan amount is ₹500'],
      max: [500000, 'Maximum loan amount is ₹5,00,000']
    },
    purpose: {
      type: String,
      required: [true, 'Loan purpose is required'],
      trim: true,
      maxlength: [300, 'Purpose cannot exceed 300 characters']
    },
    interestRate: {
      type: Number,
      required: [true, 'Interest rate is required'],
      min: [1, 'Minimum interest rate is 1%'],
      max: [36, 'Maximum interest rate is 36%']
    },
    termMonths: {
      type: Number,
      required: [true, 'Loan term is required'],
      enum: [3, 6, 12, 18, 24, 36]  // allowed tenures in months
    },
    status: {
      type: String,
      enum: ['pending', 'awaiting_payment', 'funded', 'active', 'repaid', 'defaulted', 'cancelled'],
      default: 'pending'
    },
    // Populated when a bid is accepted
    acceptedBid: {
      type: Schema.Types.ObjectId,
      ref: 'Bid',
      default: null
    },
    lender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    // Stripe PaymentIntent ID — set when payment flow begins
    stripePaymentIntentId: {
      type: String,
      default: null
    },
    fundedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

loanSchema.index({ status: 1 });
loanSchema.index({ borrower: 1 });
loanSchema.index({ lender: 1 });

// ─── 3. BID ─────────────────────────────────────────────────
const bidSchema = new Schema(
  {
    loan: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: true
    },
    lender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Lenders may propose a different interest rate
    proposedRate: {
      type: Number,
      required: [true, 'Proposed interest rate is required'],
      min: [1, 'Rate must be at least 1%'],
      max: [36, 'Rate cannot exceed 36%']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending'
    },
    message: {
      type: String,
      trim: true,
      maxlength: [200, 'Message cannot exceed 200 characters']
    }
  },
  { timestamps: true }
);

bidSchema.index({ loan: 1 });
bidSchema.index({ lender: 1, loan: 1 }, { unique: true }); // one bid per lender per loan

// ─── 4. TRANSACTION ─────────────────────────────────────────
const transactionSchema = new Schema(
  {
    loan: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: true
    },
    type: {
      type: String,
      enum: ['funding', 'repayment', 'payout', 'refund'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    },
    // Stripe references for audit trail
    stripePaymentIntentId: { type: String, default: null },
    stripeTransferId:      { type: String, default: null },
    stripeChargeId:        { type: String, default: null },
    // Who paid / who received
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    paidTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed'
    },
    // Optional instalment reference
    repaymentSchedule: {
      type: Schema.Types.ObjectId,
      ref: 'RepaymentSchedule',
      default: null
    }
  },
  { timestamps: true }
);

transactionSchema.index({ loan: 1 });
transactionSchema.index({ type: 1 });

// ─── 5. REPAYMENT SCHEDULE ──────────────────────────────────
const repaymentScheduleSchema = new Schema(
  {
    loan: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: true
    },
    instalmentNumber: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    principal: {
      type: Number,
      required: true
    },
    interest: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true  // principal + interest (EMI)
    },
    status: {
      type: String,
      enum: ['upcoming', 'due', 'paid', 'overdue'],
      default: 'upcoming'
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

repaymentScheduleSchema.index({ loan: 1, instalmentNumber: 1 }, { unique: true });
repaymentScheduleSchema.index({ dueDate: 1, status: 1 }); // useful for overdue cron jobs

// ─── Exports ─────────────────────────────────────────────────
module.exports = {
  User:               mongoose.model('User', userSchema),
  Loan:               mongoose.model('Loan', loanSchema),
  Bid:                mongoose.model('Bid', bidSchema),
  Transaction:        mongoose.model('Transaction', transactionSchema),
  RepaymentSchedule:  mongoose.model('RepaymentSchedule', repaymentScheduleSchema)
};
