import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card bg-slate-950/40 border-b border-white/5 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center glow-cyan group-hover:scale-105 transition-all duration-300">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-lg group-hover:text-cyan-400 transition-colors">Saarthi</span>
            <span className="text-cyan-500 font-bold ml-1">AI</span>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-slate-300 hover:text-white font-medium text-sm transition-colors"
          >
            Vision
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="text-slate-300 hover:text-white font-medium text-sm transition-colors"
          >
            Docs
          </a>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 hover:bg-cyan-500 hover:text-white transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="text-slate-300 hover:text-white font-medium text-sm px-4 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="text-xs bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg transition-all glow-cyan hover:scale-105"
              >
                Start Free
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};
export default Navbar;
