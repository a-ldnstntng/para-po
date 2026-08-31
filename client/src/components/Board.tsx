import Signboard from './Signboard';

interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
}

export default function Board({ onSelectRouteTag }: BoardProps) {
  const ROUTE_TAGS = ['CUBAO', 'ANTIPOLO', 'FAIRVIEW', 'BACLARAN', 'PITX', 'SM NORTH', 'EDSA', 'TAFT', 'QUIAPO', 'DIVISORIA'];

  return (
    <header className="py-4 w-full">
      <Signboard variant="blue">
        <div className="text-center">
          {/* Top Tri-Color Manila Accent Ribbon */}
          <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-3 opacity-90">
            <div className="w-1/3 bg-amber-400" />
            <div className="w-1/3 bg-rose-500" />
            <div className="w-1/3 bg-blue-300" />
          </div>

          {/* Main Title */}
          <h1 className="signboard-title text-5xl sm:text-6xl md:text-7xl font-black tracking-wider leading-none py-1 select-none">
            PARA PO!
          </h1>
          
          {/* Subtitle */}
          <p className="mt-1 text-blue-100 font-body text-xs sm:text-sm tracking-widest uppercase font-semibold opacity-90">
            🚍 Philippine Transit Route Extractor
          </p>

          {/* Divider */}
          <div className="border-t border-blue-400/30 my-3.5" />

          {/* Quick Route Tag Pills */}
          <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
            {ROUTE_TAGS.map((label) => (
              <button
                key={label}
                onClick={() => onSelectRouteTag?.(label)}
                type="button"
                className="font-display text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-blue-900/60 hover:bg-amber-400 hover:text-slate-900 text-amber-300 border border-blue-400/30 hover:border-amber-400 transition-all cursor-pointer shadow-sm"
                title={`Filter routes for ${label}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Signboard>
    </header>
  );
}
