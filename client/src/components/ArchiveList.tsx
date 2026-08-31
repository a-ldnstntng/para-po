import { useState, useMemo } from 'react';
import { Search, ChevronRight, Star, Calendar, Eye } from 'lucide-react';
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
      <div className="flex justify-center py-6">
        <div className="spinner-ring !w-5 !h-5 !border-slate-300 !border-t-slate-800" />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-4 text-slate-400 font-utility text-[11px]">
        Wala pang saved trips.
      </div>
    );
  }

  return (
    <div className="space-y-2.5 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <h2 className="font-display font-black text-base sm:text-lg uppercase text-slate-900 leading-none">
          Saved Trips ({routes.length})
        </h2>

        {/* Search Box */}
        <div className="w-full sm:w-auto relative">
          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destination..."
            className="w-full sm:w-48 bg-white text-slate-900 font-utility text-[11px] rounded-lg border border-slate-300 pl-7 pr-2.5 py-1.5 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Filter Notice */}
      {searchQuery && (
        <div className="text-[11px] font-utility text-slate-600 bg-slate-100 rounded-lg px-2.5 py-1">
          Showing: {filteredRoutes.length} of {routes.length} trips for "{searchQuery}"
        </div>
      )}

      {/* Route Cards */}
      <div className="space-y-1.5">
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
                className="bg-white border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-slate-400 hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-slate-900 font-display font-black text-sm uppercase truncate">
                      <span>{route.origin}</span>
                      <span className="text-slate-400 font-utility text-xs">➔</span>
                      <span>{route.destination}</span>
                    </div>

                    <p className="text-[11px] font-utility text-slate-500 truncate mt-0.5">
                      "{route.raw_text}"
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-utility text-slate-400 mt-1">
                      <span className="font-bold text-slate-700">
                        {route.steps.length} {route.steps.length === 1 ? 'leg' : 'legs'}
                      </span>
                      {route.confirms > 0 && (
                        <span className="flex items-center gap-1 text-slate-700">
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

                  <div className="bg-slate-100 group-hover:bg-slate-200 border border-slate-300 px-2.5 py-1 rounded-md text-slate-800 text-[11px] font-utility font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors shadow-2xs">
                    <Eye className="w-3 h-3 text-slate-600" />
                    <span>Tingnan</span>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
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
