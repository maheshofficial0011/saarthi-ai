import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useChat, type AgentType } from '../context/ChatContext';
import { DashboardCard } from '../components/DashboardCard';
import { 
  Sparkles, 
  Cpu, 
  Database, 
  Users, 
  BookOpen, 
  Code, 
  ListTodo, 
  FileText, 
  Globe, 
  HelpCircle,
  MessageSquareCode
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { createConversation, setActiveAgent, sendMessage } = useChat();
  const navigate = useNavigate();

  // Get responsive welcome greeting based on local time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleAgentClick = (agent: AgentType) => {
    setActiveAgent(agent);
    createConversation(agent);
    navigate('/chat');
  };

  const handleShortcutPrompt = async (prompt: string, agent: AgentType) => {
    setActiveAgent(agent);
    createConversation(agent);
    navigate('/chat');
    // Delay slightly to let the chat component mount & read fresh state before sending
    setTimeout(() => {
      sendMessage(prompt);
    }, 200);
  };

  const agentCards = [
    { type: 'study', title: 'Study Agent', desc: 'Create curriculum lists, flashcards, & revision sheets.', icon: BookOpen, color: 'text-blue-400 border-blue-500/10 hover:border-blue-500/30 bg-blue-950/5' },
    { type: 'coding', title: 'Coding Agent', desc: 'Construct clean algorithms & bug-fixing templates.', icon: Code, color: 'text-emerald-400 border-emerald-500/10 hover:border-emerald-500/30 bg-emerald-950/5' },
    { type: 'task', title: 'Task Planner', desc: 'Generate task priority matrices & action checklists.', icon: ListTodo, color: 'text-amber-400 border-amber-500/10 hover:border-amber-500/30 bg-amber-950/5' },
    { type: 'file', title: 'File Indexer', desc: 'Execute semantic index summaries on local docs.', icon: FileText, color: 'text-purple-400 border-purple-500/10 hover:border-purple-500/30 bg-purple-950/5' },
    { type: 'web', title: 'Web Researcher', desc: 'Compile competitive summaries and bibliography references.', icon: Globe, color: 'text-pink-400 border-pink-500/10 hover:border-pink-500/30 bg-pink-950/5' },
    { type: 'automation', title: 'Automation Core', desc: 'Deploy proactive workflow scripts & triggers.', icon: Cpu, color: 'text-indigo-400 border-indigo-500/10 hover:border-indigo-500/30 bg-indigo-950/5' },
  ] as { type: AgentType; title: string; desc: string; icon: any; color: string }[];

  const quickPrompts = [
    { prompt: 'Help me study React reconciliation', agent: 'study', label: 'Study React' },
    { prompt: 'Generate a glassmorphism button block', agent: 'coding', label: 'Design Glass Button' },
    { prompt: 'Build a daily study plan checklist', agent: 'task', label: 'Daily Planner' },
    { prompt: 'Examine virtual database binary index structure', agent: 'file', label: 'Parse Database' },
  ] as { prompt: string; agent: AgentType; label: string }[];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      {/* Main Console Workspace */}
      <div className="flex-1 pl-64 min-h-screen flex flex-col animated-bg dot-grid">
        
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">Brain Console Home</span>
          </div>
          <div className="text-[10px] bg-slate-900 border border-white/10 px-3 py-1 rounded-lg text-slate-400 font-semibold tracking-wider uppercase">
            Brain Synced: Optimal
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-8 pt-12 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Welcome Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {getGreeting()}, {user?.name}! 🌟
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                Welcome back to your companion interface. All specialized agents are active and ready.
              </p>
            </div>
            
            <button
              onClick={() => handleAgentClick('general')}
              className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 glow-cyan hover:scale-[1.02]"
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>Launch Companion Dialogue</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Companion Identity"
              description="Customized agent name settings"
              value={settings.assistantName}
              badgeText="Identity Set"
              badgeType="info"
              icon={Sparkles}
            />
            <DashboardCard
              title="Manas Engine Brain"
              description="Simulated reasoning core status"
              value="Optimal (42ms)"
              badgeText="Active"
              badgeType="success"
              icon={Cpu}
            />
            <DashboardCard
              title="Manas Memory Slots"
              description="Saved persistent user facts"
              value={settings.memoryEnabled ? '14 slots active' : 'Disabled'}
              badgeText={settings.memoryEnabled ? 'Enabled' : 'Off'}
              badgeType={settings.memoryEnabled ? 'success' : 'warning'}
              icon={Database}
            />
            <DashboardCard
              title="Collaborative Agents"
              description="Connected specialized helpers"
              value="7 Agents Ready"
              badgeText="Operational"
              badgeType="success"
              icon={Users}
            />
          </div>

          {/* Quick Prompts Panel */}
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold text-sm mb-1.5 flex items-center space-x-2">
              <HelpCircle className="w-4.5 h-4.5 text-cyan-400" />
              <span>Instant Brain Directives</span>
            </h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Click any quick directive shortcut to immediately launch the target agent and execute simulated intelligence streams:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleShortcutPrompt(item.prompt, item.agent)}
                  className="p-3.5 rounded-xl border border-white/5 bg-slate-900/40 text-left hover:border-cyan-500/20 hover:bg-slate-900 transition-all group flex flex-col justify-between h-24"
                >
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest leading-none">
                    {item.label}
                  </span>
                  <p className="text-slate-300 text-xs font-semibold leading-snug group-hover:text-white transition-colors truncate w-full mt-2">
                    "{item.prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Specialized Agents Panel */}
          <div>
            <div className="mb-4">
              <h3 className="text-white font-extrabold text-base">Saarthi Specialized Agents</h3>
              <p className="text-slate-400 text-xs font-medium">Orchestrated sub-agents custom tuned for productivity and cognitive tasks.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentCards.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div
                    key={agent.type}
                    onClick={() => handleAgentClick(agent.type)}
                    className={`glass-card p-5 rounded-2xl border cursor-pointer hover:border-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 group flex flex-col justify-between h-40 ${agent.color}`}
                  >
                    <div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 w-fit mb-3 transition-all duration-300 group-hover:scale-105">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-white font-bold text-sm mb-1 leading-snug">{agent.title}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">{agent.desc}</p>
                    </div>
                    
                    <span className="text-[9.5px] font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider text-right">
                      Activate Agent →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
export default Dashboard;
