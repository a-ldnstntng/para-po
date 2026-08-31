import type { RouteStep } from '../lib/api';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
}

const MODE_CONFIG: Record<string, { label: string; icon: string; badgeClass: string }> = {
  jeep: { label: 'Jeepney', icon: '🚐', badgeClass: 'mode-badge-jeep' },
  tricycle: { label: 'Tricycle', icon: '🛺', badgeClass: 'mode-badge-trike' },
  bus: { label: 'Bus', icon: '🚌', badgeClass: 'mode-badge-bus' },
  uv_express: { label: 'UV Express', icon: '🚐', badgeClass: 'mode-badge-uv' },
  walk: { label: 'Lakad', icon: '🚶', badgeClass: 'mode-badge-walk' },
  mrt: { label: 'MRT', icon: '🚈', badgeClass: 'mode-badge-train' },
  lrt: { label: 'LRT', icon: '🚈', badgeClass: 'mode-badge-train' },
  pnr: { label: 'PNR', icon: '🚂', badgeClass: 'mode-badge-train' },
  grab: { label: 'Grab/Car', icon: '🚗', badgeClass: 'mode-badge-bus' },
};

export default function StepCard({ step, index, isLast }: StepCardProps) {
  const modeInfo = MODE_CONFIG[step.mode] || { label: step.mode, icon: '📍', badgeClass: 'mode-badge-walk' };

  return (
    <div className={`relative ${!isLast ? 'pb-4' : ''}`}>
      <div className="flex items-start gap-3.5">
        {/* Step Indicator & Timeline Line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shadow-md">
            {index + 1}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-gradient-to-b from-slate-600 to-slate-800 my-1" />
          )}
        </div>

        {/* Step Content Card */}
        <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-md">
          {/* Header Tag Row */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${modeInfo.badgeClass}`}>
              <span>{modeInfo.icon}</span>
              <span>{modeInfo.label}</span>
            </span>

            {step.line_label && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                Line: {step.line_label}
              </span>
            )}

            {step.fare_estimate_php !== null && step.fare_estimate_php !== undefined && (
              <span className="ml-auto font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                ₱{step.fare_estimate_php} est.
              </span>
            )}
          </div>

          {/* Commute Instruction */}
          <p className="font-body text-sm sm:text-base font-medium text-slate-100 leading-snug">
            {step.instruction}
          </p>

          {/* Landmark / Stop Node */}
          <div className="mt-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className="text-amber-400">📍 Babaan:</span>
            <span className="text-slate-200 font-semibold">{step.landmark}</span>
          </div>

          {/* Notes Callout */}
          {step.notes && (
            <div className="mt-2 rounded-lg bg-amber-950/40 border border-amber-800/60 p-2.5 text-xs text-amber-200 flex items-start gap-1.5">
              <span className="text-sm">💡</span>
              <span className="leading-relaxed">{step.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
