import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Marketplace() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Bidding State
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [bidRate, setBidRate] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [bidLoading, setBidLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await api.get('/loans');
      setLoans(data.loans);
    } catch (err) {
      setError('Failed to fetch marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    try {
      await api.post(`/loans/${selectedLoan._id}/bids`, {
        proposedRate: Number(bidRate),
        message: bidMessage
      });
      alert('Bid placed successfully!');
      setSelectedLoan(null);
      setBidRate('');
      setBidMessage('');
      fetchLoans();
    } catch (err) {
      alert(err.message || 'Failed to place bid');
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-8">
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Marketplace
            </h1>
            <p className="text-slate-400">Discover investment opportunities and place your bids.</p>
          </div>
          <div className="text-sm font-medium text-slate-500">
            {loans.length} Loans Available
          </div>
        </header>

        {loans.length === 0 ? (
          <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl p-20 text-center">
            <p className="text-slate-500 text-lg">No active loan requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map(loan => (
              <div key={loan._id} className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-3xl hover:border-indigo-500/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20 uppercase tracking-tighter">
                      {loan.termMonths} Months
                    </span>
                    <span className="text-2xl font-black text-white">₹{loan.amount.toLocaleString()}</span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors">
                    {loan.purpose}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 italic">
                    By {loan.borrower?.name || 'Anonymous'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Rate</p>
                      <p className="text-lg font-bold text-slate-200">{loan.interestRate}%</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Type</p>
                      <p className="text-lg font-bold text-slate-200">Personal</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedLoan(loan)}
                  className="w-full bg-slate-800 hover:bg-indigo-600 py-3 rounded-xl font-bold transition-all"
                >
                  Place Bid
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-2">Bid on Loan</h2>
            <p className="text-slate-400 text-sm mb-6">Request for ₹{selectedLoan.amount.toLocaleString()} at {selectedLoan.interestRate}%</p>
            
            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Proposed Interest Rate (%)</label>
                <input 
                  type="number" 
                  required 
                  min="1" 
                  max="36"
                  value={bidRate}
                  onChange={(e) => setBidRate(e.target.value)}
                  placeholder="e.g. 11.5"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message to Borrower</label>
                <textarea 
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  placeholder="Why should they choose your bid?"
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedLoan(null)}
                  className="flex-1 px-4 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={bidLoading}
                  className="flex-1 px-4 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-50"
                >
                  {bidLoading ? 'Submitting...' : 'Confirm Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
