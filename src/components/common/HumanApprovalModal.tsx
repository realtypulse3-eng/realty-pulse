import React from 'react';
import { ShieldAlert, Check, X, AlertTriangle } from 'lucide-react';

interface HumanApprovalModalProps {
  isOpen: boolean;
  title?: string;
  description: string;
  onApprove: () => void;
  onCancel: () => void;
  actionDetails?: any;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  isOpen,
  title = 'AI Human Approval Required',
  description,
  onApprove,
  onCancel,
  actionDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Top subtle ambient glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <p className="text-xs text-amber-400 font-medium">Human Authorization Safeguard</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          {description}
        </p>

        {actionDetails && (
          <div className="mb-5 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-400 overflow-x-auto">
            <pre>{JSON.stringify(actionDetails, null, 2)}</pre>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" /> Reject / Cancel
          </button>
          <button
            onClick={onApprove}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Authorize & Execute
          </button>
        </div>
      </div>
    </div>
  );
};
