import { useState, useMemo } from 'react';
import type { SavedRoute } from '../lib/api';
import Ticket from './Ticket';
import Signboard from './Signboard';

interface ArchiveListProps {
  routes: SavedRoute[];
  isLoading: boolean;
  onConfirm: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ArchiveList({ routes, isLoading, onConfirm, onDelete }: ArchiveListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return routes;
    const query = searchQuery.toLowerCase();
    return routes.filter(
      (r) =>
        r.origin.toLowerCase().includes(query) ||
        r.destination.toLowerCase().includes(query) ||
        r.raw_text.toLowerCase().includes(query) ||
        r.steps.some(
          (s) =>
            s.instruction.toLowerCase().includes(query) ||
            s.landmark.toLowerCase().includes(query) ||
            (s.line_label && s.line_label.toLowerCase().includes(query))
        )
    );
  }, [routes, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loading-square !w-10 !h-10 !border-4 !border-white !border-t-yellow-400" />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-12 bg-[#111111] border-4 border-[#333333] p-8">
        <div className="font-display font-black text-3xl text-[#FFD700] uppercase tracking-wider mb-1">
          WALA PANG NAKA-SAVE NA RUTA SA TERMINAL
        </div>
        <p className="text-[#AAAAAA] font-mono text-sm">
          Mag-type ng byahe sa itaas at i-click ang <span className="text-[#FF0000] font-bold">EXTRACT ROUTE</span> para magsimula!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Terminal Dispatch Header Plaque */}
      <Signboard variant="yellow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-wider uppercase text-[#000000] leading-none">
              TERMINAL DISPATCH ARCHIVE
            </h2>
            <p className="text-xs font-mono font-bold text-[#000000] uppercase mt-1">
              [{routes.length} NAI-SAVE NA RUTA SA DATABASE]
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="MAG-SEARCH NG DESTINATION / STOP..."
              className="w-full sm:w-72 bg-[#000000] text-[#FFFFFF] font-mono text-xs font-bold border-3 border-[#000000] p-2 placeholder:text-[#888888] focus:outline-none focus:bg-[#111111]"
            />
          </div>
        </div>
      </Signboard>

      {/* Filter notice */}
      {searchQuery && (
        <div className="font-mono text-xs text-[#FFD700] bg-[#111111] border-2 border-[#FFD700] px-3 py-1">
          IPINAPAKITA: {filteredRoutes.length} ng {routes.length} ruta para sa "{searchQuery.toUpperCase()}"
        </div>
      )}

      {/* Route Cards */}
      <div className="space-y-3">
        {filteredRoutes.map((route) => (
          <div key={route.id}>
            {expandedId === route.id ? (
              <div>
                <Ticket
                  route={route}
                  isSaved
                  onConfirm={() => onConfirm(route.id)}
                  onDelete={() => onDelete(route.id)}
                  onClear={() => setExpandedId(null)}
                />
              </div>
            ) : (
              <div
                onClick={() => setExpandedId(route.id)}
                className="bg-[#111111] border-3 border-[#FFFFFF] hover:border-[#FFD700] hover:bg-[#1A1A1A] p-4 cursor-pointer shadow-[4px_4px_0px_#FF0000] transition-none"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    {/* Origin ➔ Destination */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-xl text-[#FFFFFF]">
                        {route.origin.toUpperCase()}
                      </span>
                      <span className="font-mono font-bold text-lg text-[#FF0000]">➔</span>
                      <span className="font-display font-black text-2xl text-[#FFD700] tracking-wider">
                        {route.destination.toUpperCase()}
                      </span>
                    </div>

                    {/* Raw commute text */}
                    <p className="text-xs font-mono text-[#CCCCCC] mt-1 line-clamp-1">
                      "{route.raw_text}"
                    </p>

                    {/* Metadata strip */}
                    <div className="flex items-center gap-3 text-xs font-mono text-[#AAAAAA] mt-2">
                      <span className="bg-[#0000FF] text-white px-2 py-0.5 font-bold">
                        {route.steps.length} SAKAY/LAKAD
                      </span>
                      {route.confirms > 0 && (
                        <span className="bg-[#00E676] text-black px-2 py-0.5 font-bold">
                          ★ {route.confirms} CONFIRM{route.confirms !== 1 ? 'S' : ''}
                        </span>
                      )}
                      <span>
                        PETSA: {new Date(route.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Expand button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="brutalist-btn brutalist-btn-yellow text-xs py-1 px-3 pointer-events-none">
                      BUKSAN ➔
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
