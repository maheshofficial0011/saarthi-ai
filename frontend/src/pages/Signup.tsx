import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight, Terminal } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarSeed, setAvatarSeed] = useState(Math.random().toString(36).substring(7));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;

  const generateNewSeed = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all registration fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const success = await signup(email, password, name);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('Email matches an already registered user profile.');
      }
    } catch (err) {
      setError('An error occurred during account creation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans animated-bg dot-grid flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      <Navbar />

      {/* Background glow sphere */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center glow-cyan">
            <Terminal className="w-5 h-5 text-white" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-white">
          Create Your Companion Account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Establish Local Manas Sync
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-2xl border border-white/10 shadow-2xl">
          
          {error && (
            <div className="mb-4 p-3.5 rounded-xl border border-red-500/20 bg-red-950/40 text-xs text-red-400 font-medium flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Avatar Seed Selector */}
            <div className="flex flex-col items-center space-y-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Choose Companion Seed Profile
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="w-14 h-14 rounded-xl bg-slate-900 border border-white/10 p-1 flex-shrink-0"
                />
                <button
                  type="button"
                  onClick={generateNewSeed}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg border border-white/5 transition-all"
                >
                  Generate Seed
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Companion Owner"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 shadow-lg glow-cyan disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Initializing Engine...</span>
                  </>
                ) : (
                  <>
                    <span>Create Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-white/5 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Already synchronized?{' '}
              <Link to="/login" className="text-cyan-400 font-bold hover:underline transition-all">
                Enter Console
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Signup;
