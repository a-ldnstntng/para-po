import type { RouteStep } from '../lib/api';

interface StepCardProps {
  step: RouteStep;
  index: number;
  isLast: boolean;
}

const MODE_TAGS: Record<string, { label: string; bgClass: string }> = {
  jeep: { label: 'JEEP', bgClass: 'sign-mode-jeep' },
  tricycle: { label: 'TRIKE', bgClass: 'sign-mode-tricycle' },
  bus: { label: 'BUS', bgClass: 'sign-mode-bus' },
  uv_express: { label: 'UV EXP', bgClass: 'sign-mode-uv_express' },
  walk: { label: 'LAKAD', bgClass: 'sign-mode-walk' },
  mrt: { label: 'MRT', bgClass: 'sign-mode-mrt' },
  lrt: { label: 'LRT', bgClass: 'sign-mode-lrt' },
  pnr: { label: 'PNR', bgClass: 'sign-mode-pnr' },
  grab: { label: 'GRAB/CAR', bgClass: 'sign-mode-grab' },
};

export default function StepCard({ step, index, isLast }: StepCardProps) {
  const modeInfo = MODE_TAGS[step.mode] || { label: step.mode.toUpperCase(), bgClass: 'sign-mode-walk' };

  return (
    <div className={`relative ${!isLast ? 'pb-4' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Step Number Box */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-8 h-8 bg-[#000000] border-2 border-[#FFFFFF] text-[#FFD700] font-mono font-black text-sm flex items-center justify-center">
            {index + 1}
          </div>
          {!isLast && (
            <div className="w-1 flex-1 bg-[#444444] my-1" />
          )}
        </div>

        {/* Step Details Box */}
        <div className="flex-1 bg-[#1A1A1A] border-2 border-[#444444] p-3 sm:p-4">
          {/* Header Row: Mode Tag + Signboard Plaque + Fare */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`sign-mode-tag ${modeInfo.bgClass}`}>
              {modeInfo.label}
            </span>

            {step.line_label && (
              <span className="font-display font-bold text-sm bg-[#0000FF] text-[#FFD700] border-2 border-[#FFFFFF] px-2 py-0.5">
                BYAHE: {step.line_label.toUpperCase()}
              </span>
            )}

            {step.fare_estimate_php !== null && step.fare_estimate_php !== undefined && (
              <span className="sign-fare-tag ml-auto">
                EST: ₱{step.fare_estimate_php}
              </span>
            )}
          </div>

          {/* Imperative Instruction */}
          <p className="font-mono text-sm sm:text-base font-bold text-[#FFFFFF] leading-snug">
            {step.instruction}
          </p>

          {/* Landmark / Stop Node */}
          <div className="mt-2 text-xs font-mono text-[#CCCCCC] bg-[#000000] border border-[#333333] px-2 py-1 flex items-center gap-1.5">
            <span className="text-[#FFD700] font-bold">STOP / BABAAN:</span>
            <span className="font-bold text-[#FFFFFF]">{step.landmark.toUpperCase()}</span>
          </div>

          {/* Commuter Tips / Note */}
          {step.notes && (
            <div className="mt-2 bg-[#FFD700] text-[#000000] border-2 border-[#000000] p-2 text-xs font-mono font-bold leading-tight">
              <span className="underline mr-1">PAALALA:</span>
              <span>{step.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
