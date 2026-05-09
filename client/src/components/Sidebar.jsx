import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col relative z-20 shadow-sm h-screen sticky top-0">
      <div className="p-8">
        <h1 className="text-xl font-black bg-gradient-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent">
          P2P Platform
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">
          The P2P Ledger
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <Link 
          to="/dashboard" 
          className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all ${
            isActive('/dashboard') 
              ? 'bg-primary-50 text-primary-600 border border-primary-100' 
              : 'text-slate-500 hover:text-primary-600 hover:bg-primary-50/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Overview
        </Link>

        <Link 
          to="/marketplace" 
          className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all ${
            isActive('/marketplace') 
              ? 'bg-primary-50 text-primary-600 border border-primary-100' 
              : 'text-slate-500 hover:text-primary-600 hover:bg-primary-50/50'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Marketplace
        </Link>

        {user?.role === 'borrower' && (
          <>
            <Link 
              to="/create-loan" 
              className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive('/create-loan') 
                  ? 'bg-primary-50 text-primary-600 border border-primary-100' 
                  : 'text-slate-500 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
              Apply for Loan
            </Link>
            <Link 
              to="/repayments" 
              className={`flex items-center px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive('/repayments') 
                  ? 'bg-primary-50 text-primary-600 border border-primary-100' 
                  : 'text-slate-500 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              My Repayments
            </Link>
          </>
        )}
      </nav>

      <div className="p-6">
        <button onClick={logout} className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-2xl transition-all text-sm font-bold">
          Sign Out
        </button>
      </div>
    </aside>
  );
}
