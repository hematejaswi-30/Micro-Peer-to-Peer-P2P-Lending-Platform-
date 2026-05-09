import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CreateLoan() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [interestRate, setInterestRate] = useState(12);
  const [termMonths, setTermMonths] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/loans', {
        amount: Number(amount),
        purpose,
        interestRate: Number(interestRate),
        termMonths: Number(termMonths),
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create loan request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-black bg-gradient-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4 tracking-tighter">
            Apply for Capital
          </h1>
          <p className="text-slate-500 font-bold text-base">
            Define your loan parameters and present your case to institutional lenders.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] shadow-bold border border-white">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-rose-600 text-center font-black uppercase tracking-widest">
                  {error}
                </p>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Requested Amount (INR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="500"
                  max="500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50,000"
                  className="input-field text-lg font-black pr-12"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">₹</span>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Purpose & Justification
              </label>
              <textarea
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What strategic goal will this capital serve?"
                rows="4"
                className="input-field resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Interest Rate */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  Target APR (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    max="36"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="input-field pr-10 font-bold text-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                </div>
              </div>

              {/* Term */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  Repayment Cycle
                </label>
                <div className="relative">
                  <select
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                    className="input-field appearance-none font-bold pr-12 text-sm"
                  >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="18">18 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Calculation */}
            <div className="bg-primary-50/50 border-2 border-primary-100/50 p-8 rounded-[2.5rem] flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Projected EMI</p>
                <p className="text-xs font-bold text-primary-900/60">Based on {interestRate}% APR</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-primary-600 tracking-tight">
                  ₹{amount ? (Number(amount) * (1 + interestRate/100) / termMonths).toFixed(2) : '0.00'}
                </span>
                <span className="text-primary-400 font-bold ml-1 text-sm">/mo</span>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-5 text-base"
              >
                {loading ? 'Processing Application...' : 'Submit Loan Request'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full text-slate-400 hover:text-slate-600 transition-colors text-xs font-black uppercase tracking-widest"
              >
                Discard Application
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
