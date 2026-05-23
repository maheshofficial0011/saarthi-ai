import React, { useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MessageBubble } from '../components/MessageBubble';
import { CommandInput } from '../components/CommandInput';
import { useChat, type AgentType } from '../context/ChatContext';
import { 
  Sparkles, 
  MessageSquare, 
  Trash2, 
  Plus, 
  BookOpen, 
  Code, 
  ListTodo, 
  FileText, 
  Globe, 
  Cpu, 
  Info,
  Layers
} from 'lucide-react';

export const Chat: React.FC = () => {
  const { 
    conversations, 
    activeConversationId, 
    activeAgent, 
    setActiveAgent, 
    isGenerating,
    createConversation, 
    deleteConversation, 
    setActiveConversationId,
    clearAllConversations
  } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Automatically scroll message history to the bottom when new bubbles enter
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages, isGenerating]);

  // If no conversation exists at mount, initialize a general conversation automatically
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation('general');
    }
  }, [conversations, createConversation]);

  const agentControls = [
    { type: 'general', label: 'General AI', desc: 'Core Engine dialogue', icon: Sparkles, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20' },
    { type: 'study', label: 'Study Agent', desc: 'Master learning plans', icon: BookOpen, color: 'text-blue-400 border-blue-500/20 bg-blue-950/20' },
    { type: 'coding', label: 'Coding Agent', desc: 'Refactor algorithms', icon: Code, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20' },
    { type: 'task', label: 'Task Planner', desc: 'Schedule priorities', icon: ListTodo, color: 'text-amber-400 border-amber-500/20 bg-amber-950/20' },
    { type: 'file', label: 'File Agent', desc: 'Semantic indices summaries', icon: FileText, color: 'text-purple-400 border-purple-500/20 bg-purple-950/20' },
    { type: 'web', label: 'Web Researcher', desc: 'Crawl research references', icon: Globe, color: 'text-pink-400 border-pink-500/20 bg-pink-950/20' },
    { type: 'automation', label: 'Automation Core', desc: 'Trigger proactive workflows', icon: Cpu, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/20' },
  ] as { type: AgentType; label: string; desc: string; icon: any; color: string }[];

  const handleCreateSession = () => {
    createConversation(activeAgent);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      {/* Secondary Chat Drawer Workspace */}
      <div className="w-[300px] h-screen bg-slate-950/40 border-r border-white/5 flex flex-col justify-between fixed top-0 left-64 z-30 backdrop-blur-md pt-16">
        
        {/* Agent Switcher Section */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Agent Selection</span>
          </div>
          
          <div className="grid grid-cols-1 gap-1.5 max-h-[30vh] overflow-y-auto pr-1">
            {agentControls.map((item) => {
              const Icon = item.icon;
              const isSelected = activeAgent === item.type;
              return (
                <button
                  key={item.type}
                  onClick={() => setActiveAgent(item.type)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'border-cyan-500/30 text-white bg-cyan-950/15'
                      : 'border-transparent text-slate-400 hover:border-white/5 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border ${isSelected ? item.color : 'bg-slate-900 border-white/5 text-slate-400'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight">{item.label}</p>
                    <p className="text-[9.5px] text-slate-500 truncate leading-none mt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sessions history Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 pb-2 flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Recent Sessions</span>
            
            <button
              onClick={handleCreateSession}
              className="p-1 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all"
              title="Start New Session"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conversations Title List */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border group transition-all ${
                    isSelected
                      ? 'border-cyan-500/20 bg-cyan-950/10 text-white'
                      : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-medium truncate leading-tight">{conv.title}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 rounded transition-all"
                    title="Delete Session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear Conversations Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={clearAllConversations}
            className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-red-400 uppercase tracking-widest py-1.5 transition-colors"
          >
            Clear All History
          </button>
        </div>

      </div>

      {/* Main Conversational Workspace */}
      <div className="flex-1 pl-[564px] min-h-screen flex flex-col relative animated-bg dot-grid bg-slate-950">
        
        {/* Dynamic Context Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md sticky top-0 z-20">
          <div className="min-w-0">
            <h3 className="text-white font-extrabold text-sm truncate leading-tight">
              {activeConv ? activeConv.title : 'Direct Brain Console'}
            </h3>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase mt-0.5 leading-none">
              Orchestrator mode: {activeAgent.toUpperCase()}
            </p>
          </div>
          
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl font-medium">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Phase 1 Mock Mode Active</span>
          </div>
        </header>

        {/* Message Feeds Scroll Container */}
        <div className="flex-grow overflow-y-auto px-8 py-8 flex flex-col min-h-0 pb-36">
          {activeConv && activeConv.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isGenerating && (
            <MessageBubble 
              message={{
                id: 'generating-temp',
                sender: 'ai',
                text: '',
                timestamp: '',
                agent: activeAgent,
                isGenerating: true
              }} 
            />
          )}
          
          {/* Scroll Target */}
          <div ref={scrollRef} />
        </div>

        {/* Command Input Drawer */}
        <div className="absolute bottom-0 left-[564px] right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-20">
          <CommandInput />
        </div>

      </div>
    </div>
  );
};
export default Chat;
