import { MapPin, Compass, Edit3 } from 'lucide-react';

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
    <header className="w-full flex flex-col items-center pt-4 sm:pt-6 pb-2 text-center">
      {/* Clean Brand Wordmark in Archivo Black */}
      <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 leading-none select-none">
        PARA PO!
      </h1>
      <p className="font-utility text-[11px] sm:text-xs font-medium tracking-widest text-slate-400 uppercase mt-1">
        NCR • PUV COMMUTE
      </p>

      {/* Conditional Suggestions: High-contrast buttons with icons */}
      {!hasActiveResult ? (
        <div className="w-full max-w-lg mx-auto mt-3 sm:mt-4 flex items-center justify-center gap-1.5 flex-wrap px-2">
          <span className="text-[11px] font-utility font-bold text-slate-700 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>Ruta:</span>
          </span>
          {QUICK_CITIES.map((label) => (
            <button
              key={label}
              onClick={() => onSelectRouteTag?.(label)}
              type="button"
              className="bg-white border border-slate-300 hover:border-slate-800 text-slate-800 hover:text-slate-950 font-utility text-[11px] font-medium px-2.5 py-1 rounded-md shadow-2xs transition-all flex items-center gap-1 cursor-pointer hover:bg-slate-50"
            >
              <MapPin className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-2">
          <button
            onClick={onResetSearch}
            type="button"
            className="bg-white border border-slate-300 hover:border-slate-800 text-slate-700 hover:text-slate-900 font-utility text-[11px] font-semibold px-3 py-1 rounded-md shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
          >
            <Edit3 className="w-3 h-3 text-slate-500" />
            <span>Baguhin ang paghahanap</span>
          </button>
        </div>
      )}
    </header>
  );
}
