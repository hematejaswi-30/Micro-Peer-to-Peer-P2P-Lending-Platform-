import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [stats, setStats] = useState({ balance: 0, activeLoans: 0, pendingReturns: 0 });
  const [myLoans, setMyLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/loans/my/all');
      setMyLoans(data.loans);
      
      // Basic stat calculation for demo
      const totalAmt = data.loans.reduce((acc, curr) => acc + curr.amount, 0);
      setStats({
        balance: totalAmt,
        activeLoans: data.loans.length,
        pendingReturns: totalAmt * 1.1 // Mock return
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStripeOnboarding = async () => {
    try {
      setOnboardingLoading(true);
      const response = await api.get('/payments/account-link');
      window.location.href = response.url;
    } catch (error) {
      console.error('Stripe onboarding failed:', error);
      alert('Unable to start Stripe onboarding');
    } finally {
      setOnboardingLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden text-slate-200">

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/50 bg-slate-900/50 backdrop-blur-xl flex flex-col relative z-20">
        <div className="p-6 border-b border-slate-800/50">
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            NiveshAI
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            P2P Lending
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl font-medium border border-indigo-500/20">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Overview
          </Link>

          <Link to="/marketplace" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all font-medium">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Marketplace
          </Link>

          {user?.role === 'borrower' && (
            <Link to="/create-loan" className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all font-medium">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              Apply for Loan
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <header className="h-16 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Welcome back, {user?.name || 'User'} 👋
          </h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full uppercase">
              {user?.role}
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg border border-white/10">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <p className="text-slate-400 text-sm font-medium">Portfolio Value</p>
              <h3 className="text-3xl font-bold text-white mt-2">₹{stats.balance.toLocaleString()}</h3>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
              <p className="text-slate-400 text-sm font-medium">Active Items</p>
              <h3 className="text-3xl font-bold text-white mt-2">{stats.activeLoans}</h3>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <p className="text-slate-400 text-sm font-medium">Expected Returns</p>
              <h3 className="text-3xl font-bold text-white mt-2">₹{stats.pendingReturns.toLocaleString()}</h3>
            </div>
          </div>

          {/* Stripe Onboarding */}
          {user?.role === 'lender' && !user?.stripeOnboardingComplete && (
            <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Complete Stripe Onboarding</h3>
                <p className="text-slate-400 text-sm mt-1">Required to fund loans and receive repayments.</p>
              </div>
              <button onClick={handleStripeOnboarding} disabled={onboardingLoading} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all disabled:opacity-50">
                {onboardingLoading ? 'Loading...' : 'Setup Payments'}
              </button>
            </div>
          )}

          {/* My Activity Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">My Active Portfolio</h3>
            {myLoans.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-16 flex flex-col items-center justify-center border-dashed">
                <h4 className="text-lg font-medium text-slate-500">No active activity yet</h4>
                <Link to={user?.role === 'borrower' ? '/create-loan' : '/marketplace'} className="mt-4 text-indigo-400 font-bold hover:underline">
                  {user?.role === 'borrower' ? 'Request your first loan' : 'Explore the marketplace'}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myLoans.map(loan => (
                  <div key={loan._id} className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{loan.purpose}</h4>
                      <p className="text-sm text-slate-500">₹{loan.amount.toLocaleString()} • {loan.interestRate}% Int. • {loan.status.replace('_', ' ')}</p>
                    </div>
                    <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                      loan.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {loan.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}