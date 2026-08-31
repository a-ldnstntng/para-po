import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, WifiOff } from 'lucide-react';
import Board from './components/Board';
import RouteInput from './components/RouteInput';
import Ticket from './components/Ticket';
import ArchiveList from './components/ArchiveList';
import InstallPrompt from './components/InstallPrompt';
import { useRoutes } from './hooks/useRoutes';
import { useOfflineStatus } from './hooks/useOfflineStatus';

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

  const { isOffline, saveLastRouteOffline, getLastRouteOffline } = useOfflineStatus();
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Auto-persist last extracted route to local storage for offline use
  useEffect(() => {
    if (currentRoute) {
      saveLastRouteOffline(currentRoute);
      setIsInputCollapsed(true);
      if (ticketRef.current) {
        ticketRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setIsInputCollapsed(false);
    }
  }, [currentRoute]);

  // If user opens the app offline without an active route, restore the last trip automatically
  useEffect(() => {
    if (isOffline && !currentRoute) {
      const cached = getLastRouteOffline();
      if (cached) {
        setCurrentRoute(cached);
        setIsInputCollapsed(true);
      }
    }
  }, [isOffline]);

  const handleClearRoute = () => {
    clearCurrent();
    setIsInputCollapsed(false);
  };

  const handleSelectRouteTag = (tag: string) => {
    setIsInputCollapsed(false);
    extract(`Ruta papuntang ${tag}`);
  };

  const handleResetSearch = () => {
    setIsInputCollapsed(false);
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
              Offline ka ngayon — ipinapakita ang huling na-save na commute pass.
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
            onSubmit={extract}
            onClear={handleClearRoute}
            isExtracting={isExtracting}
            isCollapsed={isInputCollapsed}
            onExpand={() => setIsInputCollapsed(false)}
          />
        </div>

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
