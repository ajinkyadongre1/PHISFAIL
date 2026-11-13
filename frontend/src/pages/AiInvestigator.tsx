import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  User, 
  Trash2, 
  FileText, 
  CheckCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { ScanResult } from '../types';
import { soundFX } from '../services/sound';

interface Props {
  activeScanContext?: ScanResult | null;
  onClearContext?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  engine?: string;
  timestamp: string;
}

export const AiInvestigator: React.FC<Props> = ({ activeScanContext, onClearContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello! I am your PHISFAIL Cybersecurity Incident Investigator. Ask me to explain any scan finding, unpack social engineering techniques, or walk you through immediate incident-response steps if you clicked a suspicious link.",
      engine: 'PHISFAIL Cyber Engine',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    "I clicked a phishing link, what should I do right now?",
    "Explain my last scan result in simple terms",
    "How does the electricity bill power cut scam work?",
    "How do I report financial cyber fraud to 1930 in India?",
    "What is an APK remote access trojan (RAT)?"
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || inputValue).trim();
    if (!textToSend || loading) return;

    soundFX.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await api.chatInvestigator(textToSend, activeScanContext || undefined);
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        engine: response.engine,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, assistantMsg]);
      soundFX.playScanPing();
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered an issue connecting to the AI inference service. Please check your network or try again.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    soundFX.playClick();
    setMessages([
      {
        id: 'init-reset',
        sender: 'assistant',
        text: "Conversation cleared. Ready for your next cybersecurity investigation.",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  return (
    <div className="space-y-4 pb-8 h-[calc(100vh-100px)] flex flex-col max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="shrink-0 p-4 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-[#0a1226] to-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                AI CYBERSECURITY INVESTIGATOR
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/30">
                GEMINI-POWERED CO-PILOT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Plain-English threat explanations, evidence breakdowns, and step-by-step incident response playbooks.
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          title="Reset conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Active Scan Context Pill (if attached) */}
      {activeScanContext && (
        <div className="shrink-0 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>ACTIVE SCAN CONTEXT:</span>
            <span className="text-white truncate max-w-md">
              {activeScanContext.target_input} ({activeScanContext.risk_category} - {activeScanContext.risk_score}/100)
            </span>
          </div>
          {onClearContext && (
            <button
              onClick={onClearContext}
              className="text-slate-400 hover:text-white underline text-[10px]"
            >
              Detach Context
            </button>
          )}
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 glass-panel p-4 md:p-6 rounded-2xl border border-slate-800 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm font-sans space-y-2 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-medium rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.engine && (
                <div className="text-[10px] font-mono text-cyan-400/80 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                  <span>{msg.engine}</span>
                  <span className="text-slate-500">{msg.timestamp}</span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing threat intelligence & drafting response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-slate-500 shrink-0">Quick Queries:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 shrink-0 transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Dock */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="shrink-0 relative flex items-center"
      >
        <input
          type="text"
          placeholder="Ask about phishing risks, safe actions, or incident playbooks..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full px-5 py-3.5 pr-14 rounded-2xl bg-slate-950/90 border border-cyan-500/30 text-white placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-cyan-400 transition"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="absolute right-2.5 p-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

