import { useState, useMemo } from 'react';
import { Search, Star, Calendar, Navigation, RotateCcw, Clock, Eye } from 'lucide-react';
import type { SavedRoute } from '../lib/api';
import Ticket from './Ticket';

interface ByaheKoTabProps {
  routes: SavedRoute[];
  isLoading: boolean;
  favoriteRouteIds: string[];
  onToggleFavorite: (id: string) => void;
  onConfirm: (id: string) => void;
  onDelete: (id: string) => void;
  onSakayUlit: (route: SavedRoute) => void;
  onGoToSearch: () => void;
}

export default function ByaheKoTab({
  routes,
  isLoading,
  favoriteRouteIds,
  onToggleFavorite,
  onConfirm,
  onDelete,
  onSakayUlit,
  onGoToSearch,
}: ByaheKoTabProps) {
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

  const favorites = useMemo(() => {
    return filteredRoutes.filter((r) => favoriteRouteIds.includes(r.id));
  }, [filteredRoutes, favoriteRouteIds]);

  const otherRoutes = useMemo(() => {
    return filteredRoutes.filter((r) => !favoriteRouteIds.includes(r.id));
  }, [filteredRoutes, favoriteRouteIds]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner-ring !w-6 !h-6 !border-slate-300 !border-t-slate-800" />
      </div>
    );
  }

  // Empty State
  if (routes.length === 0) {
    return (
      <div className="w-full max-w-xl lg:max-w-2xl mx-auto text-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-xs">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            Wala pang nai-save na byahe
          </h3>
          <p className="font-body text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            I-save ang madalas mong ruta para mabilis buksan kahit walang signal o data.
          </p>
        </div>
        <button
          onClick={onGoToSearch}
          type="button"
          className="btn-sakay-primary !text-xs !py-2 !px-5"
        >
          Mag-search ng Byahe
        </button>
      </div>
    );
  }

  const renderRouteCard = (route: SavedRoute) => {
    const isFav = favoriteRouteIds.includes(route.id);
    const isExpanded = expandedId === route.id;

    if (isExpanded) {
      return (
        <div key={route.id} className="pt-2">
          <Ticket
            route={route}
            isSaved
            onConfirm={() => onConfirm(route.id)}
            onDelete={() => onDelete(route.id)}
            onClear={() => setExpandedId(null)}
          />
        </div>
      );
    }

    return (
      <div
        key={route.id}
        className="ios-card p-4 hover:border-slate-300 hover:shadow-sm transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left Avatar Icon */}
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Navigation className="w-4 h-4" />
          </div>

          {/* Center Details */}
          <div className="flex-1 min-w-0" onClick={() => setExpandedId(route.id)}>
            <div className="flex items-center gap-1.5 text-slate-900 font-display font-bold text-sm truncate">
              <span>{route.origin}</span>
              <span className="text-slate-400 text-xs">➔</span>
              <span>{route.destination}</span>
            </div>

            <p className="text-xs font-body text-slate-400 truncate mt-0.5">
              "{route.raw_text}"
            </p>

            <div className="flex items-center gap-3 text-[11px] font-body text-slate-400 mt-1 flex-wrap">
              <span className="font-semibold text-slate-600">
                {route.steps.length} {route.steps.length === 1 ? 'sakay' : 'sakay / transfer'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(route.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                </span>
              </span>
            </div>
          </div>

          {/* Favorite & Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Toggle Favorite */}
            <button
              onClick={() => onToggleFavorite(route.id)}
              type="button"
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isFav ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-500'
              }`}
              title={isFav ? 'Alisin sa paborito' : 'I-mark bilang paborito'}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Quick "Sakay Ulit" Action Button */}
            <button
              onClick={() => onSakayUlit(route)}
              type="button"
              className="bg-orange-500 hover:bg-orange-600 text-white font-display text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
              title="I-search ulit ang rutang ito"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sakay ulit</span>
            </button>

            {/* Expand details */}
            <button
              onClick={() => setExpandedId(route.id)}
              type="button"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              title="Tingnan ang detalye"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl lg:max-w-5xl xl:max-w-6xl mx-auto space-y-4 pt-2">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900 tracking-tight">
            Byahe Ko ({routes.length})
          </h2>
          <p className="font-body text-xs text-slate-400 mt-0.5">
            Iyong mga paborito at nakaraang na-save na commute routes
          </p>
        </div>

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

      {/* 1. FAVORITES SECTION */}
      {favorites.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-display font-bold text-slate-800 uppercase tracking-wider px-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>Paboritong Araw-araw ({favorites.length})</span>
          </div>
          <div className="space-y-2">
            {favorites.map(renderRouteCard)}
          </div>
        </div>
      )}

      {/* 2. RECENT / SAVED TRIPS SECTION */}
      <div className="space-y-2 pt-1">
        {favorites.length > 0 && (
          <div className="text-xs font-display font-bold text-slate-500 uppercase tracking-wider px-1 pt-2">
            Iba pang na-save na Byahe ({otherRoutes.length})
          </div>
        )}
        <div className="space-y-2">
          {otherRoutes.map(renderRouteCard)}
        </div>
      </div>
    </div>
  );
}
