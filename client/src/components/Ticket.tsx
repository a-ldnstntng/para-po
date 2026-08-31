import { useState } from 'react';
import type { ExtractedRoute, SavedRoute } from '../lib/api';
import StepCard from './StepCard';

interface TicketProps {
  route: ExtractedRoute | SavedRoute;
  onSave?: () => void;
  onConfirm?: () => void;
  onDelete?: () => void;
  onClear?: () => void;
  isSaved?: boolean;
}

export default function Ticket({
  route,
  onSave,
  onConfirm,
  onDelete,
  onClear,
  isSaved = false,
}: TicketProps) {
  const [copied, setCopied] = useState(false);

  const totalFare = route.steps.reduce(
    (sum, step) => sum + (step.fare_estimate_php || 0),
    0
  );

  const savedRoute = isSaved ? (route as SavedRoute) : null;

  // Extract all significant landmarks into a "VIA" signboard string
  const viaStops = route.steps
    .map((s) => s.line_label || s.landmark)
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);

  const handleCopy = () => {
    const formatted = `🚐 PARA PO! COMMUTE ROUTE: ${route.origin.toUpperCase()} ➔ ${route.destination.toUpperCase()}\n` +
      `VIA: ${viaStops.join(' • ')}\n\n` +
      route.steps.map((s, i) => `${i + 1}. [${s.mode.toUpperCase()}] ${s.instruction} (Babaan: ${s.landmark})`).join('\n') +
      `\n\nESTIMATED TOTAL FARE: ₱${totalFare || '—'}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#000000] border-4 border-[#FFD700] shadow-[8px_8px_0px_#FF0000] p-4 sm:p-6 w-full">
      {/* Top Acrylic Signboard Destination Header */}
      <div className="bg-[#0000FF] border-4 border-[#FFFFFF] p-4 sm:p-6 text-center shadow-[4px_4px_0px_#000000]">
        {/* Origin Label */}
        <div className="inline-block bg-[#000000] text-[#FFFFFF] font-mono text-xs font-bold uppercase tracking-widest px-3 py-0.5 border border-[#FFFFFF] mb-2">
          MULA SA: {route.origin.toUpperCase()}
        </div>

        {/* MASSIVE FINAL DESTINATION */}
        <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#FFD700] text-stroke-black-lg leading-none uppercase select-all">
          {route.destination}
        </h2>

        {/* VIA Route Sub-strip */}
        {viaStops.length > 0 && (
          <div className="mt-3 bg-[#FFD700] text-[#000000] border-2 border-[#000000] py-1 px-3">
            <span className="font-display text-sm sm:text-base font-black tracking-wider uppercase">
              VIA: {viaStops.join(' • ').toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Manifest Timestamp / Route ID */}
      <div className="flex items-center justify-between py-3 border-b-2 border-[#333333] text-xs font-mono text-[#CCCCCC]">
        <span>TOTAL TRANSIT STOPS: {route.steps.length}</span>
        {savedRoute ? (
          <span>
            SAVED: {new Date(savedRoute.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        ) : (
          <span className="bg-[#FF0000] text-white px-2 py-0.5 font-bold">UNSAVED ROUTE</span>
        )}
      </div>

      {/* Step Manifest List */}
      <div className="my-4 space-y-2">
        {route.steps.map((step, i) => (
          <StepCard
            key={i}
            step={step}
            index={i}
            isLast={i === route.steps.length - 1}
          />
        ))}
      </div>

      {/* Bottom Summary Bar: Total Fare & Brutalist Buttons */}
      <div className="bg-[#111111] border-3 border-[#FFFFFF] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs font-bold text-[#CCCCCC] uppercase tracking-wider">
            KABUUANG PAMASAHE (ESTIMATE)
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-mono font-black text-3xl sm:text-4xl text-[#00E676]">
              ₱{totalFare || '0'}
            </span>
            <span className="text-xs font-mono text-[#AAAAAA]">
              ({route.steps.length} sakay/lakad)
            </span>
          </div>
          {savedRoute && savedRoute.confirms > 0 && (
            <div className="text-xs font-mono text-[#FFD700] font-bold mt-1">
              ★ {savedRoute.confirms} COMMUTER CONFIRMATION{savedRoute.confirms !== 1 ? 'S' : ''}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopy}
            type="button"
            className="brutalist-btn brutalist-btn-white text-sm py-1.5 px-3"
            title="Kopyahin ang buong ruta"
          >
            <span>{copied ? '✓ KOPYADO NA' : '📋 KOPYAHIN'}</span>
          </button>

          {onConfirm && (
            <button onClick={onConfirm} type="button" className="brutalist-btn brutalist-btn-green text-sm py-1.5 px-3">
              ★ TAMA 'TO!
            </button>
          )}

          {onSave && (
            <button onClick={onSave} type="button" className="brutalist-btn brutalist-btn-yellow text-sm py-1.5 px-4">
              💾 I-SAVE
            </button>
          )}

          {onClear && (
            <button onClick={onClear} type="button" className="brutalist-btn brutalist-btn-dark text-sm py-1.5 px-3">
              ✕ ISARA
            </button>
          )}

          {onDelete && (
            <button onClick={onDelete} type="button" className="brutalist-btn brutalist-btn-red text-sm py-1.5 px-3">
              🗑 BURAHIN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
