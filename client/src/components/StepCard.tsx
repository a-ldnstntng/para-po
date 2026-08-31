import { Bus, Train, Bike, Footprints, Car, MapPin, Clock, type LucideIcon } from 'lucide-react';
import type { RouteStep } from '../lib/api';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
  nextStepMode?: string;
}

const MODE_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon; badgeClass?: string }
> = {
  p2p_bus: {
    label: 'P2P BUS',
    icon: Bus,
    badgeClass: 'bg-indigo-950 text-indigo-100 border-indigo-900',
  },
  lrt: { label: 'LRT', icon: Train },
  mrt: { label: 'MRT-3', icon: Train },
  bus: { label: 'BUS', icon: Bus },
  jeep: { label: 'JEEP', icon: Bus },
  uv_express: { label: 'UV-EXP', icon: Bus },
  tricycle: { label: 'TRIKE', icon: Bike },
  pnr: { label: 'PNR', icon: Train },
  grab: { label: 'CAR', icon: Car },
  walk: { label: 'LAKAD', icon: Footprints },
};

export default function StepCard({ step, isLast }: StepCardProps) {
  const isWalking = step.mode === 'walk';
  const modeInfo = MODE_CONFIG[step.mode] || {
    label: step.mode.toUpperCase(),
    icon: MapPin,
  };
  const IconComponent = modeInfo.icon;

  const showLineLabel =
    step.line_label &&
    step.line_label.trim().toLowerCase() !== modeInfo.label.toLowerCase() &&
    step.line_label.trim().toLowerCase() !== step.mode.toLowerCase() &&
    !isWalking;

  const hasFare = step.fare_estimate_php !== null && step.fare_estimate_php !== undefined && step.fare_estimate_php > 0;
  const hasDuration = step.estimated_duration_min !== null && step.estimated_duration_min !== undefined && step.estimated_duration_min > 0;

  // Contextual stop copy
  const stopLabel = isLast ? 'Huling babaan:' : 'Babaan / Transfer:';

  // ---------------------------------------------------------------
  // 1. WALKING CONNECTOR STEP (Compact, Transparent, Dotted Line)
  // ---------------------------------------------------------------
  if (isWalking) {
    return (
      <div className={`relative flex items-start gap-3 ${!isLast ? 'pb-2.5' : ''}`}>
        {/* Timeline Node & Dotted Line */}
        <div className="flex flex-col items-center flex-shrink-0 w-3.5 pt-1">
          <div className="w-2 h-2 rounded-full border border-slate-400 bg-white" />
          {!isLast && (
            <div className="w-0 flex-1 border-l border-dashed border-slate-300 my-1 min-h-[18px]" />
          )}
        </div>

        {/* Compact Walking Description with Time Estimate */}
        <div className="flex-1 py-0.5 text-xs text-slate-500 font-utility flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <Footprints className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <p className="leading-snug">
              <span className="text-slate-600 font-medium">{step.instruction}</span>
              {step.landmark && <span className="text-slate-400 ml-1">➔ {step.landmark}</span>}
            </p>
          </div>
          {hasDuration && (
            <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
              ~{step.estimated_duration_min}m
            </span>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // 2. PRIMARY VEHICLE TRANSIT LEG (Structured Neutral Card)
  // ---------------------------------------------------------------
  return (
    <div className={`relative flex items-start gap-3 ${!isLast ? 'pb-3.5' : ''}`}>
      {/* Timeline Node & Solid Line */}
      <div className="flex flex-col items-center flex-shrink-0 w-3.5 pt-1.5">
        <div className={`w-2.5 h-2.5 rounded-full ${step.mode === 'p2p_bus' ? 'bg-indigo-900 ring-2 ring-indigo-300' : 'bg-slate-800'} shadow-xs`} />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-slate-300 my-1 min-h-[28px]" />
        )}
      </div>

      {/* Clean Transit Card */}
      <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
        {/* Header Row: Mode Badge + Signboard Label + Time & Fare Display */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-utility font-bold border ${
                modeInfo.badgeClass || 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <IconComponent className="w-3 h-3" />
              <span>{modeInfo.label}</span>
            </span>

            {showLineLabel && (
              <span className="text-[11px] font-utility font-medium text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                {step.line_label}
              </span>
            )}
          </div>

          {/* Time & Fare Axis */}
          <div className="flex items-center gap-2 font-utility text-xs">
            {hasDuration && (
              <span className="text-slate-500 font-medium flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>~{step.estimated_duration_min} mins</span>
              </span>
            )}
            {hasFare && (
              <span className="font-bold text-slate-800">
                ₱{step.fare_estimate_php!.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Instruction */}
        <p className="font-utility text-xs sm:text-sm text-slate-800 font-medium leading-snug">
          {step.instruction}
        </p>

        {/* Landmark / Stop */}
        {step.landmark && (
          <div className="mt-1.5 pt-1 border-t border-slate-100 text-[11px] font-utility text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span>{stopLabel}</span>
            <span className="text-slate-800 font-semibold">{step.landmark}</span>
          </div>
        )}
      </div>
    </div>
  );
}
