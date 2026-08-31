import { useState, useMemo } from 'react';
import {
  Bus,
  Train,
  Bike,
  Footprints,
  Car,
  Copy,
  Check,
  Bookmark,
  Star,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  WifiOff,
  Layers,
  ListOrdered,
  type LucideIcon,
} from 'lucide-react';
import type { ExtractedRoute, SavedRoute, RouteOption } from '../lib/api';
import StepCard from './StepCard';
import RealBarcode from './RealBarcode';

interface TicketProps {
  route: ExtractedRoute | SavedRoute;
  onSave?: () => void;
  onConfirm?: () => void;
  onDelete?: () => void;
  onClear?: () => void;
  isSaved?: boolean;
}

const PRIMARY_ICONS: Record<string, LucideIcon> = {
  p2p_bus: Bus,
  jeep: Bus,
  bus: Bus,
  uv_express: Bus,
  mrt: Train,
  lrt: Train,
  pnr: Train,
  tricycle: Bike,
  grab: Car,
  taxi: Car,
  car: Car,
  walk: Footprints,
};

// Helper to determine the primary icon for an option card
function getOptionIcon(opt: RouteOption): LucideIcon {
  const isCar =
    opt.title.toLowerCase().includes('grab') ||
    opt.title.toLowerCase().includes('taxi') ||
    opt.title.toLowerCase().includes('car') ||
    opt.steps?.some((s) => s.mode === 'grab');
  if (isCar) return Car;

  const isP2P =
    opt.title.toLowerCase().includes('p2p') ||
    opt.steps?.some((s) => s.mode === 'p2p_bus');
  if (isP2P) return Bus;

  const isTrain = opt.steps?.some((s) => s.mode === 'mrt' || s.mode === 'lrt' || s.mode === 'pnr');
  if (isTrain) return Train;

  const isTrike = opt.steps?.some((s) => s.mode === 'tricycle');
  if (isTrike) return Bike;

  return Bus;
}

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
  const [showDirections, setShowDirections] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active option logic
  const options = route.options && route.options.length > 0 ? route.options : null;
  const activeOption = options ? options[selectedOptionIdx] || options[0] : null;
  const activeSteps = useMemo(() => {
    return activeOption ? activeOption.steps : route.steps;
  }, [activeOption, route.steps]);

  const totalFare = useMemo(() => {
    if (activeOption?.total_fare_php !== undefined && activeOption.total_fare_php !== null) {
      return activeOption.total_fare_php;
    }
    return activeSteps.reduce(
      (sum, step) => sum + (step.fare_estimate_php || 0),
      0
    );
  }, [activeOption, activeSteps]);

  const totalDuration = useMemo(() => {
    if (activeOption?.total_duration_min !== undefined && activeOption.total_duration_min !== null) {
      return activeOption.total_duration_min;
    }
    return activeSteps.reduce(
      (sum, step) => sum + (step.estimated_duration_min || 0),
      0
    );
  }, [activeOption, activeSteps]);

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
      `EST. TIME: ~${totalDuration} MINS | TOTAL FARE: PHP ${totalFare.toFixed(2)} (${activeSteps.length} legs)\n\n` +
      activeSteps
        .map(
          (s, i) =>
            `${i + 1}. [${s.mode.toUpperCase()}] ${s.instruction} (~${s.estimated_duration_min || 15}m | Stop: ${s.landmark} | ₱${(s.fare_estimate_php || 0).toFixed(2)})`
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
    <div className="w-full max-w-xl mx-auto space-y-3.5 sm:space-y-4">
      {/* ========================================================
          1. SCANNABLE ROUTE-OPTION COMPARISON (LEGS · TIME · FARE)
          ======================================================== */}
      {options && options.length > 1 && (
        <div className="w-full">
          <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
            <span className="text-[11px] font-utility text-slate-600 flex items-center gap-1">
              <span className="font-bold text-slate-900">Ruta:</span>
              <strong className="text-slate-800 font-semibold">{activeOption?.title}</strong>
            </span>
            <button
              onClick={() => setShowAlternativeRoutes(!showAlternativeRoutes)}
              type="button"
              className="bg-white border border-slate-300 hover:border-slate-800 text-slate-800 font-utility text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all hover:bg-slate-50"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>{showAlternativeRoutes ? 'Itago ang ibang ruta' : `Tingnan ang ${options.length - 1} pang ruta`}</span>
              {showAlternativeRoutes ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
            </button>
          </div>

          {/* Scannable Option Comparison Cards */}
          {showAlternativeRoutes && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5 pt-2 border-t border-slate-200">
              {options.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const OptIcon = getOptionIcon(opt);
                const isRideHailing =
                  opt.title.toLowerCase().includes('grab') ||
                  opt.title.toLowerCase().includes('taxi') ||
                  opt.title.toLowerCase().includes('car');
                const isP2P =
                  opt.title.toLowerCase().includes('p2p') ||
                  opt.steps?.some((s) => s.mode === 'p2p_bus');

                const optDuration = opt.total_duration_min || opt.steps?.reduce((sum, s) => sum + (s.estimated_duration_min || 15), 0) || 45;

                return (
                  <button
                    key={opt.option_id || idx}
                    onClick={() => {
                      setSelectedOptionIdx(idx);
                      setShowAlternativeRoutes(false);
                    }}
                    type="button"
                    className={`
                      p-2.5 rounded-lg text-left transition-all cursor-pointer border flex flex-col justify-between
                      ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : isP2P
                          ? 'bg-indigo-950 text-indigo-100 border-indigo-900 hover:border-indigo-700'
                          : isRideHailing
                          ? 'bg-slate-100/90 text-slate-800 border-slate-300 hover:border-slate-800'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                      }
                    `}
                  >
                    {/* Top Row: Icon + Title */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <OptIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-amber-400' : isP2P ? 'text-indigo-300' : 'text-slate-600'}`} />
                        <span className="font-utility font-bold text-xs leading-tight line-clamp-1">
                          {opt.title}
                        </span>
                      </div>
                      {opt.badge && (
                        <span
                          className={`inline-block text-[9px] font-utility px-1.5 py-0.2 rounded font-medium ${
                            isSelected ? 'bg-slate-800 text-slate-200' : isP2P ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: 3 Axes of Comparison (Legs · Time · Fare) */}
                    <div className="mt-2 pt-1 border-t border-slate-200/50 text-[11px] font-utility flex items-center justify-between gap-1 flex-wrap">
                      <span className={`font-bold ${isSelected ? 'text-slate-200' : isP2P ? 'text-indigo-200' : 'text-slate-800'}`}>
                        {opt.steps?.length} legs · ~{optDuration}m
                      </span>
                      {opt.total_fare_php !== undefined && (
                        <span className={`font-bold ${isSelected ? 'text-amber-400' : isP2P ? 'text-amber-400' : 'text-slate-900'}`}>
                          ₱{opt.total_fare_php.toFixed(0)}
                        </span>
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
          2. THE HERO OBJECT: TRANSIT PASS TICKET
          ======================================================== */}
      <div className="transit-pass flex flex-col sm:flex-row bg-white">
        {/* MAIN BODY (Left ~75%) */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between bg-white">
          {/* Header: Title + Offline Flag / Validator Stamp */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-utility font-semibold tracking-widest text-slate-400 uppercase">
                  REPUBLIC OF THE PHILIPPINES
                </span>
                {route.is_offline_cached && (
                  <span className="text-[9px] font-utility font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-0.5">
                    <WifiOff className="w-2.5 h-2.5" />
                    <span>Offline</span>
                  </span>
                )}
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl tracking-tight text-slate-900 uppercase leading-none mt-0.5">
                PARA PO! COMMUTE PASS
              </h2>
            </div>

            {/* Validator Stamp */}
            <div className="validator-stamp">
              <div>VALIDATED</div>
              <div className="text-[9px] font-normal">{formattedStampDate} {formattedStampTime}</div>
            </div>
          </div>

          {/* Journey Section (Display font for Origin & Destination) */}
          <div className="py-3 my-1.5 border-y border-dashed border-slate-200">
            <div className="space-y-2.5">
              {/* Origin */}
              <div>
                <span className="text-[9px] font-utility font-semibold text-slate-400 uppercase tracking-widest block">
                  ORIGIN
                </span>
                <div className="font-display font-black text-lg sm:text-xl text-slate-900 leading-tight uppercase">
                  {route.origin}
                </div>
              </div>

              {/* Connecting Journey Line with Vehicle Icon */}
              <div className="flex items-center gap-2 text-slate-600 my-0.5">
                <div className="p-1 rounded-full bg-slate-100 border border-slate-300 flex-shrink-0">
                  <PrimaryVehicleIcon className="w-3.5 h-3.5 text-slate-700" />
                </div>
                <div className="h-0.5 flex-1 bg-slate-200" />
                <span className="font-utility text-[10px] text-slate-400 uppercase font-semibold">
                  TO DESTINATION
                </span>
                <div className="h-0.5 w-4 bg-slate-200" />
              </div>

              {/* Destination */}
              <div>
                <span className="text-[9px] font-utility font-semibold text-slate-400 uppercase tracking-widest block">
                  DESTINATION
                </span>
                <div className="font-display font-black text-lg sm:text-xl text-slate-900 leading-tight uppercase">
                  {route.destination}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Bar: Real Generated Barcode + Ticket Serial */}
          <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[9px] font-utility tracking-widest text-slate-400 uppercase font-semibold">
                TICKET NO.
              </div>
              <div className="font-utility font-bold text-xs text-slate-800">
                PASS #{ticketSerial}
              </div>
            </div>

            {/* Real Genuine Scannable Code128 Barcode */}
            <div className="flex flex-col items-end">
              <RealBarcode value={ticketSerial} className="w-24 h-5 text-slate-800" />
              <span className="text-[8px] font-utility text-slate-400 uppercase tracking-widest mt-0.5 font-semibold">
                SINGLE RIDE ONLY
              </span>
            </div>
          </div>
        </div>

        {/* TEAR-OFF STUB (Right ~25% - TOTAL FARE & ESTIMATED TRAVEL TIME) */}
        <div className="w-full sm:w-44 bg-slate-50 p-4 sm:p-5 flex flex-col justify-between items-center text-center border-t sm:border-t-0 sm:border-l border-dashed border-slate-300 relative shrink-0">
          <div className="pt-1 w-full">
            <span className="text-[9px] font-utility tracking-widest text-slate-400 uppercase font-semibold">
              TOTAL FARE
            </span>
            {/* The single hero orange accent number in Archivo Black */}
            <div className="font-display font-black text-3xl sm:text-4xl text-amber-700 tracking-tight leading-none mt-1">
              ₱{totalFare.toFixed(0)}
            </div>

            {/* Prominent Estimated Travel Time on Stub */}
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-center gap-1 text-slate-800 font-utility font-bold text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>~{totalDuration} MINS</span>
            </div>

            <span className="text-[10px] font-utility text-slate-500 font-medium mt-0.5 block">
              {activeSteps.length} {activeSteps.length === 1 ? 'transit leg' : 'transit legs'}
            </span>
          </div>

          {/* Stub Serial */}
          <div className="pt-2 border-t border-slate-200 w-full mt-3 sm:mt-0">
            <div className="font-utility text-[9px] text-slate-500 uppercase font-medium">
              STUB #{ticketSerial}
            </div>
            <div className="text-[8px] font-utility text-slate-400 uppercase font-semibold mt-0.5">
              VERIFIED PASS
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. FOLDED STEPS & TIP SECTION (Consolidated Header)
          ======================================================== */}
      <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        {/* Consolidated Section Header */}
        <button
          onClick={() => setShowDirections(!showDirections)}
          type="button"
          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <ListOrdered className="w-4 h-4 text-slate-700" />
            <span className="font-display text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase">
              Mga Hakbang sa Byahe
            </span>
            <span className="text-[11px] font-utility bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-300">
              {activeSteps.length} {activeSteps.length === 1 ? 'leg' : 'legs'} · ~{totalDuration}m
            </span>
            {bestTip && (
              <span className="text-[10px] font-utility text-amber-900 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-600" />
                <span>Tip</span>
              </span>
            )}
          </div>
          <div className="bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1 rounded-md text-slate-800 font-utility text-[11px] font-bold flex items-center gap-1.5 transition-colors">
            <span>{showDirections ? 'Itago' : 'Tingnan'}</span>
            {showDirections ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
            )}
          </div>
        </button>

        {/* Collapsible Step List Content with Folded Tip & Durations */}
        {showDirections && (
          <div className="p-3.5 sm:p-4 pt-0 border-t border-slate-100 space-y-2.5">
            {/* Integrated Reminder Note */}
            {bestTip && (
              <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-utility text-slate-600 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="text-slate-800 font-semibold">Paalala: </strong>
                  {bestTip}
                </p>
              </div>
            )}

            {/* Connecting Step Timeline */}
            <div className="pt-2 pl-0.5">
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
          4. ACTION CONTROLS
          ======================================================== */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <button
          onClick={handleCopy}
          type="button"
          className="btn-transit-secondary"
          title="Kopyahin ang buong ruta"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-slate-900" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copied ? 'Kopyado Na!' : 'Kopyahin'}</span>
        </button>

        {onConfirm && (
          <button
            onClick={onConfirm}
            type="button"
            className="btn-transit-secondary"
          >
            <Star className="w-3.5 h-3.5 text-slate-500" />
            <span>Tama 'to!</span>
          </button>
        )}

        {onSave && (
          <button
            onClick={onSave}
            type="button"
            className="btn-transit-secondary font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>I-Save</span>
          </button>
        )}

        {onClear && (
          <button
            onClick={onClear}
            type="button"
            className="btn-transit-secondary"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>Bagong Byahe</span>
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            type="button"
            className="px-2.5 py-1 rounded-md border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-utility font-medium transition-all inline-flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Burahin</span>
          </button>
        )}
      </div>
    </div>
  );
}
