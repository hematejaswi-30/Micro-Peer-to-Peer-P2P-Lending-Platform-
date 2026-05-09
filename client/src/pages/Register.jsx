import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Borrower');
  const [validationError, setValidationError] = useState('');

  const { register, loading, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearError();
    setValidationError('');

    // Name validation
    if (name.trim().length < 3) {
      setValidationError('Name must be at least 3 characters');
      return;
    }

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
      await register(name, email, password, role);
      // Redirect handled by useEffect
    } catch (err) {
      // Backend errors handled by context
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">

      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-100/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>

      {/* Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <h1 className="text-2xl font-black bg-gradient-to-br from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
          P2P Platform
        </h1>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Create Account
        </h2>
        <p className="mt-3 text-slate-500 font-bold text-sm">
          Already a member?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 transition-all underline underline-offset-4"
          >
            Sign in to vault
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

            {/* Name */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
                Legal Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidationError('');
                }}
                className="input-field"
                placeholder="John Doe"
              />
            </div>

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
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
                Security Key
              </label>
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

            {/* Role Selection */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setRole('Borrower')}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                    role === 'Borrower' 
                      ? 'border-primary-600 bg-primary-50 text-primary-600' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <p className="font-black text-sm uppercase tracking-widest">Borrower</p>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('Lender')}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                    role === 'Lender' 
                      ? 'border-primary-600 bg-primary-50 text-primary-600' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <p className="font-black text-sm uppercase tracking-widest">Lender</p>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-base"
              >
                {loading ? 'Generating Vault...' : 'Create Account'}
              </button>
            </div>

          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              ISO 27001 Certified Security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}