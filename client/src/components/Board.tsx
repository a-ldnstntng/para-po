interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
}

export default function Board({ onSelectRouteTag }: BoardProps) {
  const ROUTE_TAGS = ['CUBAO', 'ANTIPOLO', 'FAIRVIEW', 'BACLARAN', 'PITX', 'SM NORTH', 'EDSA', 'TAFT', 'QUIAPO', 'DIVISORIA'];

  return (
    <header className="py-4 w-full">
      {/* ========================================================
          PHILIPPINE PUV LICENSE PLATE
          ======================================================== */}
      <div className="license-plate max-w-2xl mx-auto px-6 py-4 sm:py-5 text-center">
        {/* 4 Mounting Bolt Holes */}
        <div className="plate-bolt plate-bolt-tl" />
        <div className="plate-bolt plate-bolt-tr" />
        <div className="plate-bolt plate-bolt-bl" />
        <div className="plate-bolt plate-bolt-br" />

        {/* Top Header: PILIPINAS + Flag Colors */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="flex h-2 w-12 rounded-sm overflow-hidden border border-slate-300">
            <div className="w-1/2 bg-blue-600" />
            <div className="w-1/2 bg-red-600" />
          </div>
          <span className="font-plate tracking-[0.25em] text-xs sm:text-sm font-bold text-slate-800 uppercase">
            PILIPINAS
          </span>
          <div className="flex h-2 w-12 rounded-sm overflow-hidden border border-slate-300">
            <div className="w-1/2 bg-yellow-400" />
            <div className="w-1/2 bg-emerald-600" />
          </div>
        </div>

        {/* Center: EMBOSSED "PARA PO!" PLATE NUMBER */}
        <div className="my-1 sm:my-2 flex items-center justify-center gap-2">
          <h1 className="plate-text-stamped text-6xl sm:text-7xl md:text-8xl font-black select-none tracking-wider">
            PARA PO!
          </h1>
        </div>

        {/* Bottom Strip: PUV Classification & 2026 Registration Seal */}
        <div className="flex items-center justify-between mt-1 px-4 sm:px-8 border-t border-slate-200 pt-1.5">
          <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-600 tracking-widest uppercase">
            NCR • PUBLIC UTILITY COMMUTE
          </span>

          <div className="plate-decal">
            <span>2026</span>
          </div>

          <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-600 tracking-widest uppercase">
            REGION IV-A
          </span>
        </div>
      </div>

      {/* Interactive Destination Chips Below Plate */}
      <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap mt-4">
        {ROUTE_TAGS.map((label) => (
          <button
            key={label}
            onClick={() => onSelectRouteTag?.(label)}
            type="button"
            className="font-plate text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/40 transition-all cursor-pointer shadow-sm"
            title={`Filter or search routes for ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
