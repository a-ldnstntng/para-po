import { useEffect, useRef } from 'react';
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

  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentRoute && ticketRef.current) {
      ticketRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentRoute]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-8 px-4 sm:px-6 bg-[#0B0F19] text-slate-100 selection:bg-emerald-500 selection:text-black">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6">
        {/* Header: Simplified Transit Wordmark */}
        <div className="w-full flex justify-center">
          <Board />
        </div>

        {/* Route Input Console */}
        <div className="w-full">
          <RouteInput onSubmit={extract} onClear={clearCurrent} isExtracting={isExtracting} />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="w-full">
            <div className="bg-rose-950/90 border border-rose-700/80 rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <p className="text-rose-200 font-body text-xs sm:text-sm font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-rose-300 hover:text-white p-1 rounded hover:bg-rose-900/50 transition-colors"
                title="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Extracted Route Result (Landscape Transit Pass) */}
        {currentRoute && (
          <div ref={ticketRef} className="w-full py-2 flex flex-col items-center">
            <Ticket
              route={currentRoute}
              onSave={save}
              onClear={clearCurrent}
            />
          </div>
        )}

        {/* Divider */}
        <div className="w-full border-t border-slate-800 my-1" />

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
