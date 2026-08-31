import type { RouteStep } from '../lib/api';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
}

const MODE_CONFIG: Record<string, { label: string; icon: string; tagClass: string }> = {
  jeep: { label: 'JEEP', icon: '🚐', tagClass: 'receipt-mode-jeep' },
  tricycle: { label: 'TRIKE', icon: '🛺', tagClass: 'receipt-mode-trike' },
  bus: { label: 'BUS', icon: '🚌', tagClass: 'receipt-mode-bus' },
  uv_express: { label: 'UV-EXP', icon: '🚐', tagClass: 'receipt-mode-uv' },
  walk: { label: 'LAKAD', icon: '🚶', tagClass: 'receipt-mode-walk' },
  mrt: { label: 'MRT-3', icon: '🚈', tagClass: 'receipt-mode-train' },
  lrt: { label: 'LRT', icon: '🚈', tagClass: 'receipt-mode-train' },
  pnr: { label: 'PNR', icon: '🚂', tagClass: 'receipt-mode-train' },
  grab: { label: 'GRAB/CAR', icon: '🚗', tagClass: 'receipt-mode-bus' },
};

export default function StepCard({ step, index, isLast }: StepCardProps) {
  const modeInfo = MODE_CONFIG[step.mode] || { label: step.mode.toUpperCase(), icon: '📍', tagClass: 'receipt-mode-walk' };
  const stepNum = String(index + 1).padStart(2, '0');

  return (
    <div className={`text-xs sm:text-sm font-mono text-slate-800 ${!isLast ? 'pb-3 mb-3 border-b border-dashed border-slate-300' : ''}`}>
      {/* Item Line: QTY / STEP # + MODE + FARE */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-slate-900">{stepNum}.</span>
          <span className={`receipt-mode-tag ${modeInfo.tagClass}`}>
            {modeInfo.icon} {modeInfo.label}
          </span>
          {step.line_label && (
            <span className="font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">
              [{step.line_label}]
            </span>
          )}
        </div>

        {/* Right-aligned Fare Amount */}
        <div className="font-bold text-slate-900 whitespace-nowrap text-right text-xs sm:text-sm">
          {step.fare_estimate_php !== null && step.fare_estimate_php !== undefined
            ? `PHP ${Number(step.fare_estimate_php).toFixed(2)}`
            : 'PHP 0.00'}
        </div>
      </div>

      {/* Instruction */}
      <p className="mt-1 pl-6 text-slate-700 text-xs sm:text-[13px] leading-relaxed">
        {step.instruction}
      </p>

      {/* Landmark / Stop */}
      <div className="mt-1 pl-6 text-[11px] text-slate-500 flex items-center gap-1">
        <span>➔ BABAAN / STOP:</span>
        <span className="font-semibold text-slate-800">{step.landmark}</span>
      </div>

      {/* Note / Tip */}
      {step.notes && (
        <div className="mt-1.5 ml-6 p-2 rounded bg-amber-100/70 border border-amber-300/80 text-[11px] text-amber-900 leading-snug">
          💡 *PAALALA:* {step.notes}
        </div>
      )}
    </div>
  );
}
