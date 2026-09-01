import { MapPin, Navigation, RotateCcw } from 'lucide-react';

interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
  hasActiveResult?: boolean;
  onResetSearch?: () => void;
}

export default function Board({
  onSelectRouteTag,
  hasActiveResult = false,
  onResetSearch,
}: BoardProps) {
  const QUICK_CITIES = ['Cubao', 'Antipolo', 'SM North', 'Baclaran', 'Fairview', 'PITX', 'Quiapo', 'BGC'];

  return (
    <header className="w-full flex flex-col items-center pt-2 sm:pt-4 pb-1 text-center">
      {/* Sleek App Wordmark */}
      <div className="flex items-center gap-2 mb-0.5">
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/30">
          <Navigation className="w-4 h-4 fill-white" />
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 leading-none">
          PARA PO!
        </h1>
      </div>
      <p className="font-body text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 uppercase">
        NCR Commute & PUV Transit
      </p>

      {/* Filter-Style Suggestion Pills */}
      {!hasActiveResult ? (
        <div className="w-full max-w-lg mx-auto mt-4 flex items-center justify-center gap-1.5 flex-wrap px-1">
          {QUICK_CITIES.map((label) => (
            <button
              key={label}
              onClick={() => onSelectRouteTag?.(label)}
              type="button"
              className="suggestion-pill"
            >
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-2.5">
          <button
            onClick={onResetSearch}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-body text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Bagong paghahanap</span>
          </button>
        </div>
      )}
    </header>
  );
}
