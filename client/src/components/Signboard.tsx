import type { ReactNode } from 'react';

interface SignboardProps {
  children: ReactNode;
  variant?: 'blue' | 'red' | 'green' | 'yellow' | 'white' | 'black';
  className?: string;
}

export default function Signboard({ children, variant = 'blue', className = '' }: SignboardProps) {
  const variantStyles: Record<string, string> = {
    blue: 'bg-[#0000FF] border-4 border-[#FFFFFF] text-[#FFFFFF] shadow-[6px_6px_0px_#FFD700]',
    yellow: 'bg-[#FFD700] border-4 border-[#000000] text-[#000000] shadow-[6px_6px_0px_#FF0000]',
    red: 'bg-[#FF0000] border-4 border-[#FFFFFF] text-[#FFFFFF] shadow-[6px_6px_0px_#000000]',
    green: 'bg-[#00E676] border-4 border-[#000000] text-[#000000] shadow-[6px_6px_0px_#0000FF]',
    white: 'bg-[#FFFFFF] border-4 border-[#000000] text-[#000000] shadow-[6px_6px_0px_#000000]',
    black: 'bg-[#111111] border-4 border-[#FFD700] text-[#FFFFFF] shadow-[6px_6px_0px_#FF0000]',
  };

  return (
    <div className={`p-4 sm:p-6 ${variantStyles[variant] || variantStyles.blue} ${className}`}>
      {children}
    </div>
  );
}
