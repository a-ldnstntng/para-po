import { useState, useMemo } from 'react';
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
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false);
  const [showDirections, setShowDirections] = useState(false); // Collapsed by default per prompt
  const [copied, setCopied] = useState(false);

  // Active option logic
  const options = route.options && route.options.length > 0 ? route.options : null;
  const activeOption = options ? options[selectedOptionIdx] || options[0] : null;
  const activeSteps = useMemo(() => {
    return activeOption ? activeOption.steps : route.steps;
  }, [activeOption, route.steps]);

  const totalFare = useMemo(() => {
    return activeSteps.reduce(
      (sum, step) => sum + (step.fare_estimate_php || 0),
      0
    );
  }, [activeSteps]);

  const savedRoute = isSaved ? (route as SavedRoute) : null;

  // Primary vehicle mode icon
  const primaryStep = activeSteps.find((s) => s.mode !== 'walk') || activeSteps[0];
  const PrimaryVehicleIcon = primaryStep ? PRIMARY_ICONS[primaryStep.mode] || Bus : Bus;

  // Single consistent serial ID
  const ticketSerial = `MNL-${Math.abs(route.origin.length * 41 + route.destination.length * 23 + selectedOptionIdx * 17) % 9000 + 1000}`;

  // Tip
  const bestTip = activeSteps.find((s) => s.notes && s.notes.trim().length > 0)?.notes || null;

  const handleCopy = () => {
    const optionHeader = activeOption ? `[${activeOption.title.toUpperCase()}]\n` : '';
    const formatted =
      `PARA PO! TRANSIT PASS #${ticketSerial}\n` +
      optionHeader +
      `ROUTE: ${route.origin.toUpperCase()} ➔ ${route.destination.toUpperCase()}\n` +
      `TOTAL FARE: PHP ${totalFare.toFixed(2)} (${activeSteps.length} steps)\n\n` +
      activeSteps
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
          0. PROGRESSIVE DISCLOSURE: MULTI-ROUTE TOGGLE
          ======================================================== */}
      {options && options.length > 1 && (
        <div className="w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-utility text-slate-500">
              Piniling ruta: <strong className="text-slate-800 font-semibold">{activeOption?.title}</strong>
            </span>
            <button
              onClick={() => setShowAlternativeRoutes(!showAlternativeRoutes)}
              type="button"
              className="text-xs font-utility text-slate-600 hover:text-slate-900 underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showAlternativeRoutes ? 'Itago ang ibang ruta' : `Tingnan ang ${options.length - 1} pang ruta`}</span>
              {showAlternativeRoutes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible Alternative Route Options */}
          {showAlternativeRoutes && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200">
              {options.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx;
                return (
                  <button
                    key={opt.option_id || idx}
                    onClick={() => {
                      setSelectedOptionIdx(idx);
                      setShowAlternativeRoutes(false);
                    }}
                    type="button"
                    className={`
                      p-2.5 rounded-lg text-left transition-all cursor-pointer border text-xs
                      ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className="font-display font-bold text-sm truncate">{opt.title}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px] font-utility">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                        {opt.steps?.length} {opt.steps?.length === 1 ? 'leg' : 'legs'}
                      </span>
                      {opt.total_fare_php !== undefined && (
                        <span className="font-bold">₱{opt.total_fare_php.toFixed(0)}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          1. THE SINGLE HERO OBJECT: TRANSIT PASS TICKET
          ======================================================== */}
      <div className="transit-pass flex flex-col sm:flex-row bg-white">
        {/* MAIN BODY (Left ~75%) */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between bg-white">
          {/* Header: Title + Validator Stamp */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="text-[10px] font-utility font-semibold tracking-widest text-slate-400 uppercase">
                REPUBLIC OF THE PHILIPPINES
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-wide text-slate-900 uppercase leading-none mt-0.5">
                PARA PO! COMMUTE PASS
              </h2>
            </div>

            {/* Validator Stamp */}
            <div className="validator-stamp">
              <div>VALIDATED</div>
              <div className="text-[9px] font-normal">{formattedStampDate} {formattedStampTime}</div>
            </div>
          </div>

          {/* Journey Section */}
          <div className="py-4 my-2 border-y border-dashed border-slate-200">
            <div className="space-y-3">
              {/* Origin */}
              <div>
                <span className="text-[10px] font-utility font-semibold text-slate-400 uppercase tracking-widest block">
                  ORIGIN
                </span>
                <div className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight uppercase">
                  {route.origin}
                </div>
              </div>

              {/* Connecting Journey Line with Vehicle Icon */}
              <div className="flex items-center gap-2 text-slate-600 my-1">
                <div className="p-1 rounded-full bg-slate-100 border border-slate-300 flex-shrink-0">
                  <PrimaryVehicleIcon className="w-4 h-4 text-slate-700" />
                </div>
                <div className="h-0.5 flex-1 bg-slate-200" />
                <span className="font-utility text-xs text-slate-400 uppercase font-semibold">
                  TO DESTINATION
                </span>
                <div className="h-0.5 w-6 bg-slate-200" />
              </div>

              {/* Destination */}
              <div>
                <span className="text-[10px] font-utility font-semibold text-slate-400 uppercase tracking-widest block">
                  DESTINATION
                </span>
                <div className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight uppercase">
                  {route.destination}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Bar: Serial + Barcode */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-utility tracking-widest text-slate-400 uppercase font-semibold">
                TICKET NO.
              </div>
              <div className="font-utility font-bold text-xs sm:text-sm text-slate-800">
                PASS #{ticketSerial}
              </div>
            </div>

            {/* Code128 Vector Barcode */}
            <div className="flex flex-col items-end">
              <svg className="w-24 h-5 text-slate-800 fill-current opacity-80" viewBox="0 0 100 24">
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
              <span className="text-[9px] font-utility text-slate-400 uppercase tracking-widest mt-0.5 font-semibold">
                SINGLE RIDE ONLY
              </span>
            </div>
          </div>
        </div>

        {/* TEAR-OFF STUB (Right ~25% - HERO ORANGE ACCENT FOR FARE) */}
        <div className="w-full sm:w-44 bg-slate-50 p-5 flex flex-col justify-between items-center text-center border-t sm:border-t-0 sm:border-l border-dashed border-slate-300 relative shrink-0">
          <div className="pt-2">
            <span className="text-[10px] font-utility tracking-widest text-slate-400 uppercase font-semibold">
              TOTAL FARE
            </span>
            {/* The single hero orange accent number */}
            <div className="font-display font-black text-4xl sm:text-5xl text-amber-700 tracking-tight leading-none mt-1">
              ₱{totalFare.toFixed(0)}
            </div>
            <span className="text-[11px] font-utility text-slate-500 font-medium mt-1 block">
              {activeSteps.length} {activeSteps.length === 1 ? 'transit leg' : 'transit legs'}
            </span>
          </div>

          {/* Stub Serial */}
          <div className="pt-3 border-t border-slate-200 w-full mt-4 sm:mt-0">
            <div className="font-utility text-[10px] text-slate-500 uppercase font-medium">
              STUB #{ticketSerial}
            </div>
            <div className="text-[9px] font-utility text-slate-400 uppercase font-semibold mt-0.5">
              VERIFIED PASS
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. PROGRESSIVE DISCLOSURE: COLLAPSIBLE DIRECTIONS DRAWER
          ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {/* Toggle Button (Single tap to expand) */}
        <button
          onClick={() => setShowDirections(!showDirections)}
          type="button"
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="font-display text-base sm:text-lg font-bold text-slate-800 tracking-wide uppercase">
              Mga Hakbang sa Byahe
            </span>
            <span className="text-xs font-utility bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded border border-slate-200">
              {activeSteps.length} {activeSteps.length === 1 ? 'leg' : 'legs'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-utility text-slate-500">
            <span>{showDirections ? 'Itago' : 'Tingnan'}</span>
            {showDirections ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </button>

        {/* Collapsible Step List Content */}
        {showDirections && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-3">
            {/* Integrated Tip */}
            {bestTip && (
              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-600 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="font-utility text-[11px] uppercase text-slate-700">Paalala: </strong>
                  {bestTip}
                </span>
              </div>
            )}

            {/* Connecting Step Timeline */}
            <div className="pt-2 pl-1">
              {activeSteps.map((step, i) => (
                <StepCard
                  key={i}
                  step={step}
                  index={i}
                  isLast={i === activeSteps.length - 1}
                  nextStepMode={activeSteps[i + 1]?.mode}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          3. CLEAN NEUTRAL ACTION BUTTONS
          ======================================================== */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
        <button
          onClick={handleCopy}
          type="button"
          className="btn-transit-secondary text-xs sm:text-sm"
          title="Kopyahin ang buong ruta"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-slate-800" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copied ? 'Kopyado Na!' : 'Kopyahin'}</span>
        </button>

        {onConfirm && (
          <button
            onClick={onConfirm}
            type="button"
            className="btn-transit-secondary text-xs sm:text-sm"
          >
            <Star className="w-3.5 h-3.5 text-slate-500" />
            <span>Tama 'to!</span>
          </button>
        )}

        {onSave && (
          <button
            onClick={onSave}
            type="button"
            className="btn-transit-secondary text-xs sm:text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>I-Save</span>
          </button>
        )}

        {onClear && (
          <button
            onClick={onClear}
            type="button"
            className="btn-transit-secondary text-xs sm:text-sm"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Bagong Byahe</span>
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            type="button"
            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-utility font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Burahin</span>
          </button>
        )}
      </div>
    </div>
  );
}
