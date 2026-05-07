import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [onboardingLoading, setOnboardingLoading] = useState(false);

  const handleStripeOnboarding = async () => {
    try {
      setOnboardingLoading(true);

      const response = await axios.get(
        '/api/payments/account-link'
      );

      // Redirect to Stripe onboarding
      window.location.href = response.data.url;

    } catch (error) {
      console.error('Stripe onboarding failed:', error);
      alert('Unable to start Stripe onboarding');
    } finally {
      setOnboardingLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">

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

          <a
            href="#"
            className="flex items-center px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-all font-medium border border-indigo-500/20"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>

            Overview
          </a>

          <a
            href="#"
            className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all font-medium"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            Marketplace
          </a>

          <a
            href="#"
            className="flex items-center px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all font-medium"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

            My Loans
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto">

        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">

          <h2 className="text-xl font-semibold text-white tracking-tight">
            Welcome back, {user?.name || 'User'} 👋
          </h2>

          <div className="flex items-center gap-4">

            <span className="px-3 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              {user?.role || 'Borrower'}
            </span>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-500/20 border border-white/10">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition-colors">

              <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>

              <p className="text-slate-400 text-sm font-medium">
                Total Balance
              </p>

              <h3 className="text-3xl font-bold text-white mt-2">
                $0.00
              </h3>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/30 transition-colors">

              <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>

              <p className="text-slate-400 text-sm font-medium">
                Active Investments
              </p>

              <h3 className="text-3xl font-bold text-white mt-2">
                0
              </h3>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors">

              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>

              <p className="text-slate-400 text-sm font-medium">
                Pending Returns
              </p>

              <h3 className="text-3xl font-bold text-white mt-2">
                $0.00
              </h3>
            </div>
          </div>

          {/* Stripe Onboarding */}
          {user?.role === 'Lender' && (
            <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl shadow-xl backdrop-blur-sm p-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Complete Stripe Onboarding
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    Connect your Stripe account to start investing and receiving payouts.
                  </p>
                </div>

                <button
                  onClick={handleStripeOnboarding}
                  disabled={onboardingLoading}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {onboardingLoading
                    ? 'Redirecting...'
                    : 'Complete Onboarding'}
                </button>

              </div>
            </div>
          )}

          {/* Placeholder */}
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center p-16 border-dashed">

            <svg
              className="w-16 h-16 text-slate-700 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>

            <h4 className="text-lg font-medium text-slate-300">
              No active loans yet
            </h4>

            <p className="text-slate-500 text-sm mt-1 max-w-sm text-center">
              Your active portfolio and marketplace opportunities will appear here once the loan endpoints are connected in Phase 2.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}