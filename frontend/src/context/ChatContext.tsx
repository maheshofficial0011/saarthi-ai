import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { generateResponse } from '../services/manasEngine';

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

  // Removed legacy generateSimulatedResponse since it is now centralized inside manasEngine.ts

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

    try {
      // Execute Manas Engine Generation directly, which automatically handles real API or mock fallbacks
      const engineResult = await generateResponse(text, updatedConv.messages, activeAgent, settings);
      
      const aiMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: engineResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: activeAgent,
        retrievedMemory: engineResult.memoryUsed,
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
    } catch (err) {
      console.error('Critical messaging error in ChatContext:', err);
    } finally {
      setIsGenerating(false);
    }
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
