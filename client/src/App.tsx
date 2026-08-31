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
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-8 px-4 sm:px-6 bg-[#F8FAFC] text-slate-900 selection:bg-amber-200 selection:text-amber-900">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6">
        {/* Header: Framed Transit Wordmark */}
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
            <div className="bg-rose-50 border-2 border-rose-600 rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-[3px_3px_0px_rgba(225,29,72,0.15)]">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <p className="text-rose-900 font-body text-xs sm:text-sm font-semibold">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-rose-700 hover:text-rose-950 p-1 rounded hover:bg-rose-100 transition-colors"
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

        {/* Structured Divider Line */}
        <div className="w-full flex items-center gap-3 my-1">
          <div className="h-0.5 flex-1 bg-slate-300" />
          <span className="font-utility text-[11px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded border border-slate-300">
            DISPATCH ARCHIVE
          </span>
          <div className="h-0.5 flex-1 bg-slate-300" />
        </div>

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
