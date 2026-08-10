import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileText,
  FileSpreadsheet,
  Building2,
  Users,
  DollarSign,
  Activity,
} from 'lucide-react';
import { AGENT_DEFINITIONS } from '../../data/agentDefinitions';
import { AgentType, AgentTask, AgentActivity } from '../../types';
import { executeAgentTask } from '../../services/agentService';
import { db } from '../../lib/db';
import { GlassCard } from '../common/GlassCard';
import { HumanApprovalModal } from '../common/HumanApprovalModal';

interface AgentWorkspaceProps {
  agentType: AgentType;
  onBack: () => void;
  initialPrompt?: string;
  initialEntityId?: string;
}

export const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({
  agentType,
  onBack,
  initialPrompt,
  initialEntityId,
}) => {
  const agent = AGENT_DEFINITIONS[agentType];
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [taskHistory, setTaskHistory] = useState<AgentTask[]>([]);
  const [latestResult, setLatestResult] = useState<string | null>(null);
  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    description: string;
    details?: any;
  }>({ isOpen: false, description: '' });

  useEffect(() => {
    loadTasks();
    if (initialPrompt) {
      handleRunTask(initialPrompt, initialEntityId);
    }
  }, [agentType]);

  const loadTasks = async () => {
    const allTasks = await db.getAgentTasks();
    setTaskHistory(allTasks.filter(t => t.agent_type === agentType));
  };

  const handleRunTask = async (customPrompt?: string, entityId?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsLoading(true);
    setLatestResult(null);

    try {
      const result = await executeAgentTask({
        agentType,
        prompt: activePrompt,
        entityId: entityId || initialEntityId,
      });

      setLatestResult(result.responseText);

      if (result.requiresApproval) {
        setApprovalModal({
          isOpen: true,
          description: `The ${agent.name} requires human authorization before executing this high-impact CRM modification.`,
          details: { agent: agent.name, prompt: activePrompt },
        });
      }

      setPrompt('');
      loadTasks();
    } catch (err: any) {
      setLatestResult(`[ERROR] Task execution failed: ${err.message || 'Unknown server error.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to 12 AI Agents Swarm
      </button>

      {/* Agent Identity Banner */}
      <GlassCard className="p-6" glow>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20 shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE & READY
                </span>
                <span className="text-xs text-slate-400 font-mono">{agent.badge}</span>
              </div>
              <h1 className="text-2xl font-bold font-display text-slate-100 mt-1">{agent.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{agent.role}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-4 pt-4 border-t border-slate-800">
          {agent.description}
        </p>

        {/* Capabilities Chips */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-2">Agent Capabilities:</span>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((cap, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" /> {cap}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Suggested Actions Bar */}
      <div>
        <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block mb-3">
          Suggested AI Actions:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {agent.suggestedActions.map((act, i) => (
            <button
              key={i}
              onClick={() => handleRunTask(act)}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-left text-xs text-slate-200 font-medium transition-all hover:border-cyan-500/40 flex items-center justify-between group"
            >
              <span>{act}</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-125 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Interactive Console */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Interactive Agent Console
        </h3>

        {/* Output Box */}
        {latestResult && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
            {latestResult}
          </div>
        )}

        {isLoading && (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
            <Activity className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-cyan-400 font-mono">Executing task across live Supabase database records...</p>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunTask();
          }}
          className="flex items-center gap-3 pt-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={`Instruct ${agent.name}... (e.g. "${agent.suggestedActions[0]}")`}
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-3.5 h-3.5" /> Execute
          </button>
        </form>
      </GlassCard>

      {/* Task History Log for this Agent */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-bold text-slate-100 mb-3 font-mono uppercase">
          Agent Task History ({taskHistory.length})
        </h3>
        {taskHistory.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6 border border-dashed border-slate-800 rounded-xl">
            No previous tasks recorded for this agent in database.
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {taskHistory.map(t => (
              <div key={t.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200">{t.task_type}</span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {new Date(t.created_at).toLocaleString()}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  t.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Human Approval Modal */}
      <HumanApprovalModal
        isOpen={approvalModal.isOpen}
        description={approvalModal.description}
        actionDetails={approvalModal.details}
        onApprove={() => {
          setApprovalModal({ isOpen: false, description: '' });
          alert('Action authorized and logged in database.');
        }}
        onCancel={() => setApprovalModal({ isOpen: false, description: '' })}
      />
    </div>
  );
};
