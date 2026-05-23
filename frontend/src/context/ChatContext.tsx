import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';

export type AgentType = 'general' | 'study' | 'coding' | 'task' | 'file' | 'web' | 'automation';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  agent: AgentType;
  retrievedMemory?: string;
  isGenerating?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  agent: AgentType;
  updatedAt: string;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeAgent: AgentType;
  isGenerating: boolean;
  setActiveAgent: (agent: AgentType) => void;
  createConversation: (agent?: AgentType) => string;
  deleteConversation: (id: string) => void;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (text: string) => Promise<void>;
  clearAllConversations: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const initialWelcomeMessages: Record<AgentType, string> = {
  general: "Hello! I am **Saarthi AI**, your personal agentic companion powered by the **Manas Engine**. I can help you orchestrate specialized agents, remember context across sessions, organize workflows, and assist you with code or learning. What can I do for you today?",
  study: "Study Agent online. 📚 Ready to construct structured study tracks, generate quiz outlines, summarize dense academic topics, or compile revision flashcards. Let me know what subject you are mastering!",
  coding: "Coding Agent activated. 💻 I have access to clean algorithmic templates, debugger rules, and multi-language compiler syntax. Ask me to write, refactor, or explain code!",
  task: "Task Agent synchronized. 📋 I can manage action checklists, schedule timelines, track daily targets, and design productivity workflows. List some items you want to organize!",
  file: "File Agent initialized. 📄 Upload simulation active. I can digest text documents, analyze reports, and execute semantic cross-referencing on your local documents. Send over a topic to analyze!",
  web: "Web Agent connected. 🌐 Simulated search engine hooks are hot. I can crawl online portals, extract live data indices, compile competitive research, and compile annotated web bibliography summaries.",
  automation: "Automation Agent active. ⚙️ Proactive system routines and event triggers are ready for custom pipeline orchestration. How can I streamline your recurring digital routines?",
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentType>('general');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saarthi_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Conversation[];
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
          setActiveAgent(parsed[0].agent);
        }
      } catch (e) {
        // Clear corrupt storage
      }
    }
  }, []);

  // Save to localStorage
  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    localStorage.setItem('saarthi_conversations', JSON.stringify(updated));
  };

  const createConversation = (agent: AgentType = 'general'): string => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newConversation: Conversation = {
      id: newId,
      title: `${agent.charAt(0).toUpperCase() + agent.slice(1)} Session`,
      messages: [
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'ai',
          text: initialWelcomeMessages[agent],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agent: agent,
        },
      ],
      agent: agent,
      updatedAt: new Date().toISOString(),
    };

    const updated = [newConversation, ...conversations];
    saveConversations(updated);
    setActiveConversationId(newId);
    setActiveAgent(agent);
    return newId;
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    saveConversations(updated);
    if (activeConversationId === id) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id);
        setActiveAgent(updated[0].agent);
      } else {
        setActiveConversationId(null);
      }
    }
  };

  const clearAllConversations = () => {
    saveConversations([]);
    setActiveConversationId(null);
  };

  // Generate simulated AI responses based on agent type and text input
  const generateSimulatedResponse = (text: string, agent: AgentType): { text: string; memoryUsed?: string } => {
    const lowerText = text.toLowerCase();
    let reply = "";
    let memoryUsed = undefined;

    if (settings.memoryEnabled) {
      memoryUsed = "Manas Brain Engine recalled user preference: 'Interested in advanced automation, agent systems, and rust/typescript programming.'";
    }

    switch (agent) {
      case 'study':
        if (lowerText.includes('react') || lowerText.includes('component')) {
          reply = `### Study Track: React Architecture ⚛️

To truly master component patterns, let's break this down into three major zones:

1. **State Management Flow**: Understand the unidirectional data flow.
2. **Side Effect Synchronization**: \`useEffect\` hooks and cleanups.
3. **Component Reusability**: Compound component patterns.

**Recommended Flashcards to create:**
- *What is the Virtual DOM?* A lightweight programming representation of HTML DOM in memory.
- *Explain reconciliation:* React's diffing algorithm to update only elements that changed.

Would you like me to construct a 5-day study plan covering React hooks and contexts?`;
        } else {
          reply = `### Comprehensive Syllabus Blueprint 📝

Let's systematically organize learning about: **"${text}"**.

Here is a quick concept hierarchy:
- **Foundational level**: Basic definitions, paradigms, and syntax rules.
- **Intermediate level**: Core implementation structures, typical traps, and debug heuristics.
- **Advanced tier**: Design patterns, performant execution profiles, and agent-driven optimizations.

**Quick Mastery Tip:** Write short summaries in your own words. Try teaching the concept back to me, and I will highlight areas to polish!`;
        }
        break;

      case 'coding':
        if (lowerText.includes('button') || lowerText.includes('css')) {
          reply = `Here is a modern, glassmorphic button component styled with **Tailwind CSS**. It incorporates hover animations and glow filters:

\`\`\`tsx
import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glowColor?: 'cyan' | 'purple';
}

export const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  glowColor = 'cyan', 
  className = '', 
  ...props 
}) => {
  const glowStyle = glowColor === 'cyan' 
    ? 'hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-cyan-400' 
    : 'hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:border-violet-400';

  return (
    <button
      className={\`px-6 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md text-white font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 \${glowStyle} \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
};
\`\`\`

**Key Features:**
- Dynamic shadow overlays triggered on hover.
- Glassmorphic transparency support.
- Fully compatible with standard React buttons.`;
        } else {
          reply = `### Script Template & Algorithm Design 💻

I have generated a clean implementation matching your query:

\`\`\`typescript
// Algorithmic optimization for: "${text}"
function processAgentWorkflow<T>(pipeline: T[]): { processed: T[]; status: string } {
  console.log("Manas Engine orchestrating agent operations...");
  const processed = pipeline.filter(Boolean);
  
  return {
    processed,
    status: "Success: Foundation Node Synced"
  };
}

// Sample call
const result = processAgentWorkflow(["Authentication", "Dashboard", "ChatUI"]);
console.log(result);
\`\`\`

*Optimized under O(N) complexity constraints. Feel free to tweak, and let me know if you get compile warnings!*`;
        }
        break;

      case 'task':
        reply = `### Checklist & Action Timelines 📋

Here is a curated planner breakdown of: **"${text}"**. I've organized this into high, medium, and low priority phases:

| Priority | Task Description | Est. Time | Status |
| :--- | :--- | :--- | :---: |
| 🔴 **High** | Scaffolding validation & CSS setup | 1 hr | Completed |
| 🟡 **Medium**| Auth/Chat pages integration | 3 hrs | In Progress |
| 🟢 **Low** | Settings brain override testing | 2 hrs | Scheduled |

**Immediate micro-habits:**
- [x] Create clean TS models
- [ ] Connect custom UI links inside \`Sidebar\`
- [ ] Reset database mocks to zero test entries

Shall I schedule a calendar timer to alert you when tasks expire?`;
        break;

      case 'file':
        reply = `### Semantic Document Breakdown 📄

*Simulation: Reading target workspace files...*
- **File Checked**: virtual_knowledge_index.bin
- **Context Matches**: 4 sections
- **Main Theme**: ${text || 'System Specifications'}

**Identified Concepts:**
1. **Core Brain Node**: High cohesion between semantic embeddings and chat records.
2. **Safety Gates**: Multi-layered sanitization rules prevents leaking raw shell execution details.
3. **Agent Delegation**: Clean callback handshakes.

*I have saved this summary as a transient context layer. You can ask follow-up questions from this file context directly!*`;
        break;

      case 'web':
        reply = `### Web Indexing Results & Bibliography 🌐

*Simulated Crawler executing index lookup for: "${text}"*

1. **Vite official documentation** (Score: 0.98)
   - *Snippet*: Vite uses ES Modules to load local scripts instantly.
   - *Link*: [vite.dev](https://vite.dev)

2. **Tailwind CSS Utility Best Practices** (Score: 0.89)
   - *Snippet*: Harnessing JIT compile ensures negligible stylesheet size in production.
   - *Link*: [tailwindcss.com](https://tailwindcss.com)

3. **MDN Web Docs on Web Storage APIs** (Score: 0.82)
   - *Snippet*: LocalStorage is persistent, synchronous, and capped at roughly 5MB.
   - *Link*: [developer.mozilla.org](https://developer.mozilla.org)

*Let me know if I should expand search criteria or fetch raw content from any specific link!*`;
        break;

      case 'automation':
        reply = `### Proactive Workflow Pipeline ⚙️

Here is a simulated script orchestration that automates **"${text}"** under event triggers:

**Event Trigger Sequence:**
\`\`\`txt
[Event: User submits prompt]
       │
       ▼
[Manas Engine decodes intent] ──► [Memory Context Injected]
                                             │
                                             ▼
[Automation Rule Fired] ──► [Launch Task Agent + Send notification]
\`\`\`

**Automation Status:**
- Rule Status: **Active**
- Total Runs: **14 runs**
- Latency: **42ms (Internal Mock Engine)**

Would you like me to bind a keyboard macro or custom slash command shortcut to trigger this system routine?`;
        break;

      default:
        // general agent
        reply = `I have received your request regarding: **"${text}"**. 

As **Saarthi AI**, I am always active to support your workflow. Under Phase 1 foundations, all specialized helper models (Study, Coding, Task, File, Web, and Automation) are available to run. 

You can toggle between them using the **Agent Bar** on the left. If you need coding assist, switch to the **Coding Agent**! If you want visual lists, the **Task Agent** is custom built for checklists.

*Manas Memory engine status:* **${settings.memoryEnabled ? 'Active' : 'Disabled'}**
Let me know how you'd like to proceed!`;
        break;
    }

    return { text: reply, memoryUsed };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    let convId = activeConversationId;
    let currentConv = conversations.find((c) => c.id === convId);

    // If no active conversation, create one automatically
    if (!convId || !currentConv) {
      convId = createConversation(activeAgent);
      currentConv = conversations.find((c) => c.id === convId)!;
    }

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agent: activeAgent,
    };

    // Add user message to conversation list
    let updatedMessages = [...currentConv.messages, userMessage];
    let updatedConv = {
      ...currentConv,
      messages: updatedMessages,
      title: currentConv.messages.length <= 1 ? (text.slice(0, 24) + (text.length > 24 ? '...' : '')) : currentConv.title,
      updatedAt: new Date().toISOString(),
    };

    let updatedConversations = conversations.map((c) => (c.id === convId ? updatedConv : c));
    // Re-order active conversation to the top
    updatedConversations = [updatedConv, ...updatedConversations.filter((c) => c.id !== convId)];
    saveConversations(updatedConversations);

    // Start AI Response Generation
    setIsGenerating(true);

    // Simulated network + cognitive engine delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const simulated = generateSimulatedResponse(text, activeAgent);
    const aiMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'ai',
      text: simulated.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agent: activeAgent,
      retrievedMemory: simulated.memoryUsed,
    };

    // Reload conversation to avoid stale modifications during async wait
    const freshConversations = JSON.parse(localStorage.getItem('saarthi_conversations') || '[]') as Conversation[];
    const freshConv = freshConversations.find((c) => c.id === convId) || updatedConv;

    const finalMessages = [...freshConv.messages, aiMessage];
    const finalConv = {
      ...freshConv,
      messages: finalMessages,
      updatedAt: new Date().toISOString(),
    };

    const finalConversations = freshConversations.map((c) => (c.id === convId ? finalConv : c));
    saveConversations([finalConv, ...finalConversations.filter((c) => c.id !== convId)]);
    setIsGenerating(false);
  };

  useEffect(() => {
    // Keep agent in sync with active conversation when conversation switches
    if (activeConversationId) {
      const activeConv = conversations.find((c) => c.id === activeConversationId);
      if (activeConv) {
        setActiveAgent(activeConv.agent);
      }
    }
  }, [activeConversationId, conversations]);

  const value = {
    conversations,
    activeConversationId,
    activeAgent,
    isGenerating,
    setActiveAgent: (agent: AgentType) => {
      setActiveAgent(agent);
      // If we are already inside a conversation of the same agent, stay in it.
      // Otherwise, we create a new one automatically when they send a message.
    },
    createConversation,
    deleteConversation,
    setActiveConversationId,
    sendMessage,
    clearAllConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
