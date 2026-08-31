import { useState } from 'react';
import {
  Bus,
  Train,
  Bike,
  Footprints,
  Copy,
  Check,
  Bookmark,
  Star,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  type LucideIcon,
} from 'lucide-react';
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

const PRIMARY_ICONS: Record<string, LucideIcon> = {
  jeep: Bus,
  bus: Bus,
  uv_express: Bus,
  mrt: Train,
  lrt: Train,
  pnr: Train,
  tricycle: Bike,
  walk: Footprints,
};

export default function Ticket({
  route,
  onSave,
  onConfirm,
  onDelete,
  onClear,
  isSaved = false,
}: TicketProps) {
  const [copied, setCopied] = useState(false);
  const [showDirections, setShowDirections] = useState(true);

  const totalFare = route.steps.reduce(
    (sum, step) => sum + (step.fare_estimate_php || 0),
    0
  );

  const savedRoute = isSaved ? (route as SavedRoute) : null;

  // Find the most significant primary mode
  const primaryStep = route.steps.find((s) => s.mode !== 'walk') || route.steps[0];
  const PrimaryVehicleIcon = primaryStep ? PRIMARY_ICONS[primaryStep.mode] || Bus : Bus;

  // Single consistent serial ID
  const ticketSerial = `MNL-${Math.abs(route.origin.length * 41 + route.destination.length * 23) % 9000 + 1000}`;

  // Find the single most useful tip across all steps
  const bestTip = route.steps.find((s) => s.notes && s.notes.trim().length > 0)?.notes || null;

  const handleCopy = () => {
    const formatted =
      `PARA PO! TRANSIT PASS #${ticketSerial}\n` +
      `ROUTE: ${route.origin.toUpperCase()} ➔ ${route.destination.toUpperCase()}\n` +
      `TOTAL FARE: PHP ${totalFare.toFixed(2)} (${route.steps.length} steps)\n\n` +
      route.steps
        .map(
          (s, i) =>
            `${i + 1}. [${s.mode.toUpperCase()}] ${s.instruction} (Stop: ${s.landmark} | ₱${(s.fare_estimate_php || 0).toFixed(2)})`
        )
        .join('\n') +
      (bestTip ? `\n\nTIP: ${bestTip}` : '');

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const receiptDate = savedRoute ? new Date(savedRoute.created_at) : new Date();

  const formattedStampDate = receiptDate
    .toLocaleDateString('en-PH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();

  const formattedStampTime = receiptDate
    .toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* ========================================================
          1. WIDE LANDSCAPE TRANSIT TICKET PASS
          ======================================================== */}
      <div className="transit-pass flex flex-col md:flex-row relative">
        {/* Scalloped Circular Ticket Notches */}
        <div className="ticket-notch-top left-3/4 -ml-2.5 hidden md:block" />
        <div className="ticket-notch-bottom left-3/4 -ml-2.5 hidden md:block" />

        {/* MAIN BODY (Left ~75%) */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between relative bg-gradient-to-r from-[#111A2C] to-[#182338]">
          {/* Header Row: Transit Title + Validator Stamp + Ticket Serial */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div>
              <div className="text-[10px] font-utility font-semibold tracking-widest text-slate-400 uppercase">
                REPUBLIC OF THE PHILIPPINES
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-wide text-slate-100 uppercase leading-none mt-0.5">
                PARA PO! COMMUTE PASS
              </h2>
            </div>

            {/* Rotated Ink-Stamp Validator Punch */}
            <div className="validator-stamp">
              <div>VALIDATED</div>
              <div className="text-[10px] font-normal">{formattedStampDate} {formattedStampTime}</div>
            </div>
          </div>

          {/* Center Journey Line */}
          <div className="py-5">
            <div className="flex items-center justify-between gap-3 text-slate-400 font-utility text-[11px] uppercase tracking-wider mb-1">
              <span>ORIGIN</span>
              <span>DESTINATION</span>
            </div>

            {/* Horizontal Journey Line with Vehicle Icon */}
            <div className="flex items-center justify-between gap-3">
              <div className="font-display font-black text-xl sm:text-2xl md:text-3xl text-emerald-400 tracking-wide uppercase truncate max-w-[40%]">
                {route.origin}
              </div>

              {/* Connecting Journey Line with Icon */}
              <div className="flex-1 flex items-center justify-center gap-1.5 px-2 relative">
                <div className="h-0.5 flex-1 bg-slate-700" />
                <div className="p-1.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex-shrink-0 shadow-md">
                  <PrimaryVehicleIcon className="w-4 h-4" />
                </div>
                <div className="h-0.5 flex-1 bg-slate-700" />
              </div>

              <div className="font-display font-black text-xl sm:text-2xl md:text-3xl text-emerald-400 tracking-wide uppercase truncate max-w-[40%] text-right">
                {route.destination}
              </div>
            </div>
          </div>

          {/* Bottom Info Bar: Security Strip + Code128 Vector Barcode + Serial */}
          <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-utility tracking-widest text-slate-400 uppercase">
                TICKET NO.
              </div>
              <div className="font-utility font-bold text-xs sm:text-sm text-slate-200">
                PASS #{ticketSerial}
              </div>
            </div>

            {/* Code128 Vector Barcode */}
            <div className="flex flex-col items-center">
              <svg className="w-28 h-6 text-slate-300 fill-current opacity-80" viewBox="0 0 100 24">
                <rect x="0" y="0" width="3" height="24" />
                <rect x="5" y="0" width="2" height="24" />
                <rect x="9" y="0" width="4" height="24" />
                <rect x="15" y="0" width="1" height="24" />
                <rect x="18" y="0" width="3" height="24" />
                <rect x="23" y="0" width="2" height="24" />
                <rect x="27" y="0" width="5" height="24" />
                <rect x="34" y="0" width="1" height="24" />
                <rect x="37" y="0" width="3" height="24" />
                <rect x="42" y="0" width="2" height="24" />
                <rect x="46" y="0" width="4" height="24" />
                <rect x="52" y="0" width="1" height="24" />
                <rect x="55" y="0" width="3" height="24" />
                <rect x="60" y="0" width="2" height="24" />
                <rect x="64" y="0" width="5" height="24" />
                <rect x="71" y="0" width="2" height="24" />
                <rect x="75" y="0" width="3" height="24" />
                <rect x="80" y="0" width="1" height="24" />
                <rect x="83" y="0" width="4" height="24" />
                <rect x="89" y="0" width="2" height="24" />
                <rect x="93" y="0" width="3" height="24" />
                <rect x="98" y="0" width="2" height="24" />
              </svg>
              <span className="text-[9px] font-utility text-slate-500 uppercase tracking-widest mt-0.5">
                SINGLE RIDE ONLY
              </span>
            </div>
          </div>
        </div>

        {/* TEAR-OFF STUB (Right ~25%) */}
        <div className="w-full md:w-44 bg-[#131D2E] p-5 flex flex-col justify-between items-center text-center border-t md:border-t-0 md:border-l border-dashed border-slate-700 relative">
          {/* Accent Color Band on top/edge */}
          <div className="w-full h-1 bg-emerald-500 absolute top-0 left-0 right-0" />

          <div className="pt-2">
            <span className="text-[10px] font-utility tracking-widest text-slate-400 uppercase font-semibold">
              TOTAL FARE
            </span>
            <div className="font-display font-black text-4xl sm:text-5xl text-emerald-400 tracking-tight leading-none mt-1">
              ₱{totalFare.toFixed(0)}
            </div>
            <span className="text-[11px] font-utility text-slate-400">
              {route.steps.length} transit {route.steps.length === 1 ? 'step' : 'steps'}
            </span>
          </div>

          {/* Stub Barcode & Serial */}
          <div className="pt-3 border-t border-slate-800 w-full">
            <div className="font-utility text-[10px] text-slate-400 uppercase font-semibold">
              STUB #{ticketSerial}
            </div>
            <div className="text-[9px] font-utility text-emerald-500/80 uppercase font-bold mt-0.5">
              PAID • VERIFIED
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. SEPARATE EXPANDABLE DIRECTIONS DRAWER
          ======================================================== */}
      <div className="transit-panel overflow-hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setShowDirections(!showDirections)}
          type="button"
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-slate-100 tracking-wide uppercase">
              Mga Hakbang sa Byahe (Route Steps)
            </span>
            <span className="text-xs font-utility bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              {route.steps.length} steps
            </span>
          </div>
          {showDirections ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* Collapsible Content */}
        {showDirections && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 space-y-4">
            {/* Single Highlighted Primary Tip Callout */}
            {bestTip && (
              <div className="mt-3 rounded-lg bg-amber-950/40 border border-amber-800/70 p-3 flex items-start gap-2.5 text-xs text-amber-200">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-utility font-bold text-amber-300 uppercase tracking-wider mr-1">
                    Paalala sa Byahe:
                  </span>
                  <span className="leading-relaxed">{bestTip}</span>
                </div>
              </div>
            )}

            {/* Step-by-Step Timeline Cards */}
            <div className="pt-2">
              {route.steps.map((step, i) => (
                <StepCard
                  key={i}
                  step={step}
                  index={i}
                  isLast={i === route.steps.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          3. CLEAN ACTION BUTTONS WITH VECTOR ICONS
          ======================================================== */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <button
          onClick={handleCopy}
          type="button"
          className="btn-transit-secondary text-xs sm:text-sm"
          title="Kopyahin ang buong ruta"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          <span>{copied ? 'Kopyado Na!' : 'Kopyahin'}</span>
        </button>

        {onConfirm && (
          <button
            onClick={onConfirm}
            type="button"
            className="btn-transit-secondary text-xs sm:text-sm text-emerald-400 hover:text-emerald-300"
          >
            <Star className="w-4 h-4 text-emerald-400" />
            <span>Tama 'to!</span>
          </button>
        )}

        {onSave && (
          <button
            onClick={onSave}
            type="button"
            className="btn-sakay-primary !text-xs sm:!text-sm !py-2 !px-4"
          >
            <Bookmark className="w-4 h-4" />
            <span>I-Save</span>
          </button>
        )}

        {onClear && (
          <button
            onClick={onClear}
            type="button"
            className="btn-transit-secondary text-xs sm:text-sm"
          >
            <X className="w-4 h-4 text-slate-400" />
            <span>Isara</span>
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            type="button"
            className="px-3.5 py-2 rounded-lg border border-rose-800/80 bg-rose-950/50 text-rose-300 hover:bg-rose-900 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Burahin</span>
          </button>
        )}
      </div>
    </div>
  );
}
