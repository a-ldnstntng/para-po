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

      {/* Conditional Suggestions: Shown ONLY in empty/pre-search state */}
      {!hasActiveResult ? (
        <div className="w-full max-w-lg mx-auto mt-3 sm:mt-4 flex items-center justify-center gap-1.5 flex-wrap px-2">
          <span className="text-[10px] font-utility text-slate-400 mr-1">Ruta:</span>
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
      ) : (
        <div className="mt-2">
          <button
            onClick={onResetSearch}
            type="button"
            className="text-[11px] font-utility text-slate-400 hover:text-slate-700 underline transition-colors cursor-pointer"
          >
            Baguhin ang paghahanap
          </button>
        </div>
      )}
    </header>
  );
}
