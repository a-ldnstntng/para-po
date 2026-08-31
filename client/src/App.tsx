import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Board from './components/Board';
import RouteInput from './components/RouteInput';
import Ticket from './components/Ticket';
import ArchiveList from './components/ArchiveList';
import { useRoutes } from './hooks/useRoutes';

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
  } = useRoutes();

  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // When a route is successfully extracted, collapse the input to focus on the result
  useEffect(() => {
    if (currentRoute) {
      setIsInputCollapsed(true);
      if (ticketRef.current) {
        ticketRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setIsInputCollapsed(false);
    }
  }, [currentRoute]);

  const handleClearRoute = () => {
    clearCurrent();
    setIsInputCollapsed(false);
  };

  const handleSelectRouteTag = (tag: string) => {
    setIsInputCollapsed(false);
    extract(`Ruta papuntang ${tag}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-8 px-4 sm:px-6 bg-[#F8FAFC] text-slate-900 selection:bg-slate-200">
      <main className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6">
        {/* Minimal Wordmark Header */}
        <Board onSelectRouteTag={handleSelectRouteTag} />

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
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <p className="text-rose-900 font-body text-xs font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-rose-500 hover:text-rose-800 p-1 rounded transition-colors"
                title="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Extracted Route Result (The Hero Object) */}
        {currentRoute && (
          <div ref={ticketRef} className="w-full pt-2 flex flex-col items-center">
            <Ticket
              route={currentRoute}
              onSave={save}
              onClear={handleClearRoute}
            />
          </div>
        )}

        {/* Spacing Divider */}
        <div className="w-full border-t border-slate-200 my-4" />

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
