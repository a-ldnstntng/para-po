interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
}

export default function Board({ onSelectRouteTag }: BoardProps) {
  const ROUTE_TAGS = ['CUBAO', 'ANTIPOLO', 'FAIRVIEW', 'BACLARAN', 'PITX', 'SM NORTH', 'EDSA', 'TAFT', 'QUIAPO', 'DIVISORIA'];

  return (
    <header className="w-full flex flex-col items-center pt-2 pb-2">
      {/* ========================================================
          AUTHENTIC PHILIPPINE PUV LICENSE PLATE
          ======================================================== */}
      <div className="license-plate w-full max-w-lg mx-auto text-center relative shadow-2xl">
        {/* Top 2 Mounting Bolts */}
        <div className="plate-bolt plate-bolt-tl" />
        <div className="plate-bolt plate-bolt-tr" />

        {/* Top Header: PILIPINAS + Flag Crest */}
        <div className="flex items-center justify-center gap-2 mb-1.5 pt-1">
          <div className="flex h-2 w-8 rounded-sm overflow-hidden border border-slate-300">
            <div className="w-1/2 bg-blue-600" />
            <div className="w-1/2 bg-red-600" />
          </div>
          <span className="font-plate tracking-[0.2em] text-xs font-bold text-slate-700 uppercase">
            PILIPINAS
          </span>
          <div className="flex h-2 w-8 rounded-sm overflow-hidden border border-slate-300">
            <div className="w-1/2 bg-yellow-400" />
            <div className="w-1/2 bg-emerald-600" />
          </div>
        </div>

        {/* Center: STAMPED "PARA PO!" PLATE NUMBER */}
        <div className="py-2 flex items-center justify-center">
          <h1 className="plate-text-stamped text-5xl sm:text-6xl md:text-7xl font-black select-none tracking-widest leading-none">
            PARA PO!
          </h1>
        </div>

        {/* Bottom Strip: Classification & 2026 Registration Seal */}
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-200 px-4 sm:px-6">
          <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase">
            NCR • PUV COMMUTE
          </span>

          <div className="plate-decal">
            <span>2026</span>
          </div>

          <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase">
            REGION IV-A
          </span>
        </div>
      </div>

      {/* Destination Tag Chips with Clear Vertical Margin */}
      <div className="w-full max-w-xl mx-auto mt-6 flex justify-center gap-2 flex-wrap px-2">
        {ROUTE_TAGS.map((label) => (
          <button
            key={label}
            onClick={() => onSelectRouteTag?.(label)}
            type="button"
            className="font-plate text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
            title={`Filter or search routes for ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
