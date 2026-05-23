import React, { useState, useRef, useEffect } from 'react';
import { useChat, type AgentType } from '../context/ChatContext';
import { Send, Mic, Sparkles, BookOpen, Code, ListTodo, FileText, Globe, Cpu } from 'lucide-react';

interface CommandInputProps {
  onFocus?: () => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({ onFocus }) => {
  const { sendMessage, isGenerating, setActiveAgent } = useChat();
  const [text, setText] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [voicePrompt, setVoicePrompt] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const slashCommands: { cmd: string; agent: AgentType; label: string; desc: string; icon: any }[] = [
    { cmd: '/general', agent: 'general', label: 'Companion', desc: 'Switch to general AI dialogue', icon: Sparkles },
    { cmd: '/study', agent: 'study', label: 'Study Agent', desc: 'Create study tracks & plans', icon: BookOpen },
    { cmd: '/coding', agent: 'coding', label: 'Coding Agent', desc: 'Generate optimized programs & code templates', icon: Code },
    { cmd: '/task', agent: 'task', label: 'Task Planner', desc: 'Organize priorities & planners', icon: ListTodo },
    { cmd: '/file', agent: 'file', label: 'File Agent', desc: 'Extract data from document indexes', icon: FileText },
    { cmd: '/web', agent: 'web', label: 'Web Researcher', desc: 'Execute live search crawlers', icon: Globe },
    { cmd: '/automation', agent: 'automation', label: 'Automation', desc: 'Deploy proactive workflow pipelines', icon: Cpu },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    // Toggle autocomplete list if user types '/'
    if (value.endsWith('/')) {
      setShowSlashMenu(true);
    } else if (!value.includes('/')) {
      setShowSlashMenu(false);
    }
  };

  const handleSelectCommand = (agent: AgentType) => {
    setActiveAgent(agent);
    
    // Clear out slash from text
    const cleanText = text.replace(/\/(\w*)$/, '').trim();
    setText(cleanText);
    setShowSlashMenu(false);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isGenerating) return;

    const toSend = text;
    setText('');
    setShowSlashMenu(false);
    await sendMessage(toSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const triggerVoiceSimulation = () => {
    setVoicePrompt('Voice model disabled in Phase 1 foundation. Coming soon!');
    setTimeout(() => {
      setVoicePrompt(null);
    }, 2500);
  };

  // Close slash menu on outer click
  useEffect(() => {
    const handleOutside = () => setShowSlashMenu(false);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto z-30" onClick={(e) => e.stopPropagation()}>
      
      {/* Floating Voice Indicator */}
      {voicePrompt && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl border border-amber-500/20 bg-amber-950/70 backdrop-blur-md text-[10.5px] text-amber-400 font-bold text-center z-50 transition-all animate-bounce">
          {voicePrompt}
        </div>
      )}

      {/* Slash Autocomplete Menu */}
      {showSlashMenu && (
        <div className="absolute bottom-full mb-3 left-0 right-0 max-h-56 overflow-y-auto glass-card rounded-2xl p-2 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col space-y-0.5">
          <div className="px-3 py-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-widest border-b border-white/5 mb-1.5 flex items-center justify-between">
            <span>Specialized Saarthi Agents</span>
            <span className="text-slate-500">Select Mode</span>
          </div>
          {slashCommands.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.cmd}
                onClick={() => handleSelectCommand(item.agent)}
                className="flex items-center space-x-3.5 px-3 py-2.5 rounded-xl text-left hover:bg-cyan-500/10 hover:text-white transition-all text-slate-300"
              >
                <div className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-cyan-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded-md border border-white/5">{item.cmd}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Console Box */}
      <form onSubmit={handleSubmit} className="relative flex items-end glass-card p-2 rounded-2xl border border-white/10 focus-within:border-cyan-500/30 transition-all shadow-[0_10px_35px_rgba(0,0,0,0.3)]">
        
        {/* Voice Trigger Indicator */}
        <button
          type="button"
          onClick={triggerVoiceSimulation}
          className="p-3 rounded-xl bg-slate-900 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors flex-shrink-0"
          title="Synthesize Voice"
        >
          <Mic className="w-4.5 h-4.5" />
        </button>

        {/* Text Box */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder="Type a message or '/' to command specialized Saarthi Agents..."
          rows={1}
          style={{ height: '44px', resize: 'none' }}
          className="flex-1 bg-transparent border-0 ring-0 outline-none text-slate-100 text-xs py-3 px-4 placeholder-slate-500 max-h-36 overflow-y-auto"
        />

        {/* Send Action */}
        <button
          type="submit"
          disabled={!text.trim() || isGenerating}
          className={`p-3 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
            text.trim() && !isGenerating
              ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg glow-cyan hover:scale-105'
              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>

      </form>
      <div className="flex justify-between items-center px-4 mt-2 text-[9.5px] text-slate-500 font-semibold uppercase tracking-wider">
        <span>Manas Cognitive Context Sync Active</span>
        <span>Press Enter to Send • Shift+Enter for Newline</span>
      </div>
    </div>
  );
};
export default CommandInput;
