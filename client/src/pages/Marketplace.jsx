import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function Marketplace() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      console.error('Failed to fetch marketplace data');
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4 tracking-tighter">
              Loan Marketplace
            </h1>
            <p className="text-slate-500 font-bold text-base">Browse curated investment opportunities and place your bids.</p>
          </div>
          <div className="text-sm font-black text-slate-400 uppercase tracking-widest bg-white px-6 py-2 rounded-2xl border border-slate-100 shadow-sm">
            {loans.length} active requests
          </div>
        </header>

        {loans.length === 0 ? (
          <div className="bg-white border-2 border-slate-200 border-dashed rounded-[3rem] p-32 text-center shadow-sm">
            <p className="text-slate-400 text-lg font-bold">The marketplace is currently quiet. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loans.map(loan => (
              <div key={loan._id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-bold hover:border-primary-200 transition-all group flex flex-col justify-between shadow-premium">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <span className="bg-primary-50 text-primary-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-primary-100 uppercase tracking-widest">
                      {loan.termMonths} Months Term
                    </span>
                    <span className="text-xl font-black text-slate-900 tracking-tight">₹{loan.amount.toLocaleString()}</span>
                  </div>
                  
                  <h3 className="font-black text-lg mb-3 text-slate-800 group-hover:text-primary-600 transition-colors">
                    {loan.purpose}
                  </h3>
                  
                  <p className="text-slate-400 font-bold text-sm mb-10">
                    Requested by <span className="text-slate-600 uppercase tracking-tight">{loan.borrower?.name || 'Verified Member'}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Target Rate</p>
                      <p className="text-base font-black text-slate-900">{loan.interestRate}%</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Status</p>
                      <p className="text-base font-black text-emerald-500 uppercase text-xs">Open</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedLoan(loan)}
                  className="w-full btn-primary py-2.5 text-sm"
                >
                  Place a Bid
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white border border-slate-200 w-full max-w-lg p-10 rounded-[3rem] shadow-bold animate-in fade-in zoom-in duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Place Your Bid</h2>
              <p className="text-slate-500 font-bold mt-2 text-sm">Investing ₹{selectedLoan.amount.toLocaleString()} in &apos;{selectedLoan.purpose}&apos;</p>
            </div>
            
            <form onSubmit={handlePlaceBid} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Proposed Interest Rate (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    required 
                    min="1" 
                    max="36"
                    step="0.1"
                    value={bidRate}
                    onChange={(e) => setBidRate(e.target.value)}
                    placeholder="12.5"
                    className="input-field pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Message to Borrower</label>
                <textarea 
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  placeholder="Offer some context for your bid..."
                  rows="4"
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setSelectedLoan(null)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={bidLoading}
                  className="flex-1 btn-primary"
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
