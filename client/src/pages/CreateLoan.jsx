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
    <div className="min-h-screen bg-slate-950 text-white font-sans p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Request a Loan
          </h1>
          <p className="text-slate-400">
            Tell our lenders why you need funding and set your terms.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/50 border border-slate-800/50 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Loan Amount (₹)
              </label>
              <input
                type="number"
                required
                min="500"
                max="500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Purpose of Loan
              </label>
              <textarea
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What will you use this money for?"
                rows="3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                  Int. Rate (%)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="36"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Term */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
                  Term (Months)
                </label>
                <select
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="18">18 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium">Estimated EMI</span>
                <span className="text-xl font-bold text-indigo-400">
                  ₹{amount ? (Number(amount) * (1 + interestRate/100) / termMonths).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Post Loan Request'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium"
            >
              Cancel
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
