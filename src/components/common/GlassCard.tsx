import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  onClick,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-[#161618]/90 backdrop-blur-xl
        border border-[#27272A] hover:border-[#3F3F46]
        rounded-2xl shadow-xl shadow-black/60
        transition-all duration-300
        ${glow ? 'before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-[#8B5CF6]/15 before:via-transparent before:to-[#6366F1]/15 before:blur-xl' : ''}
        ${onClick ? 'cursor-pointer hover:translate-y-[-2px] hover:border-[#8B5CF6]/50 hover:shadow-[#8B5CF6]/10' : ''}
        ${className}
      `}
    >
      {/* Subtle top glare highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent" />
      {children}
    </div>
  );
};
