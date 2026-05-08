const { Loan, RepaymentSchedule, Transaction } = require('../models');
const mongoose = require('mongoose');

/**
 * Loan State Machine & Logic (Lead-owned)
 */
class LoanService {
  /**
   * Generate a repayment schedule for a funded loan
   * @param {string} loanId 
   */
  async generateRepaymentSchedule(loanId) {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error('Loan not found');

    const installments = [];
    const monthlyPrincipal = loan.amount / loan.termMonths;
    const monthlyInterest = (loan.amount * (loan.interestRate / 100)) / loan.termMonths;
    const totalEMI = monthlyPrincipal + monthlyInterest;

    const now = new Date();

    for (let i = 1; i <= loan.termMonths; i++) {
      const dueDate = new Date(now);
      dueDate.setMonth(now.getMonth() + i);

      installments.push({
        loan: loan._id,
        instalmentNumber: i,
        dueDate,
        principal: monthlyPrincipal.toFixed(2),
        interest: monthlyInterest.toFixed(2),
        totalAmount: totalEMI.toFixed(2),
        status: 'upcoming'
      });
    }

    await RepaymentSchedule.insertMany(installments);
    console.log(`✅ Generated ${loan.termMonths} installments for Loan ${loanId}`);
  }

  /**
   * Finalize a loan funding (Transition from awaiting_payment -> funded -> active)
   */
  async finalizeFunding(loanId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const loan = await Loan.findById(loanId).session(session);
      if (!loan || loan.status !== 'funded') {
        throw new Error('Loan is not in funded state');
      }

      // 1) Activate the loan
      loan.status = 'active';
      await loan.save({ session });

      // 2) Generate schedule
      await this.generateRepaymentSchedule(loan._id);

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  /**
   * Check if loan is fully repaid and close it
   */
  async checkLoanCompletion(loanId) {
    const pendingInstallments = await RepaymentSchedule.countDocuments({
      loan: loanId,
      status: { $ne: 'paid' }
    });

    if (pendingInstallments === 0) {
      const loan = await Loan.findById(loanId);
      loan.status = 'repaid';
      loan.completedAt = new Date();
      await loan.save();
      console.log(`🎉 Loan ${loanId} has been fully repaid!`);
    }
  }
}

module.exports = new LoanService();
