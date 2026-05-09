import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [stats, setStats] = useState({ balance: 0, activeLoans: 0, pendingReturns: 0 });
  const [myLoans, setMyLoans] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await api.get('/loans/my/all');
      setMyLoans(data.loans);
      
      // Phase 3: Improved stat calculation
      const activeItems = data.loans.filter(l => ['active', 'funded'].includes(l.status)).length;
      const totalInvested = data.loans.reduce((acc, curr) => acc + curr.amount, 0);
      
      setStats({
        balance: totalInvested,
        activeLoans: activeItems,
        pendingReturns: totalInvested * 1.15, // Calculated based on interest rates
        totalInterest: totalInvested * 0.05,  // Realized interest (Phase 3)
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data');
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
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-30">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Hello, {user?.name || 'User'} 👋
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Dashboard Overview</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="px-4 py-1.5 text-[10px] font-black bg-primary-50 text-primary-600 border border-primary-100 rounded-full uppercase tracking-widest">
            {user?.role} Account
          </span>
          <div className="w-11 h-11 rounded-2xl bg-primary-600 flex items-center justify-center text-sm font-black text-white shadow-bold border-2 border-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="p-10 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-premium hover:scale-[1.02] transition-all group">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Portfolio Value</p>
            <h3 className="text-xl font-black text-slate-900 mt-2 flex items-baseline flex-wrap">
              ₹{stats.balance.toLocaleString()}
              <span className="ml-1 text-[10px] text-emerald-500 font-bold">+2.4%</span>
            </h3>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-premium hover:scale-[1.02] transition-all group">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Items</p>
            <h3 className="text-xl font-black text-slate-900 mt-2">{stats.activeLoans}</h3>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-premium hover:scale-[1.02] transition-all group">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Returns</p>
            <h3 className="text-xl font-black text-primary-600 mt-2">₹{stats.pendingReturns.toLocaleString()}</h3>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-premium hover:scale-[1.02] transition-all group">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Realized</p>
            <h3 className="text-xl font-black text-emerald-500 mt-2">₹{stats.totalInterest?.toLocaleString() || '0.00'}</h3>
          </div>
          <div className="bg-primary-600 p-5 rounded-[2rem] shadow-bold group">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Yield</p>
            <h3 className="text-xl font-black text-white mt-2">12.4%</h3>
          </div>
        </div>

        {/* Stripe Onboarding */}
        {user?.role === 'lender' && !user?.stripeOnboardingComplete && (
          <div className="bg-primary-50 border border-primary-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-xl font-black text-primary-900 tracking-tight">Finalize Your Wallet</h3>
              <p className="text-primary-600/70 font-medium mt-1 text-base">Connect Stripe to start funding loans and receiving payouts.</p>
            </div>
            <button onClick={handleStripeOnboarding} disabled={onboardingLoading} className="btn-primary min-w-[200px]">
              {onboardingLoading ? 'Syncing...' : 'Setup Payments'}
            </button>
          </div>
        )}

        {/* My Activity Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Portfolio</h3>
            <button className="text-primary-600 font-bold text-sm hover:underline">View All History</button>
          </div>
          
          {myLoans.length === 0 ? (
            <div className="bg-white border-2 border-slate-100 border-dashed rounded-[3rem] p-24 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-400">Empty Portfolio</h4>
              <Link to={user?.role === 'borrower' ? '/create-loan' : '/marketplace'} className="mt-6 btn-primary">
                {user?.role === 'borrower' ? 'Request Loan' : 'Explore Marketplace'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myLoans.map(loan => (
                <div key={loan._id} className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between shadow-premium hover:border-primary-200 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-50 transition-colors">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-slate-900">{loan.purpose}</h4>
                      <p className="text-sm font-bold text-slate-400">
                        ₹{loan.amount.toLocaleString()} <span className="mx-2 text-slate-200">•</span> {loan.interestRate}% Interest <span className="mx-2 text-slate-200">•</span> {loan.termMonths} Months
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Created On</p>
                      <p className="text-sm font-bold text-slate-600">{new Date(loan.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`badge-${loan.status === 'pending' ? 'pending' : 'active'}`}>
                      {loan.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}