import Signboard from './Signboard';

interface BoardProps {
  onSelectRouteTag?: (tag: string) => void;
}

export default function Board({ onSelectRouteTag }: BoardProps) {
  const ROUTE_TAGS = ['CUBAO', 'ANTIPOLO', 'FAIRVIEW', 'BACLARAN', 'PITX', 'SM NORTH', 'EDSA', 'TAFT'];

  return (
    <header className="py-6 w-full">
      <Signboard variant="blue">
        <div className="text-center py-2">
          {/* Top Jeepney Racing Stripes */}
          <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-4 opacity-90">
            <div className="w-1/3 bg-[#FFD700]" />
            <div className="w-1/3 bg-[#E63946]" />
            <div className="w-1/3 bg-[#0056D2]" />
          </div>

          {/* Chrome stripe top */}
          <div className="chrome-stripe !my-2" />
          
          {/* Main title */}
          <h1 className="signboard-text neon-flicker text-5xl sm:text-6xl md:text-7xl font-black tracking-wider">
            PARA PO!
          </h1>
          
          {/* Subtitle */}
          <p className="mt-2 text-[#F3F4F6] font-body text-xs sm:text-sm tracking-widest uppercase opacity-90 font-medium">
            🚍 Philippine Transit Route Extractor
          </p>
          
          {/* Chrome stripe bottom */}
          <div className="chrome-stripe !my-2" />
          
          {/* Decorative route labels */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 flex-wrap">
            {ROUTE_TAGS.map((label) => (
              <button
                key={label}
                onClick={() => onSelectRouteTag?.(label)}
                type="button"
                className="line-label text-xs hover:scale-105 hover:border-yellow-400 transition-all cursor-pointer"
                title={`Filter or search routes for ${label}`}
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
