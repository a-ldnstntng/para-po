interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
}

export default function Board({ onSelectRouteTag }: BoardProps) {
  const ROUTE_TAGS = ['CUBAO', 'ANTIPOLO', 'FAIRVIEW', 'BACLARAN', 'PITX', 'SM NORTH', 'EDSA', 'TAFT', 'QUIAPO', 'DIVISORIA'];

  return (
    <header className="w-full flex flex-col items-center pt-4 pb-2">
      {/* Unified Transit Wordmark */}
      <div className="text-center">
        <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-wider text-emerald-400 leading-none select-none">
          PARA PO!
        </h1>
        <p className="font-utility text-xs sm:text-sm font-semibold tracking-widest text-slate-400 uppercase mt-1">
          NCR • PUV COMMUTE
        </p>
      </div>

      {/* Quick Route Tag Chips */}
      <div className="w-full max-w-xl mx-auto mt-5 flex justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
        {ROUTE_TAGS.map((label) => (
          <button
            key={label}
            onClick={() => onSelectRouteTag?.(label)}
            type="button"
            className="font-display text-xs sm:text-sm font-bold tracking-wide px-3 py-1 rounded-md bg-slate-900/90 hover:bg-emerald-600 hover:text-slate-950 text-slate-300 border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer shadow-sm"
            title={`Filter or search routes for ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
