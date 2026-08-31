import { Bus, Train, Bike, Footprints, Car, MapPin, type LucideIcon } from 'lucide-react';
import type { RouteStep } from '../lib/api';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
  nextStepMode?: string;
}

// Authentic Philippine Transit Line Branding Colors
const MODE_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon; badgeColor: string; dotColor: string }
> = {
  lrt: {
    label: 'LRT-2 / LRT',
    icon: Train,
    badgeColor: 'bg-purple-100 text-purple-950 border-purple-500',
    dotColor: 'bg-purple-600',
  },
  mrt: {
    label: 'MRT-3',
    icon: Train,
    badgeColor: 'bg-blue-100 text-blue-950 border-blue-500',
    dotColor: 'bg-blue-600',
  },
  bus: {
    label: 'BUS',
    icon: Bus,
    badgeColor: 'bg-yellow-100 text-amber-950 border-amber-500',
    dotColor: 'bg-amber-500',
  },
  jeep: {
    label: 'JEEP',
    icon: Bus,
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-500',
    dotColor: 'bg-emerald-600',
  },
  uv_express: {
    label: 'UV-EXP',
    icon: Bus,
    badgeColor: 'bg-cyan-100 text-cyan-950 border-cyan-500',
    dotColor: 'bg-cyan-600',
  },
  tricycle: {
    label: 'TRIKE',
    icon: Bike,
    badgeColor: 'bg-orange-100 text-orange-950 border-orange-500',
    dotColor: 'bg-orange-500',
  },
  pnr: {
    label: 'PNR',
    icon: Train,
    badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-500',
    dotColor: 'bg-indigo-600',
  },
  grab: {
    label: 'GRAB/CAR',
    icon: Car,
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-500',
    dotColor: 'bg-emerald-600',
  },
  walk: {
    label: 'LAKAD',
    icon: Footprints,
    badgeColor: 'text-slate-600 border-slate-300 bg-transparent',
    dotColor: 'bg-slate-400',
  },
};

export default function StepCard({ step, isLast }: StepCardProps) {
  const isWalking = step.mode === 'walk';
  const modeInfo = MODE_CONFIG[step.mode] || {
    label: step.mode.toUpperCase(),
    icon: MapPin,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    dotColor: 'bg-slate-500',
  };
  const IconComponent = modeInfo.icon;

  const showLineLabel =
    step.line_label &&
    step.line_label.trim().toLowerCase() !== modeInfo.label.toLowerCase() &&
    step.line_label.trim().toLowerCase() !== step.mode.toLowerCase() &&
    !isWalking;

  const hasFare = step.fare_estimate_php !== null && step.fare_estimate_php !== undefined && step.fare_estimate_php > 0;

  // Contextual stop label based on step position
  const stopLabel = isLast ? 'Huling babaan / Destination:' : 'Bumaba / Transfer sa:';

  // ---------------------------------------------------------------
  // 1. WALKING CONNECTOR STEP (Compact, Transparent, Dotted Line)
  // ---------------------------------------------------------------
  if (isWalking) {
    return (
      <div className={`relative flex items-start gap-3.5 ${!isLast ? 'pb-3' : ''}`}>
        {/* Timeline Node & Dotted Connector Line */}
        <div className="flex flex-col items-center flex-shrink-0 w-4 pt-1">
          <div className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-white" />
          {!isLast && (
            <div className="w-0 flex-1 border-l-2 border-dashed border-slate-400 my-1 min-h-[22px]" />
          )}
        </div>

        {/* Compact Walking Description (No bulky card, no ₱0.00 fare) */}
        <div className="flex-1 py-0.5 px-1 flex items-center justify-between gap-2 text-xs text-slate-600 font-body">
          <div className="flex items-center gap-2">
            <Footprints className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <p className="leading-snug">
              <span className="font-medium text-slate-700">{step.instruction}</span>
              {step.landmark && (
                <span className="text-slate-500 ml-1">➔ {step.landmark}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // 2. PRIMARY VEHICLE TRANSIT LEG (Full Card, Solid Timeline Line)
  // ---------------------------------------------------------------
  return (
    <div className={`relative flex items-start gap-3.5 ${!isLast ? 'pb-4' : ''}`}>
      {/* Timeline Node & Solid Connector Line */}
      <div className="flex flex-col items-center flex-shrink-0 w-4 pt-1.5">
        <div className={`w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${modeInfo.dotColor} shadow-xs`} />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-slate-900 my-1 min-h-[30px]" />
        )}
      </div>

      {/* Structured Vehicle Transit Card */}
      <div className="flex-1 bg-white border-1.5 border-slate-900 rounded-lg p-3.5 shadow-xs">
        {/* Header Row: Mode Badge + Signboard Label + Fare Display */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-utility font-bold border ${modeInfo.badgeColor}`}
            >
              <IconComponent className="w-3 h-3" />
              <span>{modeInfo.label}</span>
            </span>

            {showLineLabel && (
              <span className="text-[11px] font-utility font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                {step.line_label}
              </span>
            )}
          </div>

          {/* Fare: Displayed ONLY for paid legs */}
          {hasFare && (
            <span className="font-utility text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              ₱{step.fare_estimate_php!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Commuter Instruction */}
        <p className="font-body text-xs sm:text-sm text-slate-900 font-semibold leading-snug">
          {step.instruction}
        </p>

        {/* Landmark / Stop with Contextual Microcopy */}
        {step.landmark && (
          <div className="mt-2 pt-1.5 border-t border-slate-100 text-[11px] font-utility text-slate-600 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="font-bold">{stopLabel}</span>
            <span className="text-slate-950 font-bold">{step.landmark}</span>
          </div>
        )}
      </div>
    </div>
  );
}
