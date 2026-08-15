import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  id,
}) => {
  return (
    <GlassCard id={id} className="p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
      <div className="w-16 h-16 rounded-2xl bg-[#1D1D21] border border-[#27272A] flex items-center justify-center text-[#8B5CF6] mb-5 shadow-lg shadow-[#8B5CF6]/10">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-light text-[#E4E4E7] mb-2">{title}</h3>
      <p className="text-[#71717A] max-w-md text-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6] hover:opacity-90 text-white text-sm font-semibold shadow-lg shadow-[#8B5CF6]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </GlassCard>
  );
};
