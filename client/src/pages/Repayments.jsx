import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function Repayments() {
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchMyLoans();
  }, []);

  useEffect(() => {
    if (selectedLoanId) {
      fetchInstallments(selectedLoanId);
    } else {
      setInstallments([]);
    }
  }, [selectedLoanId]);

  const fetchMyLoans = async () => {
    try {
      setLoading(true);
      const data = await api.get('/loans/my/all');
      // Only active or funded loans have repayments
      const activeLoans = data.loans.filter(l => ['active', 'funded', 'repaid'].includes(l.status));
      setLoans(activeLoans);
      if (activeLoans.length > 0) {
        setSelectedLoanId(activeLoans[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch loans:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstallments = async (loanId) => {
    try {
      const data = await api.get(`/loans/${loanId}/repayments`);
      setInstallments(data.schedule);
    } catch (err) {
      console.error('Failed to fetch installments:', err.message);
    }
  };

  const handlePay = async (inst) => {
    try {
      setActionLoading(inst._id);
      
      // 1) Get Client Secret
      const { clientSecret } = await api.post(`/loans/${selectedLoanId}/repay/${inst._id}`);
      
      // 2) For this Phase 3 Demo, we simulate the Stripe Payment success 
      // since collecting card info requires a complex Elements setup.
      // We will alert the user and they can use the "Simulate Webhook" tool if needed.
      
      alert(`Payment Intent Created! \n\nAmount: ₹${inst.totalAmount}\nClient Secret: ${clientSecret.substring(0, 20)}...\n\nIn a production environment, this would open the Stripe Payment Element.`);
      
      // Note: After real payment, Stripe Webhook would update the status.
      // For demo purposes, we'll tell the user to wait for webhook.
      
    } catch (err) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4 tracking-tighter">
              Repayment Schedule
            </h1>
            <p className="text-slate-500 font-bold text-base">
              Manage your loan commitments and track upcoming installments.
            </p>
          </div>

          {loans.length > 0 && (
            <div className="flex flex-col min-w-[300px]">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Viewing Schedule For</label>
              <div className="relative">
                <select 
                  value={selectedLoanId}
                  onChange={(e) => setSelectedLoanId(e.target.value)}
                  className="input-field appearance-none pr-12 font-bold text-slate-700 shadow-sm"
                >
                  {loans.map(loan => (
                    <option key={loan._id} value={loan._id}>
                      {loan.purpose} (₹{loan.amount.toLocaleString()})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {loans.length === 0 ? (
          <div className="bg-white border-2 border-slate-200 border-dashed rounded-[3rem] p-32 text-center shadow-sm">
            <h3 className="text-lg font-black text-slate-300">No active repayment plans</h3>
            <p className="text-slate-400 font-bold mt-4 text-sm">Funded loans will automatically generate schedules here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {installments.length === 0 && (
              <div className="flex flex-col items-center py-20 animate-pulse">
                <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Ledger...</p>
              </div>
            )}
            {installments.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center md:justify-between gap-8 group hover:shadow-bold hover:border-primary-100 transition-all shadow-sm"
              >
                <div className="flex items-center gap-8">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-black text-lg border-2 transition-all ${
                    item.status === 'paid' 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-500' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-primary-50 group-hover:border-primary-100 group-hover:text-primary-600'
                  }`}>
                    {item.instalmentNumber}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Installment Period</h3>
                    <p className="text-slate-400 font-bold text-xs mt-1">
                      Due on {new Date(item.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-12 flex-1">
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Payment Amount</p>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">₹{item.totalAmount.toLocaleString()}</h4>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className={`badge-${item.status === 'paid' ? 'active' : item.status === 'overdue' ? 'defaulted' : 'pending'}`}>
                      {item.status}
                    </span>

                    {item.status !== 'paid' && (
                      <button
                        onClick={() => handlePay(item)}
                        disabled={actionLoading === item._id}
                        className="btn-primary py-2.5 text-sm"
                      >
                        {actionLoading === item._id ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phase Info */}
        {installments.length > 0 && (
          <div className="mt-16 bg-primary-50 border border-primary-100 rounded-[2.5rem] p-10 flex items-start gap-6 shadow-sm">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <h4 className="text-lg font-black text-primary-900 tracking-tight">Financial Automation Active</h4>
              <p className="text-primary-600/70 font-bold text-sm mt-2 leading-relaxed">
                Your payments are secured by Stripe. Successful repayments automatically settle with your lender (90%) and the platform fee (10%) in real-time.
                <br/><br/>
                <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Dev Verification:</span>
                <span className="ml-2 font-black text-primary-600">&apos;Pay Now&apos; generates a PaymentIntent. Use the webhook simulator to mark as paid.</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}