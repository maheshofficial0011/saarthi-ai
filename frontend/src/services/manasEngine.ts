import { generateGeminiContent, type GeminiMessage } from './geminiService';

export type AgentType = 'general' | 'study' | 'coding' | 'task' | 'file' | 'web' | 'automation';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  agent: AgentType;
  retrievedMemory?: string;
}

// Ported legacy mock responses for robust client-side fallback
function generateSimulatedResponse(text: string, agent: AgentType, memoryEnabled: boolean): string {
  const lowerText = text.toLowerCase();
  let reply = "";

  switch (agent) {
    case 'study':
      if (lowerText.includes('react') || lowerText.includes('component')) {
        reply = `### Study Track: React Architecture ⚛️ (Local Fallback Mode)

To truly master component patterns, let's break this down into three major zones:

1. **State Management Flow**: Understand the unidirectional data flow.
2. **Side Effect Synchronization**: \`useEffect\` hooks and cleanups.
3. **Component Reusability**: Compound component patterns.

**Recommended Flashcards to create:**
- *What is the Virtual DOM?* A lightweight programming representation of HTML DOM in memory.
- *Explain reconciliation:* React's diffing algorithm to update only elements that changed.

Would you like me to construct a 5-day study plan covering React hooks and contexts?`;
      } else {
        reply = `### Comprehensive Syllabus Blueprint 📝 (Local Fallback Mode)

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
        reply = `Here is a modern, glassmorphic button component styled with **Tailwind CSS**. It incorporates hover animations and glow filters: (Local Fallback Mode)

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
        reply = `### Script Template & Algorithm Design 💻 (Local Fallback Mode)

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
      reply = `### Checklist & Action Timelines 📋 (Local Fallback Mode)

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
      reply = `### Semantic Document Breakdown 📄 (Local Fallback Mode)

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
      reply = `### Web Indexing Results & Bibliography 🌐 (Local Fallback Mode)

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
      reply = `### Proactive Workflow Pipeline ⚙️ (Local Fallback Mode)

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
      reply = `I have received your request regarding: **"${text}"**. (Local Fallback Mode)

As **Saarthi AI**, I am always active to support your workflow. Under Phase 1 foundations, all specialized helper models (Study, Coding, Task, File, Web, and Automation) are available to run. 

You can toggle between them using the **Agent Bar** on the left. If you need coding assist, switch to the **Coding Agent**! If you want visual lists, the **Task Agent** is custom built for checklists.

Manas Memory Engine Status: ${memoryEnabled ? 'Active' : 'Disabled'}
Let me know how you'd like to proceed!`;
      break;
  }

  return reply;
}

/**
 * Main Manas Engine Cognitive Service.
 * Decodes active agent instructions, appends user memory parameters, and orchestrates live Gemini API requests.
 */
export async function generateResponse(
  userMessage: string,
  history: Message[],
  activeAgent: AgentType,
  settings: { assistantName: string; systemPersona: string; memoryEnabled: boolean }
): Promise<{ text: string; memoryUsed?: string }> {
  const memoryEnabled = settings.memoryEnabled;
  let memoryUsed = undefined;

  if (memoryEnabled) {
    memoryUsed = "Manas Brain Engine recalled user preference: 'Interested in advanced automation, agent systems, and rust/typescript programming.'";
  }

  // Base System Instructions incorporating Saarthi AI identity
  let systemPrompt = `You are ${settings.assistantName}, a personal agentic companion powered by the Manas Engine and Saarthi Agents.
Your customized identity instructions: "${settings.systemPersona}"

Core Behavior Rules:
- Be clear, practical, highly supportive, action-focused, and provide step-by-step guidance.
- Help the user with study, planning, tasks, productivity, projects, and coding.
- Always output clean Markdown. Format lists, tables, headers, and checklists beautifully.
- If rendering code blocks, always specify the language (e.g. \`\`\`tsx) and provide complete, well-commented, optimized code templates.`;

  // Append specialized agent behaviors
  switch (activeAgent) {
    case 'study':
      systemPrompt += `\n\n[Active Mode: Study Agent 📚]
Focus on explaining academic concepts, constructing structured learning tracks, drafting revision flashcards, compiling quizzes, and simplifying complex study theories.`;
      break;
    case 'coding':
      systemPrompt += `\n\n[Active Mode: Coding Agent 💻]
Focus on writing clean, optimal, well-commented code scripts, explaining algorithmic runtimes, refactoring files, and diagnosing compiler warnings.`;
      break;
    case 'task':
      systemPrompt += `\n\n[Active Mode: Task Planner 📋]
Focus on compiling task checklists, priority metrics, action matrices, deadlines planning, and productivity schedules.`;
      break;
    case 'file':
      systemPrompt += `\n\n[Active Mode: File Agent 📄]
Focus on simulating text document digestion, semantic knowledge indexes, summarizing dense articles, and cross-referencing text.`;
      break;
    case 'web':
      systemPrompt += `\n\n[Active Mode: Web Agent 🌐]
Focus on indexing online resources, compiling research annotations, detailing web source links, and generating bibliography briefs.`;
      break;
    case 'automation':
      systemPrompt += `\n\n[Active Mode: Automation Core ⚙️]
Focus on outlining workflow pipelines, event routine mapping, triggers checklists, and scripting keyboard macros.`;
      break;
    default:
      break;
  }

  // Map settings/memory directly into system instruction context if enabled
  if (memoryEnabled && memoryUsed) {
    systemPrompt += `\n\n[Recalled Memory Context]
User preference: "Owner profile is a software engineer interested in advanced automation, modular agent systems, and rust/typescript programming." Please weave this context into your responses where naturally relevant.`;
  }

  // Map history to Gemini payload format (roles must alternate user/model!)
  const geminiHistory: GeminiMessage[] = [];
  
  // Filter messages to only contain successfully generated exchanges
  const cleanHistory = history.filter(
    (msg) => msg.text && msg.text.trim() !== ''
  );

  for (const msg of cleanHistory) {
    geminiHistory.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    });
  }

  // Append current user message if it's not already in the history array
  const lastMsg = geminiHistory[geminiHistory.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.parts[0].text !== userMessage) {
    geminiHistory.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });
  }

  try {
    // Attempt Gemini call
    const text = await generateGeminiContent(systemPrompt, geminiHistory);
    return { text, memoryUsed };
  } catch (error) {
    // Graceful fallback to legacy simulated response
    console.warn('Manas Engine falling back to local simulation mode due to service error.');
    
    let fallbackText = generateSimulatedResponse(userMessage, activeAgent, memoryEnabled);
    
    // Append a clean, non-intrusive warning notice to let the user know they are in offline fallback mode
    const fallbackMemory = memoryUsed 
      ? `${memoryUsed} | (Manas Brain Engine Offline - Local Fallback Synced)` 
      : "(Manas Brain Engine Offline - Local Fallback Synced)";

    return { 
      text: fallbackText, 
      memoryUsed: fallbackMemory 
    };
  }
}
