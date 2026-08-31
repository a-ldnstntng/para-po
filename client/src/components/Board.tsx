interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
}

export default function Board({ onSelectRouteTag }: BoardProps) {
  const QUICK_CITIES = ['Cubao', 'Antipolo', 'SM North', 'Baclaran', 'Fairview', 'PITX', 'Quiapo', 'BGC'];

  return (
    <header className="w-full flex flex-col items-center pt-8 pb-4 text-center">
      {/* Clean Brand Wordmark */}
      <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-wider text-slate-900 leading-none select-none">
        PARA PO!
      </h1>
      <p className="font-utility text-xs font-semibold tracking-widest text-slate-400 uppercase mt-1">
        NCR • PUV COMMUTE
      </p>

      {/* Demoted Single-Row Subtle Suggestion Strip */}
      <div className="w-full max-w-lg mx-auto mt-4 flex items-center justify-center gap-1.5 flex-wrap px-2">
        <span className="text-[11px] font-utility text-slate-400 mr-1">Ruta:</span>
        {QUICK_CITIES.map((label) => (
          <button
            key={label}
            onClick={() => onSelectRouteTag?.(label)}
            type="button"
            className="suggestion-pill"
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
