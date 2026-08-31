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
        <div className="spinner-ring !w-8 !h-8 !border-3" />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-10 transit-panel p-8">
        <div className="text-3xl mb-2">📋</div>
        <div className="font-display font-bold text-xl text-slate-300 uppercase tracking-wide">
          Wala pang naka-save na ruta sa terminal
        </div>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          I-describe ang iyong byahe sa itaas at i-click ang <span className="text-amber-400 font-semibold">Extract Route</span>!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Terminal Dispatch Header */}
      <Signboard variant="yellow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-wide uppercase text-white leading-none">
              Terminal Dispatch Archive
            </h2>
            <p className="text-xs font-mono font-medium text-amber-100 uppercase mt-1">
              {routes.length} nai-save na ruta sa database
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Mag-search ng ruta o babaan..."
              className="w-full sm:w-64 bg-slate-900/90 text-slate-100 font-body text-xs rounded-lg border border-amber-300/40 p-2 placeholder:text-slate-500 focus:outline-none focus:border-white transition-all"
            />
          </div>
        </div>
      </Signboard>

      {/* Filter notice */}
      {searchQuery && (
        <div className="text-xs font-mono text-amber-400 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
          Ipinapakita: {filteredRoutes.length} ng {routes.length} ruta para sa "{searchQuery}"
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
                className="transit-panel p-4 cursor-pointer hover:border-amber-400/50 hover:bg-slate-800/60 transition-all shadow-md group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    {/* Origin ➔ Destination */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-lg text-slate-200">
                        {route.origin}
                      </span>
                      <span className="font-bold text-amber-500">➔</span>
                      <span className="font-display font-black text-xl text-amber-400">
                        {route.destination}
                      </span>
                    </div>

                    {/* Raw text quote */}
                    <p className="text-xs font-mono text-slate-400 mt-1 line-clamp-1">
                      "{route.raw_text}"
                    </p>

                    {/* Metadata strip */}
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mt-2">
                      <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 text-[11px] font-semibold">
                        {route.steps.length} sakay/lakad
                      </span>
                      {route.confirms > 0 && (
                        <span className="text-emerald-400 font-semibold">
                          ★ {route.confirms} confirm{route.confirms !== 1 ? 's' : ''}
                        </span>
                      )}
                      <span>·</span>
                      <span>
                        {new Date(route.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Expand badge */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-amber-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>Tingnan ang Byahe</span>
                    <span>➔</span>
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
