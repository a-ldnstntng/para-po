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
  Navigation,
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
      `PARA PO! PASS #${ticketSerial}\n` +
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
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* ========================================================
          1. iOS ROUTE-OPTION SELECTOR (Pills & Segmented Cards)
          ======================================================== */}
      {options && options.length > 1 && (
        <div className="w-full">
          <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-body font-semibold text-slate-500">
              <span className="text-slate-900 font-bold">Ruta:</span>
              <span className="text-slate-800">{activeOption?.title}</span>
            </div>
            <button
              onClick={() => setShowAlternativeRoutes(!showAlternativeRoutes)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-body text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>{showAlternativeRoutes ? 'Itago ang mga ruta' : `Tingnan ang ${options.length - 1} pang ruta`}</span>
              {showAlternativeRoutes ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>
          </div>

          {/* Scannable Option Cards (iOS Banking Style) */}
          {showAlternativeRoutes && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2 pt-2">
              {options.map((opt, idx) => {
                const isSelected = selectedOptionIdx === idx;
                const OptIcon = getOptionIcon(opt);
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
                      p-3.5 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between
                      ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 ring-2 ring-orange-500'
                          : 'bg-white text-slate-800 border border-slate-100 hover:border-slate-300 shadow-xs hover:bg-slate-50'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-slate-800 text-orange-400' : 'bg-slate-100 text-slate-600'}`}>
                          <OptIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-display font-bold text-xs leading-tight line-clamp-1">
                          {opt.title}
                        </span>
                      </div>
                      {opt.badge && (
                        <span
                          className={`inline-block text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100/30 text-xs font-body flex items-center justify-between gap-1">
                      <span className={isSelected ? 'text-slate-300 font-medium' : 'text-slate-500'}>
                        {opt.steps?.length} legs · ~{optDuration}m
                      </span>
                      {opt.total_fare_php !== undefined && (
                        <span className={`font-bold ${isSelected ? 'text-orange-400' : 'text-slate-900'}`}>
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
          2. THE HERO OBJECT: SLEEK NEON-ACCENTED TRANSIT PASS
          ======================================================== */}
      <div className="transit-pass flex flex-col sm:flex-row bg-white">
        {/* MAIN BODY */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between bg-white">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-wider">
                  COMMUTER PASS
                </span>
                {route.is_offline_cached && (
                  <span className="text-[9px] font-body font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <WifiOff className="w-2.5 h-2.5" />
                    <span>Offline</span>
                  </span>
                )}
              </div>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 mt-0.5">
                PARA PO! PASS
              </h3>
            </div>

            {/* Validator Stamp */}
            <div className="validator-stamp">
              <div>VALIDATED</div>
              <div className="text-[9px] font-normal">{formattedStampDate} {formattedStampTime}</div>
            </div>
          </div>

          {/* Journey Section (Modern Origin -> Destination) */}
          <div className="py-4 my-1">
            <div className="space-y-3">
              {/* Origin */}
              <div>
                <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-wider block">
                  ORIGIN
                </span>
                <div className="font-display font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                  {route.origin}
                </div>
              </div>

              {/* Connecting Journey Line with Vehicle Icon */}
              <div className="flex items-center gap-2.5 text-slate-400 my-1">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-700">
                  <PrimaryVehicleIcon className="w-4 h-4" />
                </div>
                <div className="h-0.5 flex-1 bg-slate-100" />
                <Navigation className="w-3.5 h-3.5 text-orange-500 rotate-90 flex-shrink-0" />
                <div className="h-0.5 w-6 bg-slate-100" />
              </div>

              {/* Destination */}
              <div>
                <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-wider block">
                  DESTINATION
                </span>
                <div className="font-display font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                  {route.destination}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Barcode & Pass Serial */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-body font-semibold text-slate-400 uppercase tracking-wider">
                PASS NUMBER
              </div>
              <div className="font-utility font-bold text-xs text-slate-800">
                #{ticketSerial}
              </div>
            </div>

            {/* Real Code128 Barcode */}
            <div className="flex flex-col items-end">
              <RealBarcode value={ticketSerial} className="w-24 h-5 text-slate-800 opacity-90" />
              <span className="text-[9px] font-body text-slate-400 uppercase tracking-wider mt-0.5 font-medium">
                SINGLE RIDE ONLY
              </span>
            </div>
          </div>
        </div>

        {/* TEAR-OFF STUB (Right Side / Total Fare Metric) */}
        <div className="w-full sm:w-44 bg-slate-50/80 p-5 flex flex-col justify-between items-center text-center border-t sm:border-t-0 sm:border-l border-slate-100 relative shrink-0">
          <div className="pt-2 w-full">
            <span className="text-[10px] font-body font-bold tracking-wider text-slate-400 uppercase">
              TOTAL FARE
            </span>
            {/* The Hero Vibrant Orange Fare */}
            <div className="font-display font-black text-4xl sm:text-5xl text-orange-600 tracking-tight leading-none mt-1">
              ₱{totalFare.toFixed(0)}
            </div>

            {/* Estimated Travel Time */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-center gap-1.5 text-slate-800 font-body font-bold text-xs">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>~{totalDuration} MINS</span>
            </div>

            <span className="text-[11px] font-body text-slate-400 font-medium mt-1 block">
              {activeSteps.length} {activeSteps.length === 1 ? 'transit leg' : 'transit legs'}
            </span>
          </div>

          {/* Stub Serial */}
          <div className="pt-3 border-t border-slate-200/60 w-full mt-4 sm:mt-0">
            <div className="font-utility text-[10px] text-slate-500 uppercase font-semibold">
              STUB #{ticketSerial}
            </div>
            <div className="text-[9px] font-body text-slate-400 uppercase font-medium mt-0.5">
              VERIFIED PASS
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. FOLDED DIRECTIONS (iOS Expandable Section)
          ======================================================== */}
      <div className="ios-card overflow-hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setShowDirections(!showDirections)}
          type="button"
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <ListOrdered className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm sm:text-base text-slate-900 tracking-tight">
              Mga Hakbang sa Byahe
            </span>
            <span className="text-xs font-body font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {activeSteps.length} {activeSteps.length === 1 ? 'leg' : 'legs'} · ~{totalDuration}m
            </span>
            {bestTip && (
              <span className="text-[11px] font-body font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Info className="w-3 h-3 text-orange-500" />
                <span>Tip</span>
              </span>
            )}
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-body font-semibold transition-colors">
            <span>{showDirections ? 'Itago' : 'Tingnan'}</span>
            {showDirections ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        {/* Collapsible Step List Content */}
        {showDirections && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 space-y-3">
            {/* Integrated Reminder Note */}
            {bestTip && (
              <div className="mt-3 bg-orange-50/60 border border-orange-200/70 rounded-2xl p-3 text-xs font-body text-slate-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-orange-950 font-bold">Paalala: </strong>
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
          4. ACTION CONTROLS (iOS Pill Buttons)
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
            className="btn-transit-secondary !bg-slate-900 !text-white hover:!bg-slate-800"
          >
            <Bookmark className="w-3.5 h-3.5 text-orange-400" />
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
            className="px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-body font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Burahin</span>
          </button>
        )}
      </div>
    </div>
  );
}
