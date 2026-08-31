import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, WifiOff, MapPin, ChevronRight, Clock } from 'lucide-react';
import Board from './components/Board';
import RouteInput from './components/RouteInput';
import Ticket from './components/Ticket';
import ArchiveList from './components/ArchiveList';
import InstallPrompt from './components/InstallPrompt';
import { useRoutes } from './hooks/useRoutes';
import { useOfflineStatus } from './hooks/useOfflineStatus';
import type { ExtractedRoute } from './lib/api';

function App() {
  const {
    savedRoutes,
    isLoading,
    isExtracting,
    error,
    currentRoute,
    extract,
    save,
    confirm,
    remove,
    clearCurrent,
    setError,
    setCurrentRoute,
  } = useRoutes();

  const { isOffline, offlineRoutes, saveRouteToOffline } = useOfflineStatus();
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Auto-persist last extracted route to local storage for offline use
  useEffect(() => {
    if (currentRoute) {
      saveRouteToOffline(currentRoute);
      setIsInputCollapsed(true);
      if (ticketRef.current) {
        ticketRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setIsInputCollapsed(false);
    }
  }, [currentRoute, saveRouteToOffline]);

  // If user opens the app offline without an active route, restore the most recent trip automatically
  useEffect(() => {
    if (isOffline && !currentRoute && offlineRoutes.length > 0) {
      setCurrentRoute(offlineRoutes[0]);
      setIsInputCollapsed(true);
    }
  }, [isOffline, offlineRoutes]);

  const handleClearRoute = () => {
    clearCurrent();
    setIsInputCollapsed(false);
    setOfflineNotice(null);
  };

  const handleSelectRouteTag = (tag: string) => {
    setIsInputCollapsed(false);
    handleSearch(`Ruta papuntang ${tag}`);
  };

  const handleSearch = async (text: string) => {
    setOfflineNotice(null);

    // If offline, check if matching query exists in cached offline routes
    if (isOffline) {
      const match = offlineRoutes.find(
        (r) =>
          r.origin.toLowerCase().includes(text.toLowerCase()) ||
          r.destination.toLowerCase().includes(text.toLowerCase())
      );
      if (match) {
        setCurrentRoute(match);
        setIsInputCollapsed(true);
        return;
      }
      setOfflineNotice('Kailangan ng internet para sa bagong ruta. Narito ang mga available offline mong byahe:');
      return;
    }

    try {
      await extract(text);
    } catch (err: any) {
      if (!navigator.onLine) {
        setOfflineNotice('Kailangan ng internet para sa bagong ruta. Narito ang mga available offline mong byahe:');
      }
    }
  };

  const handleSelectOfflineRoute = (route: ExtractedRoute) => {
    setCurrentRoute(route);
    setOfflineNotice(null);
    setIsInputCollapsed(true);
  };

  const handleResetSearch = () => {
    setIsInputCollapsed(false);
    setOfflineNotice(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-[env(safe-area-inset-top,0.5rem)] pb-[env(safe-area-inset-bottom,1.5rem)] px-3.5 sm:px-6 bg-[#F8FAFC] text-slate-900 selection:bg-slate-200">
      {/* PWA Install Banner */}
      <div className="w-full max-w-xl mx-auto pt-1 pb-0.5">
        <InstallPrompt />
      </div>

      {/* Offline Status Notice */}
      {isOffline && (
        <div className="w-full max-w-xl mx-auto my-1.5">
          <div className="bg-slate-900 text-amber-400 text-[11px] font-utility px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-700 shadow-sm">
            <WifiOff className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
            <span className="leading-snug font-medium text-slate-200">
              Offline ka ngayon — available ang huling {offlineRoutes.length} na-save mong byahe.
            </span>
          </div>
        </div>
      )}

      <main className="w-full max-w-xl mx-auto flex flex-col items-center space-y-4 sm:space-y-5">
        {/* Minimal Wordmark Header (Collapses city chips after search) */}
        <Board
          onSelectRouteTag={handleSelectRouteTag}
          hasActiveResult={!!currentRoute}
          onResetSearch={handleResetSearch}
        />

        {/* Primary Input Task (Collapsible after search) */}
        <div className="w-full">
          <RouteInput
            onSubmit={handleSearch}
            onClear={handleClearRoute}
            isExtracting={isExtracting}
            isCollapsed={isInputCollapsed}
            onExpand={() => setIsInputCollapsed(false)}
          />
        </div>

        {/* Offline Query Fallback Helper Box */}
        {offlineNotice && (
          <div className="w-full bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-start gap-2 text-amber-950 font-utility text-xs">
              <WifiOff className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed">{offlineNotice}</p>
            </div>

            {offlineRoutes.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {offlineRoutes.map((cached, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOfflineRoute(cached)}
                    type="button"
                    className="w-full bg-white hover:bg-slate-50 border border-amber-200 hover:border-amber-400 rounded-lg p-2.5 text-left flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="font-display font-black text-xs sm:text-sm uppercase text-slate-900 truncate flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span>{cached.origin}</span>
                        <span className="text-slate-400 font-utility">➔</span>
                        <span>{cached.destination}</span>
                      </div>
                      <div className="text-[10px] font-utility text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{cached.steps?.length} legs</span>
                        {cached.total_duration_min && (
                          <span className="flex items-center gap-0.5 text-slate-700">
                            <Clock className="w-2.5 h-2.5" />
                            <span>~{cached.total_duration_min}m</span>
                          </span>
                        )}
                        <span className="text-amber-800 font-bold">
                          ₱{cached.total_fare_php || cached.steps?.reduce((sum, s) => sum + (s.fare_estimate_php || 0), 0) || 0}
                        </span>
                      </div>
                    </div>
                    <div className="text-slate-400 text-xs font-utility flex items-center gap-0.5 flex-shrink-0">
                      <span>Buksan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="w-full">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <p className="text-rose-900 font-utility text-xs font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-rose-500 hover:text-rose-800 p-1 rounded transition-colors"
                title="Dismiss error"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Extracted Route Result (The Hero Object) */}
        {currentRoute && (
          <div ref={ticketRef} className="w-full pt-1 flex flex-col items-center">
            <Ticket
              route={currentRoute}
              onSave={save}
              onClear={handleClearRoute}
            />
          </div>
        )}

        {/* Spacing Divider */}
        <div className="w-full border-t border-slate-200 my-2 sm:my-3" />

        {/* Saved Trips Archive */}
        <div className="w-full">
          <ArchiveList
            routes={savedRoutes}
            isLoading={isLoading}
            onConfirm={confirm}
            onDelete={remove}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
