import React, { useState } from 'react';
import { MessageSquare, Send, Bot, Sparkles, User } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { executeAgentTask } from '../../services/agentService';

export const CommunicationsView: React.FC = () => {
  const [messages, setMessages] = useState<
    { sender: 'client' | 'ai' | 'agent'; text: string; time: string }[]
  >([
    {
      sender: 'client',
      text: 'Hello, is the Skyview Horizon Penthouse still available for viewing this Friday?',
      time: '10:14 AM',
    },
    {
      sender: 'ai',
      text: '[DATABASE FACT] Yes, The Skyview Horizon Penthouse (#prop_penthouse_01) is active in our database at $2,850,000 USD. We have open viewing slots Friday between 2:00 PM and 5:00 PM.',
      time: '10:15 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'client', text: userText, time: nowTime }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await executeAgentTask({
        agentType: 'customer_service',
        prompt: userText,
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'I am communicating with the RealtyPulse database. Please confirm listing availability.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-2.5">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          CRM Client Communications & AI Customer Service
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-mono">
          24/7 Factual Customer Assistant linked to live property database
        </p>
      </div>

      <GlassCard className="p-6 flex flex-col h-[520px]">
        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === 'client' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'client'
                    ? 'bg-blue-500 text-zinc-950'
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                {m.sender === 'client' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'client'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-zinc-950/80 border border-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-bold text-[10px] opacity-80 uppercase font-mono">
                    {m.sender === 'client' ? 'Client / Lead' : 'Customer Service Agent'}
                  </span>
                  <span className="text-[9px] opacity-60 font-mono">{m.time}</span>
                </div>
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Checking database records...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask AI Customer Service about property price, bedrooms, or viewing slots..."
            className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </GlassCard>
    </div>
  );
};
