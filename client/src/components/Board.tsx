interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
}

export default function Board({ onSelectRouteTag }: BoardProps) {
  const ROUTE_TAGS = ['CUBAO', 'ANTIPOLO', 'FAIRVIEW', 'BACLARAN', 'PITX', 'SM NORTH', 'EDSA', 'TAFT', 'QUIAPO', 'DIVISORIA'];

  return (
    <header className="w-full flex flex-col items-center pt-6 pb-2">
      {/* Wordmark & Subtitle */}
      <div className="text-center">
        <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-wider text-slate-900 leading-none select-none">
          PARA PO!
        </h1>
        <p className="font-utility text-xs sm:text-sm font-bold tracking-widest text-amber-700 uppercase mt-1">
          NCR • PUV COMMUTE
        </p>
      </div>

      {/* Quick Route Tag Chips */}
      <div className="w-full max-w-xl mx-auto mt-4 flex justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
        {ROUTE_TAGS.map((label) => (
          <button
            key={label}
            onClick={() => onSelectRouteTag?.(label)}
            type="button"
            className="font-display text-xs sm:text-sm font-bold tracking-wide px-3 py-1 rounded bg-white hover:bg-amber-600 hover:text-white text-slate-700 border border-slate-300 hover:border-amber-600 transition-all cursor-pointer shadow-xs"
            title={`Filter or search routes for ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
