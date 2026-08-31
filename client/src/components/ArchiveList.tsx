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
        <div className="loading-wheel" />
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-12 glass-panel p-8">
        <div className="text-4xl mb-2">📋</div>
        <p className="text-slate-300 font-display text-lg uppercase tracking-wider">Wala pang saved routes sa terminal</p>
        <p className="text-slate-500 text-sm mt-1">
          I-describe ang iyong commute sa taas at i-click ang <span className="text-amber-400 font-bold">Extract Route</span>!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Terminal Dispatch Header */}
      <Signboard variant="green" className="!p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="signboard-text text-xl sm:text-2xl">Terminal Dispatch Archive</h2>
              <p className="text-xs text-emerald-200 font-mono opacity-80">
                {routes.length} saved route{routes.length !== 1 ? 's' : ''} in database
              </p>
            </div>
          </div>

          {/* Search Filter Input */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search routes or landmarks..."
              className="w-full sm:w-64 bg-slate-900/90 border border-emerald-500/40 rounded-lg px-3 py-1.5
                text-slate-100 font-body text-xs placeholder:text-slate-500
                focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </Signboard>

      {/* Filter result notice */}
      {searchQuery && (
        <p className="text-xs text-slate-400 font-mono px-1">
          Showing {filteredRoutes.length} of {routes.length} routes matching "{searchQuery}"
        </p>
      )}

      {/* Route List */}
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
                className="archive-item hover:border-amber-400/50"
                onClick={() => setExpandedId(route.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-lg text-amber-400">
                        {route.origin}
                      </span>
                      <span className="text-slate-500 font-bold">➔</span>
                      <span className="font-display font-bold text-lg text-amber-400">
                        {route.destination}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs mt-1 line-clamp-1 font-mono">
                      "{route.raw_text}"
                    </p>

                    <div className="flex items-center gap-3 text-slate-500 text-xs mt-2 font-mono">
                      <span>{route.steps.length} step{route.steps.length !== 1 ? 's' : ''}</span>
                      {route.confirms > 0 && (
                        <span className="text-emerald-400 font-bold">✅ {route.confirms} confirm{route.confirms !== 1 ? 's' : ''}</span>
                      )}
                      <span>·</span>
                      <span>
                        {new Date(route.created_at).toLocaleDateString('en-PH', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400 font-display font-bold uppercase tracking-wider group-hover:underline">
                      View Ticket
                    </span>
                    <span className="text-slate-500 text-lg">▸</span>
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
