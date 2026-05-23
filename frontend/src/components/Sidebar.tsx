import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useChat } from '../context/ChatContext';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings as SettingsIcon, 
  LogOut, 
  Terminal, 
  Sparkles 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const { activeAgent } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/chat', label: 'Chat Companion', icon: MessageSquare },
    { to: '/settings', label: 'Cognitive Settings', icon: SettingsIcon },
  ];

  const agentLabels: Record<string, string> = {
    general: 'Manas General Brain',
    study: 'Study Agent 📚',
    coding: 'Coding Agent 💻',
    task: 'Task Planner 📋',
    file: 'File Indexer 📄',
    web: 'Web Researcher 🌐',
    automation: 'Automation Pipeline ⚙️',
  };

  const agentColors: Record<string, string> = {
    general: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20',
    study: 'border-blue-500/30 text-blue-400 bg-blue-950/20',
    coding: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20',
    task: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
    file: 'border-purple-500/30 text-purple-400 bg-purple-950/20',
    web: 'border-pink-500/30 text-pink-400 bg-pink-950/20',
    automation: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/20',
  };

  return (
    <aside className="w-64 h-screen bg-slate-950/90 border-r border-white/5 flex flex-col justify-between fixed top-0 left-0 z-40 backdrop-blur-md">
      
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-white/5 space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center glow-cyan">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-none">{settings.assistantName}</h1>
            <span className="text-[10px] text-cyan-400 font-semibold tracking-wider">MANAS V0.1.0</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border-l-2 border-cyan-500 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Active Agent Indicator & Profile Card */}
      <div className="p-4 border-t border-white/5 space-y-4">
        
        {/* Active Brain Mode */}
        {location.pathname === '/chat' && (
          <div className={`p-3 rounded-xl border text-[11px] font-medium ${agentColors[activeAgent]} transition-all animate-pulse`}>
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] uppercase font-bold tracking-wider opacity-80">
              <Sparkles className="w-3 h-3" />
              <span>Brain Active Mode</span>
            </div>
            <span>{agentLabels[activeAgent] || 'Standby'}</span>
          </div>
        )}

        {/* Profile Details */}
        {user && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-3 min-w-0">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-9 h-9 rounded-lg bg-slate-900 border border-white/10"
              />
              <div className="min-w-0">
                <p className="text-white font-semibold text-xs truncate leading-tight">{user.name}</p>
                <p className="text-slate-400 text-[10px] truncate leading-none">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </aside>
  );
};
export default Sidebar;
