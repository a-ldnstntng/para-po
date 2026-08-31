import { Bus, Train, Bike, Footprints, Car, MapPin, type LucideIcon } from 'lucide-react';
import type { RouteStep } from '../lib/api';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
}

const MODE_CONFIG: Record<string, { label: string; icon: LucideIcon; badgeColor: string }> = {
  jeep: { label: 'JEEP', icon: Bus, badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  tricycle: { label: 'TRIKE', icon: Bike, badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-800' },
  bus: { label: 'BUS', icon: Bus, badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  uv_express: { label: 'UV-EXP', icon: Bus, badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
  walk: { label: 'LAKAD', icon: Footprints, badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' },
  mrt: { label: 'MRT-3', icon: Train, badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  lrt: { label: 'LRT', icon: Train, badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  pnr: { label: 'PNR', icon: Train, badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800' },
  grab: { label: 'GRAB/CAR', icon: Car, badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
};

export default function StepCard({ step, index, isLast }: StepCardProps) {
  const modeInfo = MODE_CONFIG[step.mode] || { label: step.mode.toUpperCase(), icon: MapPin, badgeColor: 'bg-slate-800 text-slate-300 border-slate-700' };
  const IconComponent = modeInfo.icon;
  const stepNum = String(index + 1).padStart(2, '0');

  return (
    <div className={`relative ${!isLast ? 'pb-4' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Step Indicator & Timeline Line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-utility font-bold text-xs flex items-center justify-center">
            {stepNum}
          </div>
          {!isLast && (
            <div className="w-0.5 flex-1 bg-slate-800 my-1" />
          )}
        </div>

        {/* Step Content */}
        <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 sm:p-3.5">
          {/* Header Row: Mode Tag + Line Label + Fare */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-utility font-bold border ${modeInfo.badgeColor}`}>
                <IconComponent className="w-3 h-3" />
                <span>{modeInfo.label}</span>
              </span>
              {step.line_label && (
                <span className="text-[11px] font-utility font-semibold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                  {step.line_label}
                </span>
              )}
            </div>

            {step.fare_estimate_php !== null && step.fare_estimate_php !== undefined && (
              <span className="font-utility text-xs font-bold text-emerald-400">
                ₱{step.fare_estimate_php.toFixed(2)}
              </span>
            )}
          </div>

          {/* Instruction */}
          <p className="font-body text-xs sm:text-sm text-slate-200 leading-snug">
            {step.instruction}
          </p>

          {/* Landmark / Stop */}
          <div className="mt-1 text-[11px] font-utility text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span>Alight / Stop:</span>
            <span className="text-slate-200 font-semibold">{step.landmark}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
