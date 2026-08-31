import type { RouteStep } from '../lib/api';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
}

const MODE_ICONS: Record<string, string> = {
  jeep: '🚐',
  tricycle: '🛺',
  bus: '🚌',
  uv_express: '🚐',
  walk: '🚶',
  mrt: '🚈',
  lrt: '🚈',
  pnr: '🚂',
  grab: '🚗',
};

const MODE_LABELS: Record<string, string> = {
  jeep: 'Jeepney',
  tricycle: 'Tricycle',
  bus: 'Bus',
  uv_express: 'UV Express',
  walk: 'Lakad',
  mrt: 'MRT Train',
  lrt: 'LRT Train',
  pnr: 'PNR Train',
  grab: 'Grab / Car',
};

export default function StepCard({ step, index, isLast }: StepCardProps) {
  return (
    <div
      className="step-slide-in relative"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className={`flex gap-4 ${!isLast ? 'pb-6' : ''}`}>
        {/* Timeline connector circle & path line */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-base flex-shrink-0 shadow-md">
            {MODE_ICONS[step.mode] || '📍'}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-gradient-to-b from-slate-400 via-slate-300 to-transparent mt-1" />
          )}
        </div>

        {/* Step details content */}
        <div className="flex-1 pb-1">
          {/* Mode badge + signboard line label + fare */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`mode-badge mode-${step.mode}`}>
              <span>{MODE_ICONS[step.mode]}</span>
              <span>{MODE_LABELS[step.mode] || step.mode}</span>
            </span>
            {step.line_label && (
              <span className="line-label">BOARD: {step.line_label}</span>
            )}
            {step.fare_estimate_php !== null && step.fare_estimate_php !== undefined && (
              <span className="fare-badge">₱{step.fare_estimate_php} EST</span>
            )}
          </div>

          {/* Imperative Taglish Instruction */}
          <p className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
            {step.instruction}
          </p>

          {/* Stop / Landmark location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-mono mt-1">
            <span>📍 Stop:</span>
            <span className="font-semibold text-slate-700">{step.landmark}</span>
          </div>

          {/* Commuter Tips / Alternatives notes */}
          {step.notes && (
            <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-1.5">
              <span className="text-sm">💡</span>
              <span className="leading-snug">{step.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
