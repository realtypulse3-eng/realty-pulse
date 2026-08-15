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
        glass glass-glare group relative overflow-hidden rounded-3xl
        transition-all duration-500 ease-out
        ${glow ? 'glow-accent' : ''}
        ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_36px_90px_-24px_rgba(0,0,0,0.9)]' : ''}
        ${className}
      `}
    >
      {/* Liquid sheen that pools toward the pointer on hover */}
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent blur-md" />
      </div>
      {children}
    </div>
  );
};
