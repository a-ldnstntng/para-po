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
          {/* Top Tri-Color Solid Jeepney Bands */}
          <div className="flex h-3 w-full border-2 border-black mb-3">
            <div className="w-1/3 bg-[#FFD700]" />
            <div className="w-1/3 bg-[#FF0000]" />
            <div className="w-1/3 bg-[#FFFFFF]" />
          </div>

          {/* Main Destination Logo */}
          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-wider text-[#FFD700] text-stroke-black-lg leading-none py-1 select-none">
            PARA PO!
          </h1>
          
          {/* Subtitle Banner */}
          <div className="inline-block bg-[#000000] border-2 border-[#FFD700] px-4 py-1 mt-2">
            <p className="font-mono text-xs sm:text-sm tracking-widest uppercase font-bold text-[#FFFFFF]">
              PHILIPPINE TRANSIT ROUTE EXTRACTOR
            </p>
          </div>

          {/* Solid divider */}
          <div className="border-t-4 border-black my-4" />

          {/* Hand-painted destination tags */}
          <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
            {ROUTE_TAGS.map((label) => (
              <button
                key={label}
                onClick={() => onSelectRouteTag?.(label)}
                type="button"
                className="font-display text-sm sm:text-base font-black px-2.5 py-0.5 bg-[#FFD700] text-[#000000] border-2 border-[#000000] hover:bg-[#FFFFFF] hover:text-[#000000] transition-none cursor-pointer"
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
