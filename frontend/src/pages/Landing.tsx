import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { 
  Sparkles, 
  Terminal, 
  Brain, 
  ListTodo, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Manas Brain Engine',
      description: 'Sophisticated cognitive engine managing context, tracking reasoning paths, and scheduling tool commands.',
      icon: Brain,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/10',
    },
    {
      title: 'Saarthi Agents',
      description: 'Specialized modular helper nodes (Study, Coding, Tasks, Files, Web) collaborating on complex multi-step objectives.',
      icon: Sparkles,
      color: 'text-violet-400 border-violet-500/20 bg-violet-950/10',
    },
    {
      title: 'Persistent Memory',
      description: 'Secure, client-side cognitive memory that automatically records preferences and context over multiple chat sessions.',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10',
    },
    {
      title: 'Task Orchestrator',
      description: 'Direct task compilation, dynamic checklists, scheduled reminders, and interactive productivity planners.',
      icon: ListTodo,
      color: 'text-amber-400 border-amber-500/20 bg-amber-950/10',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans animated-bg dot-grid relative overflow-hidden">
      <Navbar />

      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none"></div>

      {/* Hero Container */}
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center justify-center text-center relative z-10 min-h-[85vh]">
        
        {/* Release Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-md mb-6 hover:border-cyan-500/30 transition-all">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Phase 1 Foundation Live</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl">
          Meet <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent glow-text-cyan">Saarthi AI</span>
          <br />Your Personal Agentic Companion
        </h1>

        {/* Tagline */}
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed font-medium">
          A customizable, state-of-the-art visual companion powered by the **Manas Engine**. Connect study managers, write syntax-highlighted code structures, compile schedules, and orchestrate dedicated agents.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm px-8 py-3 rounded-2xl w-full sm:w-auto justify-center transition-all duration-300 glow-cyan hover:scale-105"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl w-full sm:w-auto justify-center transition-all duration-300 glow-cyan hover:scale-105"
              >
                <span>Launch Companion</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="bg-slate-900/60 border border-white/10 hover:border-white/20 text-white font-bold text-sm px-8 py-3.5 rounded-2xl w-full sm:w-auto text-center backdrop-blur-md transition-all hover:bg-slate-900"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Visual Metric Divider */}
        <div className="w-full border-t border-white/5 my-12"></div>

        {/* Feature Grid */}
        <section className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-white font-extrabold text-xl mb-2">Designed for Daily Intelligence</h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Modular • Responsive • Agentic</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.title}
                  className="glass-card p-6 rounded-2xl hover:border-cyan-500/25 transition-all duration-300 group"
                >
                  <div className={`p-3 rounded-xl border w-fit mb-4 text-cyan-400 ${feat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2">{feat.title}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-medium">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 relative z-10 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-400">Saarthi AI</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <p className="font-medium text-[11px]">Your Personal Digital Companion Powered by Manas Engine</p>
        </div>
      </footer>
    </div>
  );
};
export default Landing;
