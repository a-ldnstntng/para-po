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

  const viaStops = route.steps
    .map((s) => s.line_label || s.landmark)
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);

  const handleCopy = () => {
    const formatted =
      `========================================\n` +
      `       *** PARA PO! TRANSIT PASS ***\n` +
      `         REPUBLIC OF THE PHILIPPINES\n` +
      `========================================\n` +
      `ORIGIN: ${route.origin.toUpperCase()}\n` +
      `DESTINATION: ${route.destination.toUpperCase()}\n` +
      (viaStops.length > 0 ? `VIA: ${viaStops.join(' • ').toUpperCase()}\n` : '') +
      `----------------------------------------\n` +
      route.steps.map((s, i) => `${String(i + 1).padStart(2, '0')}. [${s.mode.toUpperCase()}] ${s.instruction}\n    Stop: ${s.landmark} | Fare: PHP ${(s.fare_estimate_php || 0).toFixed(2)}`).join('\n') +
      `\n----------------------------------------\n` +
      `TOTAL TRANSIT STOPS: ${route.steps.length}\n` +
      `TOTAL ESTIMATED FARE: PHP ${totalFare.toFixed(2)}\n` +
      `========================================\n` +
      `   *** SALAMAT PO! INGAT SA BYAHE! ***\n` +
      `========================================`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const receiptDate = savedRoute
    ? new Date(savedRoute.created_at)
    : new Date();

  const formattedDate = receiptDate.toLocaleDateString('en-PH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  const formattedTime = receiptDate.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();

  return (
    <div className="w-full max-w-lg mx-auto my-6">
      {/* ========================================================
          THERMAL PAPER TRANSIT RECEIPT
          ======================================================== */}
      <div className="receipt-paper">
        {/* Official Header */}
        <div className="text-center">
          <p className="text-[11px] tracking-widest text-slate-500 font-bold uppercase">
            REPUBLIC OF THE PHILIPPINES
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider font-plate uppercase my-0.5">
            *** PARA PO! TRANSIT PASS ***
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            METRO MANILA COMMUTER NETWORK • OFFICIAL RECEIPT
          </p>
        </div>

        {/* Double Line Divider */}
        <div className="receipt-divider-double" />

        {/* Receipt Meta Details (Date, OR #, Stamp) */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div>
            <div>DATE: {formattedDate} {formattedTime}</div>
            <div>OR #: MNL-{Math.abs(route.origin.length * 37 + route.destination.length * 19) % 9000 + 1000}</div>
          </div>
          <div className="receipt-stamp">
            VERIFIED COMMUTE
          </div>
        </div>

        <div className="receipt-divider" />

        {/* Origin & Destination Route Block */}
        <div className="bg-slate-100 p-3 rounded border border-slate-300">
          <div className="text-[11px] text-slate-500 uppercase font-semibold">
            MULA SA (ORIGIN):
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 uppercase">
            {route.origin}
          </div>

          <div className="text-[11px] text-slate-500 uppercase font-semibold mt-2">
            PAPUNTA SA (DESTINATION):
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-800 uppercase font-plate tracking-wide">
            {route.destination}
          </div>

          {viaStops.length > 0 && (
            <div className="mt-2 pt-1.5 border-t border-slate-200 text-[11px] text-slate-600 font-medium">
              <span className="font-bold text-slate-800">VIA:</span> {viaStops.join(' • ')}
            </div>
          )}
        </div>

        {/* Table Header */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider pt-3 pb-1 border-b-2 border-slate-800 mt-2">
          <span>QTY / TRANSIT STEP</span>
          <span>EST. FARE</span>
        </div>

        {/* Itemized Transit Step List */}
        <div className="py-3 space-y-1">
          {route.steps.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              index={i}
              isLast={i === route.steps.length - 1}
            />
          ))}
        </div>

        <div className="receipt-divider" />

        {/* Receipt Totals Summary */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>TOTAL TRANSIT STEPS:</span>
            <span className="font-bold text-slate-900">{route.steps.length} STOPS</span>
          </div>

          <div className="flex justify-between items-baseline text-sm sm:text-base font-black text-slate-900 pt-1 border-t border-slate-300">
            <span className="font-plate text-lg">TOTAL ESTIMATED FARE:</span>
            <span className="text-lg sm:text-xl text-emerald-700">PHP {totalFare.toFixed(2)}</span>
          </div>

          {savedRoute && savedRoute.confirms > 0 && (
            <div className="text-[11px] text-amber-700 font-bold pt-1">
              ★ {savedRoute.confirms} COMMUTER CONFIRMATION{savedRoute.confirms !== 1 ? 'S' : ''}
            </div>
          )}
        </div>

        {/* Double Line Divider */}
        <div className="receipt-divider-double mt-3" />

        {/* Barcode & Footer */}
        <div className="text-center pt-1 pb-2">
          {/* Simulated Barcode */}
          <div className="tracking-[0.25em] font-mono text-base font-bold text-slate-800 select-none">
            || | | ||| |||| | ||| || |||| || | ||| |
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
            PASS ID: MNL-2026-COMMUTE-{Math.abs(route.destination.length * 13) % 900 + 100}
          </p>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1.5 font-plate">
            *** SALAMAT PO! INGAT SA BYAHE! ***
          </p>
        </div>
      </div>

      {/* ========================================================
          RECEIPT ACTION BUTTONS
          ======================================================== */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <button
          onClick={handleCopy}
          type="button"
          className="btn-jeep-secondary text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
          title="Kopyahin ang resibo sa clipboard"
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{copied ? 'Kopyado ang Resibo!' : 'Kopyahin ang Resibo'}</span>
        </button>

        {onConfirm && (
          <button
            onClick={onConfirm}
            type="button"
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
          >
            ★ Tama 'to!
          </button>
        )}

        {onSave && (
          <button
            onClick={onSave}
            type="button"
            className="btn-jeep-primary !text-xs sm:!text-sm !py-2 !px-4 shadow-md"
          >
            💾 I-Save sa Terminal
          </button>
        )}

        {onClear && (
          <button
            onClick={onClear}
            type="button"
            className="btn-jeep-secondary text-xs sm:text-sm"
          >
            ✕ Isara
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            type="button"
            className="px-3 py-2 rounded-lg border border-rose-800/80 bg-rose-950/60 text-rose-300 hover:bg-rose-900 text-xs sm:text-sm font-semibold transition-all"
          >
            🗑 Burahin
          </button>
        )}
      </div>
    </div>
  );
}
