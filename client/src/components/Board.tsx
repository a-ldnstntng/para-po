interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
}

export default function Board({ onSelectRouteTag }: BoardProps) {
  const ROUTE_TAGS = ['CUBAO', 'ANTIPOLO', 'FAIRVIEW', 'BACLARAN', 'PITX', 'SM NORTH', 'EDSA', 'TAFT', 'QUIAPO', 'DIVISORIA'];

  return (
    <header className="w-full flex flex-col items-center pt-6 pb-2">
      {/* Framed Header Box */}
      <div className="w-full max-w-xl mx-auto bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-6 text-center shadow-[4px_4px_0px_rgba(15,23,42,0.1)] relative">
        {/* Top Accent Stripe */}
        <div className="flex h-1.5 w-full bg-amber-500 rounded-full mb-3" />

        {/* Wordmark in Midnight Charcoal */}
        <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-wider text-slate-900 leading-none select-none">
          PARA PO!
        </h1>
        
        {/* Dual Border Subtitle Line */}
        <div className="mt-2.5 pt-2 border-t border-slate-300 flex items-center justify-center gap-3">
          <div className="h-0.5 w-8 bg-amber-600" />
          <p className="font-utility text-xs sm:text-sm font-bold tracking-widest text-amber-800 uppercase">
            NCR • PUV COMMUTE
          </p>
          <div className="h-0.5 w-8 bg-amber-600" />
        </div>
      </div>

      {/* Structured Route Tag Chips */}
      <div className="w-full max-w-xl mx-auto mt-4 flex justify-center gap-1.5 sm:gap-2 flex-wrap px-1">
        {ROUTE_TAGS.map((label) => (
          <button
            key={label}
            onClick={() => onSelectRouteTag?.(label)}
            type="button"
            className="font-display text-xs sm:text-sm font-bold tracking-wide px-3 py-1 rounded bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-800 border-1.5 border-slate-900 transition-all cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,0.08)] active:translate-x-0.5 active:translate-y-0.5"
            title={`Filter or search routes for ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
