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
      <div className="flex justify-center py-8">
        <div className="spinner-ring !w-6 !h-6 !border-slate-300 !border-t-slate-800" />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 font-utility text-xs">
        Wala pang saved trips.
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
        <h2 className="font-display font-bold text-lg sm:text-xl uppercase text-slate-900 leading-none">
          Saved Trips ({routes.length})
        </h2>

        {/* Search Box */}
        <div className="w-full sm:w-auto relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination..."
            className="w-full sm:w-52 bg-white text-slate-900 font-body text-xs rounded-lg border border-slate-300 pl-7 pr-2.5 py-1.5 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Filter Notice */}
      {searchQuery && (
        <div className="text-xs font-utility text-slate-600 bg-slate-100 rounded-lg px-2.5 py-1">
          Showing: {filteredRoutes.length} of {routes.length} trips for "{searchQuery}"
        </div>
      )}

      {/* Route Cards */}
      <div className="space-y-2">
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
                className="bg-white border border-slate-200 rounded-xl p-3.5 cursor-pointer hover:border-slate-400 hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-slate-900 font-display font-bold text-base uppercase truncate">
                      <span>{route.origin}</span>
                      <span className="text-slate-400 font-utility text-xs">➔</span>
                      <span>{route.destination}</span>
                    </div>

                    <p className="text-xs font-body text-slate-500 truncate mt-0.5">
                      "{route.raw_text}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-utility text-slate-400 mt-1.5">
                      <span>{route.steps.length} {route.steps.length === 1 ? 'leg' : 'legs'}</span>
                      {route.confirms > 0 && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Star className="w-3 h-3 fill-current text-slate-500" />
                          <span>{route.confirms}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(route.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 text-xs font-utility flex-shrink-0">
                    <span>Tingnan</span>
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
