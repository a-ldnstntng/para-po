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
    const formatted = `🚐 PARA PO! Commute Route: ${route.origin} ➔ ${route.destination}\n` +
      (viaStops.length > 0 ? `Via: ${viaStops.join(' • ')}\n\n` : '\n') +
      route.steps.map((s, i) => `${i + 1}. [${s.mode.toUpperCase()}] ${s.instruction} (📍 ${s.landmark})`).join('\n') +
      `\n\nEst. Total Fare: ₱${totalFare || '—'}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="transit-panel p-5 sm:p-6 w-full border-2 border-amber-500/30">
      {/* Top Acrylic Destination Signboard */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 border-2 border-blue-400/40 rounded-xl p-5 text-center shadow-lg">
        {/* Origin Tag */}
        <div className="inline-block bg-slate-900/90 text-slate-300 font-mono text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700 mb-2">
          Galing sa: {route.origin}
        </div>

        {/* Scaled Destination Title */}
        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-wide text-amber-400 leading-tight uppercase select-all">
          {route.destination}
        </h2>

        {/* VIA Sub-strip */}
        {viaStops.length > 0 && (
          <div className="mt-2.5 inline-block bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-lg py-1 px-3 text-xs sm:text-sm font-semibold">
            VIA: {viaStops.join(' • ')}
          </div>
        )}
      </div>

      {/* Manifest Timestamp / Details */}
      <div className="flex items-center justify-between py-3 border-b border-slate-800 text-xs font-mono text-slate-400">
        <span>{route.steps.length} TRANSIT STEP{route.steps.length !== 1 ? 'S' : ''}</span>
        {savedRoute ? (
          <span>
            Nai-save: {new Date(savedRoute.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        ) : (
          <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">Bagong Extract</span>
        )}
      </div>

      {/* Steps List */}
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

      {/* Bottom Summary Bar: Total Fare & Modern Action Buttons */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs font-medium text-slate-400 uppercase tracking-wider">
            Kabuuang Pamasahe (Est.)
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-mono font-black text-2xl sm:text-3xl text-emerald-400">
              ₱{totalFare || '0'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({route.steps.length} sakay/lakad)
            </span>
          </div>
          {savedRoute && savedRoute.confirms > 0 && (
            <div className="text-xs font-mono text-amber-400 font-semibold mt-0.5">
              ★ {savedRoute.confirms} commuter confirmation{savedRoute.confirms !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopy}
            type="button"
            className="btn-jeep-secondary text-xs flex items-center gap-1.5"
            title="Kopyahin ang buong ruta"
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Kopyado Na!' : 'Kopyahin'}</span>
          </button>

          {onConfirm && (
            <button onClick={onConfirm} type="button" className="btn-jeep-confirm text-xs">
              ★ Tama 'to!
            </button>
          )}

          {onSave && (
            <button onClick={onSave} type="button" className="btn-jeep-primary !text-xs !py-2 !px-4">
              💾 I-Save
            </button>
          )}

          {onClear && (
            <button onClick={onClear} type="button" className="btn-jeep-secondary text-xs">
              ✕ Isara
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              type="button"
              className="px-3 py-1.5 rounded-lg border border-rose-800/80 bg-rose-950/60 text-rose-300 hover:bg-rose-900 text-xs font-semibold transition-all"
            >
              🗑 Burahin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
