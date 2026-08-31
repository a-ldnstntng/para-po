import { Bus, Train, Bike, Footprints, Car, MapPin, type LucideIcon } from 'lucide-react';
import type { RouteStep } from '../lib/api';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
}

const MODE_CONFIG: Record<string, { label: string; icon: LucideIcon; badgeColor: string }> = {
  jeep: { label: 'JEEP', icon: Bus, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
  tricycle: { label: 'TRIKE', icon: Bike, badgeColor: 'bg-orange-100 text-orange-900 border-orange-300' },
  bus: { label: 'BUS', icon: Bus, badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  uv_express: { label: 'UV-EXP', icon: Bus, badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
  walk: { label: 'LAKAD', icon: Footprints, badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  mrt: { label: 'MRT-3', icon: Train, badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' },
  lrt: { label: 'LRT', icon: Train, badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' },
  pnr: { label: 'PNR', icon: Train, badgeColor: 'bg-purple-100 text-purple-900 border-purple-300' },
  grab: { label: 'GRAB/CAR', icon: Car, badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
};

export default function StepCard({ step, index, isLast }: StepCardProps) {
  const modeInfo = MODE_CONFIG[step.mode] || { label: step.mode.toUpperCase(), icon: MapPin, badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' };
  const IconComponent = modeInfo.icon;
  const stepNum = String(index + 1).padStart(2, '0');

  // Check if line_label is distinct from mode label
  const showLineLabel =
    step.line_label &&
    step.line_label.trim().toLowerCase() !== modeInfo.label.toLowerCase() &&
    step.line_label.trim().toLowerCase() !== step.mode.toLowerCase();

  return (
    <div className={`relative ${!isLast ? 'pb-3.5' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Step Indicator & Timeline Line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-utility font-bold text-xs flex items-center justify-center shadow-xs">
            {stepNum}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-slate-300 my-1" />
          )}
        </div>

        {/* Step Content */}
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-3.5 shadow-xs">
          {/* Header Row: Mode Tag + Line Label + Fare */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-utility font-bold border ${modeInfo.badgeColor}`}>
                <IconComponent className="w-3 h-3" />
                <span>{modeInfo.label}</span>
              </span>
              {showLineLabel && (
                <span className="text-[11px] font-utility font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-300">
                  {step.line_label}
                </span>
              )}
            </div>

            {step.fare_estimate_php !== null && step.fare_estimate_php !== undefined && (
              <span className="font-utility text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                ₱{step.fare_estimate_php.toFixed(2)}
              </span>
            )}
          </div>

          {/* Instruction */}
          <p className="font-body text-xs sm:text-sm text-slate-800 font-medium leading-snug">
            {step.instruction}
          </p>

          {/* Landmark / Stop */}
          <div className="mt-1 text-[11px] font-utility text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">Alight / Stop:</span>
            <span className="text-slate-800 font-bold">{step.landmark}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
