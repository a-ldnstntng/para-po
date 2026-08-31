import { useState, useMemo } from 'react';
import { Search, ChevronRight, Star, Calendar } from 'lucide-react';
import type { SavedRoute } from '../lib/api';
import Ticket from './Ticket';

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
      <div className="flex justify-center py-10">
        <div className="spinner-ring !w-7 !h-7 !border-2" />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-8 transit-panel p-6">
        <p className="font-utility text-xs sm:text-sm text-slate-500 font-medium">
          Wala pang saved trips.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 w-full">
      {/* Terminal Dispatch Header */}
      <div className="transit-panel p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-l-4 border-amber-600">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl tracking-wide uppercase text-slate-900 leading-none">
            Saved Trips Archive
          </h2>
          <p className="text-xs font-utility text-amber-700 uppercase mt-1 font-semibold">
            [{routes.length} {routes.length === 1 ? 'trip' : 'trips'} saved]
          </p>
        </div>

        {/* Search Box with Lucide Search Icon */}
        <div className="w-full sm:w-auto relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination or stop..."
            className="w-full sm:w-64 bg-slate-50 text-slate-900 font-body text-xs rounded-lg border border-slate-300 pl-8 pr-3 py-2 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Filter Notice */}
      {searchQuery && (
        <div className="text-xs font-utility text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 font-medium">
          Showing: {filteredRoutes.length} of {routes.length} trips for "{searchQuery}"
        </div>
      )}

      {/* Route Cards */}
      <div className="space-y-2.5">
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
                className="transit-panel p-4 cursor-pointer hover:border-amber-500 hover:bg-slate-50/80 transition-all shadow-sm group border-l-2 border-l-slate-300 hover:border-l-amber-600"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    {/* Origin ➔ Destination */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-base sm:text-lg text-slate-800 uppercase">
                        {route.origin}
                      </span>
                      <span className="font-utility text-xs text-amber-600">➔</span>
                      <span className="font-display font-black text-lg sm:text-xl text-amber-700 uppercase tracking-wide">
                        {route.destination}
                      </span>
                    </div>

                    {/* Raw text */}
                    <p className="text-xs font-utility text-slate-600 mt-1 line-clamp-1">
                      "{route.raw_text}"
                    </p>

                    {/* Metadata strip */}
                    <div className="flex items-center gap-3 text-[11px] font-utility text-slate-500 mt-2 font-medium">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {route.steps.length} {route.steps.length === 1 ? 'step' : 'steps'}
                      </span>
                      {route.confirms > 0 && (
                        <span className="text-amber-700 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{route.confirms}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(route.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Expand badge */}
                  <div className="flex items-center gap-1 text-amber-700 text-xs font-utility group-hover:translate-x-0.5 transition-transform font-bold">
                    <span>View Pass</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
