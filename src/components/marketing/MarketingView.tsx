import React, { useState } from 'react';
import { Megaphone, Sparkles, Send, Copy, Check } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { executeAgentTask } from '../../services/agentService';

export const MarketingView: React.FC = () => {
  const [propertyTitle, setPropertyTitle] = useState('The Glasshouse Residence');
  const [targetAudience, setTargetAudience] = useState('Luxury High Net Worth Investors');
  const [channel, setChannel] = useState('Instagram & Email Blast');
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await executeAgentTask({
        agentType: 'marketing',
        prompt: `Create a multi-channel marketing campaign copy for "${propertyTitle}" targeted at ${targetAudience} for ${channel}. Include headline, Instagram caption with hashtags, and email newsletter copy based on database records.`,
      });

      setGeneratedCopy(res.responseText);
    } catch (err: any) {
      setGeneratedCopy('Error generating marketing copy: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCopy) return;
    navigator.clipboard.writeText(generatedCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-zinc-100 flex items-center gap-2.5">
          <Megaphone className="w-6 h-6 text-violet-400" />
          Multi-Channel Marketing Copywriter
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-mono">
          Generate factually aligned social captions, property brochures, and email campaigns from database records
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Form */}
        <GlassCard className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase">Campaign Parameters</h3>

          <form onSubmit={handleGenerateCampaign} className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Listing Title</label>
              <input
                type="text"
                value={propertyTitle}
                onChange={e => setPropertyTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-3 py-2 text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Target Persona</label>
              <input
                type="text"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-3 py-2 text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Distribution Channels</label>
              <input
                type="text"
                value={channel}
                onChange={e => setChannel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-xl px-3 py-2 text-zinc-100"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
            >
              <Sparkles className="w-4 h-4 fill-current" /> {isLoading ? 'Drafting Campaign...' : 'Generate Marketing Copy'}
            </button>
          </form>
        </GlassCard>

        {/* Output Area */}
        <GlassCard className="p-5 md:col-span-2 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase">Generated Copy Output</h3>
            {generatedCopy && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-cyan-400"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Copy'}
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap min-h-[260px] flex-1">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-violet-400 animate-pulse">
                Drafting luxury property marketing campaign from database attributes...
              </div>
            ) : generatedCopy ? (
              generatedCopy
            ) : (
              <span className="text-zinc-500">
                Click "Generate Marketing Copy" to draft custom copy using facts from the property listing record.
              </span>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
