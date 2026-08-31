import type { ReactNode } from 'react';

interface SignboardProps {
  children: ReactNode;
  variant?: 'blue' | 'red' | 'green' | 'yellow';
  className?: string;
}

export default function Signboard({ children, variant = 'blue', className = '' }: SignboardProps) {
  const gradients: Record<string, string> = {
    blue: 'from-[#0047AB] via-[#003380] to-[#001F42]',
    red: 'from-[#E63946] via-[#B91C1C] to-[#7F1D1D]',
    green: 'from-[#059669] via-[#047857] to-[#064E3B]',
    yellow: 'from-[#D97706] via-[#B45309] to-[#78350F]',
  };

  return (
    <div className={`signboard bg-gradient-to-br ${gradients[variant]} ${className}`}>
      <div className="signboard-rivets">
        {children}
      </div>
    </div>
  );
}
