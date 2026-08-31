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

  const handleCopy = () => {
    const formatted = `🚐 PARA PO! Route Ticket: ${route.origin} → ${route.destination}\n\n` +
      route.steps.map((s, i) => `${i + 1}. [${s.mode.toUpperCase()}] ${s.instruction} (📍 ${s.landmark})`).join('\n') +
      `\n\nEst. Total Fare: ₱${totalFare || '—'}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="ticket ticket-print relative">
      {/* Red Verified Commute Stamp Watermark */}
      <div className="ticket-stamp">
        PARA PO! VERIFIED
      </div>

      {/* Ticket Header */}
      <div className="text-center mb-4 pt-1">
        <p className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
          — MANILA TRANSIT COMMUTE PASS —
        </p>
        
        {/* Origin to Destination title */}
        <div className="mt-2 flex items-center justify-center gap-2 flex-wrap px-8">
          <span className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-wide">
            {route.origin}
          </span>
          <span className="text-amber-500 font-bold text-lg">➔</span>
          <span className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-wide">
            {route.destination}
          </span>
        </div>

        {savedRoute && (
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Issued: {new Date(savedRoute.created_at).toLocaleDateString('en-PH', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* Dashed Separator */}
      <div className="border-t-2 border-dashed border-slate-300 my-4" />

      {/* Route Steps */}
      <div className="space-y-1">
        {route.steps.map((step, i) => (
          <StepCard
            key={i}
            step={step}
            index={i}
            isLast={i === route.steps.length - 1}
          />
        ))}
      </div>

      {/* Dashed Separator */}
      <div className="border-t-2 border-dashed border-slate-300 my-4" />

      {/* Barcode Accent */}
      <div className="text-center py-1 mb-3 opacity-75">
        <p className="font-mono text-2xl tracking-widest text-slate-800 select-none">
          ||||| ||| ||||||| || |||||
        </p>
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
          PASS ID: {savedRoute ? savedRoute.id.slice(0, 13).toUpperCase() : 'PASS-TEMP-MANILA'}
        </p>
      </div>

      {/* Footer: Total Fare + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-200">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Estimated Total Fare</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-2xl sm:text-3xl text-emerald-700">
              ₱{totalFare || '—'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({route.steps.length} step{route.steps.length !== 1 ? 's' : ''})
            </span>
          </div>
          {savedRoute && savedRoute.confirms > 0 && (
            <p className="text-xs text-emerald-600 font-medium mt-0.5">
              ✅ {savedRoute.confirms} commuter confirm{savedRoute.confirms !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Copy Route to Clipboard */}
          <button
            onClick={handleCopy}
            type="button"
            className="btn-secondary text-xs flex items-center gap-1.5 !bg-slate-100 !text-slate-800 !border-slate-300 hover:!bg-slate-200"
            title="Copy route steps to clipboard"
          >
            <span>{copied ? '✅' : '📋'}</span>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {onConfirm && (
            <button onClick={onConfirm} type="button" className="btn-confirm text-xs">
              ✅ Tama 'to!
            </button>
          )}

          {onSave && (
            <button onClick={onSave} type="button" className="btn-confirm text-xs">
              💾 Save
            </button>
          )}

          {onClear && (
            <button onClick={onClear} type="button" className="btn-secondary text-xs">
              ✕ Clear
            </button>
          )}

          {onDelete && (
            <button onClick={onDelete} type="button" className="btn-danger text-xs">
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {/* Copy Toast Feedback */}
      {copied && (
        <div className="toast-animate fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 px-4 py-2 rounded-full border border-amber-400/40 text-xs font-mono shadow-2xl z-50 flex items-center gap-2">
          <span>📋 Route copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}
