import React, { useState } from 'react';
import { type Message, type AgentType } from '../context/ChatContext';
import { Sparkles, Brain, Check, Copy, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isAi = message.sender === 'ai';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const agentLabels: Record<AgentType, string> = {
    general: 'Companion AI',
    study: 'Study Agent 📚',
    coding: 'Coding Agent 💻',
    task: 'Task Planner 📋',
    file: 'File Indexer 📄',
    web: 'Web Researcher 🌐',
    automation: 'Automation Pipeline ⚙️',
  };

  const agentPillColors: Record<AgentType, string> = {
    general: 'border-cyan-500/20 text-cyan-400 bg-cyan-950/20',
    study: 'border-blue-500/20 text-blue-400 bg-blue-950/20',
    coding: 'border-emerald-500/20 text-emerald-400 bg-emerald-950/20',
    task: 'border-amber-500/20 text-amber-400 bg-amber-950/20',
    file: 'border-purple-500/20 text-purple-400 bg-purple-950/20',
    web: 'border-pink-500/20 text-pink-400 bg-pink-950/20',
    automation: 'border-indigo-500/20 text-indigo-400 bg-indigo-950/20',
  };

  // Safe manual markdown parser for standard lists, bold text, headers, code, and tables
  const parseMarkdown = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Handle Code Block
      if (part.startsWith('```') && part.endsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const lang = match ? match[1] : '';
        const code = match ? match[2].trim() : part.slice(3, -3).trim();

        return (
          <div key={index} className="my-4 rounded-xl border border-white/10 bg-slate-950 overflow-hidden font-mono text-sm leading-relaxed max-w-full">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-900/60 text-xs text-slate-400">
              <span className="font-semibold">{lang.toUpperCase() || 'CODE'}</span>
              <button 
                onClick={() => copyToClipboard(code)}
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-300">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Parse lines for tables, headers, lists, and bold styling
      const lines = part.split('\n');
      let insideTable = false;
      let tableRows: string[][] = [];
      let tableHeaders: string[] = [];
      const parsedLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Parse Table Elements
        if (line.startsWith('|')) {
          const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          
          // Separator row check
          if (line.includes('---')) {
            continue; 
          }

          if (!insideTable) {
            insideTable = true;
            tableHeaders = cells;
          } else {
            tableRows.push(cells);
          }
          continue;
        }

        // Output accumulated table when table finishes
        if (insideTable && !line.startsWith('|')) {
          insideTable = false;
          parsedLines.push(renderTable(tableHeaders, tableRows, index + '-' + i));
          tableRows = [];
          tableHeaders = [];
        }

        // Parse Headers (e.g. ### Header)
        if (line.startsWith('### ')) {
          parsedLines.push(<h4 key={i} className="text-white font-bold text-sm mt-4 mb-2">{formatInline(line.slice(4))}</h4>);
        } else if (line.startsWith('## ')) {
          parsedLines.push(<h3 key={i} className="text-white font-extrabold text-base mt-5 mb-2.5">{formatInline(line.slice(3))}</h3>);
        }
        // Parse Lists
        else if (line.startsWith('- ') || line.startsWith('* ')) {
          const listText = line.slice(2);
          // Check if checkbox
          if (listText.startsWith('[x]')) {
            parsedLines.push(
              <div key={i} className="flex items-start space-x-2 my-1 text-slate-300">
                <input type="checkbox" checked readOnly className="w-3.5 h-3.5 mt-1 rounded bg-slate-900 border-white/10 accent-cyan-500" />
                <span className="line-through opacity-60 text-xs">{formatInline(listText.slice(3).trim())}</span>
              </div>
            );
          } else if (listText.startsWith('[ ]')) {
            parsedLines.push(
              <div key={i} className="flex items-start space-x-2 my-1 text-slate-300">
                <input type="checkbox" disabled className="w-3.5 h-3.5 mt-1 rounded bg-slate-900 border-white/10 accent-cyan-500" />
                <span className="text-xs">{formatInline(listText.slice(3).trim())}</span>
              </div>
            );
          } else {
            parsedLines.push(
              <li key={i} className="list-disc ml-5 text-slate-300 text-xs my-1 leading-relaxed">
                {formatInline(listText)}
              </li>
            );
          }
        } 
        // Normal paragraph lines
        else if (line) {
          parsedLines.push(
            <p key={i} className="text-slate-300 text-xs leading-relaxed my-2">
              {formatInline(line)}
            </p>
          );
        }
      }

      // Handle trailing table if text ends with a table row
      if (insideTable) {
        parsedLines.push(renderTable(tableHeaders, tableRows, index + '-final'));
      }

      return <div key={index}>{parsedLines}</div>;
    });
  };

  // Process inline bold text and link anchors
  const formatInline = (str: string) => {
    const boldParts = str.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((bPart, idx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return <strong key={idx} className="text-cyan-400 font-bold">{bPart.slice(2, -2)}</strong>;
      }
      
      // Parse links [text](url)
      const linkParts = bPart.split(/(\[.*?\]\(.*?\))/g);
      return linkParts.map((lPart, lIdx) => {
        const linkMatch = lPart.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <a 
              key={lIdx} 
              href={linkMatch[2]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 font-semibold underline hover:text-cyan-300 transition-colors mx-0.5"
            >
              {linkMatch[1]}
            </a>
          );
        }
        return lPart;
      });
    });
  };

  const renderTable = (headers: string[], rows: string[][], key: string) => (
    <div key={key} className="overflow-x-auto my-4 rounded-xl border border-white/5 bg-slate-900/40">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-white/5 bg-slate-900/80">
            {headers.map((h, i) => (
              <th key={i} className="p-3 text-white font-bold tracking-tight">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 text-slate-300">{formatInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`flex w-full mb-6 ${isAi ? 'justify-start' : 'justify-end animate-slide-up'}`}>
      <div className={`flex items-start space-x-3 max-w-[85%] ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}>
        
        {/* Profile/Agent Avatar */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
          isAi 
            ? 'bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border-cyan-500/20 text-cyan-400' 
            : 'bg-slate-800 border-white/10 text-slate-300'
        }`}>
          {isAi ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Text Container */}
        <div className="flex flex-col">
          
          {/* Header metadata */}
          <div className={`flex items-center space-x-2.5 mb-1.5 text-[10px] text-slate-400 ${isAi ? '' : 'justify-end'}`}>
            <span className="font-semibold text-slate-300">
              {isAi ? 'Saarthi AI' : 'You'}
            </span>
            <span>{message.timestamp}</span>
            {isAi && (
              <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold ${agentPillColors[message.agent]}`}>
                {agentLabels[message.agent]}
              </span>
            )}
          </div>

          {/* Bubble body */}
          <div className={`p-4 rounded-2xl text-slate-200 border transition-all ${
            isAi 
              ? 'bg-slate-900/40 border-white/5 backdrop-blur-sm rounded-tl-sm' 
              : 'bg-cyan-500/10 border-cyan-500/20 rounded-tr-sm'
          }`}>
            
            {/* Memory Recall Widget */}
            {isAi && message.retrievedMemory && (
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-violet-950/20 border border-violet-800/30 text-[9.5px] text-violet-300 flex items-center space-x-1.5 leading-relaxed font-semibold">
                <Brain className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                <span>{message.retrievedMemory}</span>
              </div>
            )}

            {/* Main parsed markdown */}
            {message.isGenerating ? (
              <div className="flex items-center space-x-2 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            ) : (
              <div className="space-y-1">
                {parseMarkdown(message.text)}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
export default MessageBubble;
