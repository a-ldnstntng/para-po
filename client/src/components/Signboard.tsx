import type { ReactNode } from 'react';

interface SignboardProps {
  children: ReactNode;
  variant?: 'blue' | 'yellow' | 'red' | 'green' | 'dark';
  className?: string;
}

export default function Signboard({ children, variant = 'blue', className = '' }: SignboardProps) {
  const variantStyles: Record<string, string> = {
    blue: 'bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] border-2 border-blue-400/40 text-white shadow-lg shadow-blue-950/40',
    yellow: 'bg-gradient-to-br from-[#D97706] to-[#B45309] border-2 border-amber-400/50 text-white shadow-lg shadow-amber-950/40',
    red: 'bg-gradient-to-br from-[#BE123C] to-[#9F1239] border-2 border-rose-400/40 text-white shadow-lg shadow-rose-950/40',
    green: 'bg-gradient-to-br from-[#047857] to-[#065F46] border-2 border-emerald-400/40 text-white shadow-lg shadow-emerald-950/40',
    dark: 'bg-[#131B2E] border-2 border-slate-700 text-slate-100 shadow-xl',
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl ${variantStyles[variant] || variantStyles.blue} ${className}`}>
      {children}
    </div>
  );
}
