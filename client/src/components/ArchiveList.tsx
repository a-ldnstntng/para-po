import { useState, useMemo } from 'react';
import { Search, ChevronRight, Star, Calendar, Navigation, Eye } from 'lucide-react';
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
      <div className="text-center py-6 text-slate-400 font-body text-xs font-medium">
        Wala pang saved trips.
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {/* Header (iOS Section Header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 px-1">
        <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight">
          Nai-save na Byahe ({routes.length})
        </h2>

        {/* Search Box */}
        <div className="w-full sm:w-auto relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hanapin ang ruta..."
            className="w-full sm:w-48 bg-white text-slate-900 font-body text-xs rounded-full border border-slate-200 pl-8 pr-3 py-1.5 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Filter Notice */}
      {searchQuery && (
        <div className="text-xs font-body text-slate-500 bg-slate-100 rounded-xl px-3 py-1.5">
          Showing {filteredRoutes.length} of {routes.length} trips for "{searchQuery}"
        </div>
      )}

      {/* Route Cards Group (iOS Transaction List Group) */}
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
                className="ios-card p-4 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left Avatar Icon */}
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Navigation className="w-4 h-4" />
                  </div>

                  {/* Center Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-slate-900 font-display font-bold text-sm truncate">
                      <span>{route.origin}</span>
                      <span className="text-slate-400 text-xs">➔</span>
                      <span>{route.destination}</span>
                    </div>

                    <p className="text-xs font-body text-slate-400 truncate mt-0.5">
                      "{route.raw_text}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-body text-slate-400 mt-1">
                      <span className="font-semibold text-slate-600">
                        {route.steps.length} {route.steps.length === 1 ? 'leg' : 'legs'}
                      </span>
                      {route.confirms > 0 && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
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

                  {/* Right Button */}
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-50 group-hover:bg-slate-100 text-slate-700 text-xs font-body font-semibold transition-colors flex-shrink-0">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tingnan</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
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
