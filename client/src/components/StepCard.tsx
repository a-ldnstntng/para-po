import { useState } from 'react';
import { Bus, Train, Bike, Footprints, Car, MapPin, Clock, Flag, type LucideIcon } from 'lucide-react';
import type { RouteStep } from '../lib/api';
import StepReportModal from './StepReportModal';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
  nextStepMode?: string;
}

const MODE_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  p2p_bus: {
    label: 'P2P BUS',
    icon: Bus,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  lrt: {
    label: 'LRT',
    icon: Train,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  mrt: {
    label: 'MRT-3',
    icon: Train,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  bus: {
    label: 'BUS',
    icon: Bus,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  jeep: {
    label: 'JEEP',
    icon: Bus,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  uv_express: {
    label: 'UV-EXP',
    icon: Bus,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  tricycle: {
    label: 'TRIKE',
    icon: Bike,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  pnr: {
    label: 'PNR',
    icon: Train,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  grab: {
    label: 'CAR',
    icon: Car,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  walk: {
    label: 'LAKAD',
    icon: Footprints,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
  },
};

export default function StepCard({ step, index, isLast }: StepCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const isWalking = step.mode === 'walk';
  const modeInfo = MODE_CONFIG[step.mode] || {
    label: step.mode.toUpperCase(),
    icon: MapPin,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  };
  const IconComponent = modeInfo.icon;

  const showLineLabel =
    step.line_label &&
    step.line_label.trim().toLowerCase() !== modeInfo.label.toLowerCase() &&
    step.line_label.trim().toLowerCase() !== step.mode.toLowerCase() &&
    !isWalking;

  const hasFare = step.fare_estimate_php !== null && step.fare_estimate_php !== undefined && step.fare_estimate_php > 0;
  const hasDuration = step.estimated_duration_min !== null && step.estimated_duration_min !== undefined && step.estimated_duration_min > 0;

  const stopLabel = isLast ? 'Huling babaan:' : 'Babaan / Transfer:';

  return (
    <>
      {/* ---------------------------------------------------------------
          1. WALKING CONNECTOR STEP (Compact Row)
          --------------------------------------------------------------- */}
      {isWalking ? (
        <div className={`relative flex items-center gap-3.5 ${!isLast ? 'pb-3' : ''} px-1`}>
          {/* Squircle Icon */}
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
            <Footprints className="w-3.5 h-3.5" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
            <p className="text-xs font-body text-slate-500 font-medium truncate">
              <span>{step.instruction}</span>
              {step.landmark && <span className="text-slate-400 ml-1">➔ {step.landmark}</span>}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasDuration && (
                <span className="text-[11px] font-body text-slate-400 font-medium">
                  ~{step.estimated_duration_min}m
                </span>
              )}
              <button
                onClick={() => setShowReportModal(true)}
                type="button"
                className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                title="I-ulat ang maling impormasyon sa hakbang na ito"
              >
                <Flag className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ---------------------------------------------------------------
            2. PRIMARY TRANSIT LEG (iOS Transaction-Style Card)
            --------------------------------------------------------------- */
        <div className={`relative flex items-start gap-3.5 ${!isLast ? 'pb-3.5' : ''}`}>
          {/* Icon Container */}
          <div className={`w-11 h-11 rounded-2xl ${modeInfo.iconBg} ${modeInfo.iconColor} flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5`}>
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Transit Card Details */}
          <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-3.5 sm:p-4 shadow-xs">
            {/* Top Line: Mode + Line Label + Fare/Time */}
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xs text-slate-900 tracking-wide uppercase">
                  {modeInfo.label}
                </span>

                {showLineLabel && (
                  <span className="text-[11px] font-body font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {step.line_label}
                  </span>
                )}
              </div>

              {/* Fare & Duration Pill */}
              <div className="flex items-center gap-2">
                {hasDuration && (
                  <span className="text-[11px] font-body font-semibold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>~{step.estimated_duration_min}m</span>
                  </span>
                )}
                {hasFare && (
                  <span className="font-display font-bold text-sm text-slate-900">
                    ₱{step.fare_estimate_php!.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Commuter Instruction */}
            <p className="font-body text-xs sm:text-sm text-slate-700 font-medium leading-snug">
              {step.instruction}
            </p>

            {/* Landmark / Stop & Unobtrusive Report Target */}
            <div className="mt-2.5 pt-2 border-t border-slate-50 flex items-center justify-between gap-2 flex-wrap text-[11px] font-body">
              {step.landmark ? (
                <div className="text-slate-400 flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span className="font-medium">{stopLabel}</span>
                  <span className="text-slate-700 font-semibold truncate">{step.landmark}</span>
                </div>
              ) : (
                <div />
              )}

              {/* Unobtrusive "Mali ba ito?" Tap Target */}
              <button
                onClick={() => setShowReportModal(true)}
                type="button"
                className="inline-flex items-center gap-1 text-[10px] font-utility text-slate-400 hover:text-rose-600 transition-colors cursor-pointer py-0.5"
                title="I-ulat ang maling pamasahe o rutang sarado na"
              >
                <Flag className="w-2.5 h-2.5" />
                <span>Mali ba ito?</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Report Modal */}
      {showReportModal && (
        <StepReportModal
          step={step}
          stepIndex={index}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}
