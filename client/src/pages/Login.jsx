import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { login, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearError();
    setValidationError('');

    // Email validation
    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    try {
      await login(email, password);
      // Redirect handled by useEffect
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">

      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-100/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>

      {/* Logo & Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <h1 className="text-2xl font-black bg-gradient-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
          P2P Platform
        </h1>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-3 text-slate-500 font-bold text-sm">
          New user?{' '}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 transition-all underline underline-offset-4"
          >
            Create new account
          </Link>
        </p>
      </div>

      {/* Auth Card */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-12 px-6 shadow-bold sm:rounded-[3rem] sm:px-12 border border-white">

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Validation Error */}
            {validationError && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-rose-600 text-center font-black uppercase tracking-widest">
                  {validationError}
                </p>
              </div>
            )}

            {/* Backend Error */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-rose-600 text-center font-black uppercase tracking-widest">
                  {error}
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError('');
                }}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Security Key
                </label>
                <button type="button" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError('');
                }}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-base"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>

          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-100">
            <Link 
              to="/register" 
              className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 text-slate-500 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 rounded-2xl transition-all text-sm font-bold"
            >
              New user? Create Account
            </Link>
            <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">
              Secured by AES-256 Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}