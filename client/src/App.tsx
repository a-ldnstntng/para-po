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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pb-16 bg-[#0B0F19] text-slate-100">
      <main className="w-full max-w-3xl md:max-w-4xl px-3 sm:px-6 flex flex-col items-center">
        {/* Header Board */}
        <Board />

        {/* Route Input Console */}
        <RouteInput onSubmit={extract} onClear={clearCurrent} isExtracting={isExtracting} />

        {/* Error Banner */}
        {error && (
          <div className="w-full pb-4">
            <div className="bg-rose-950/80 border border-rose-800 rounded-xl p-3.5 sm:p-4 flex items-center justify-between shadow-lg">
              <p className="text-rose-200 font-medium text-xs sm:text-sm">⚠️ {error}</p>
              <button
                onClick={() => setError(null)}
                className="text-rose-300 hover:text-white text-sm font-semibold ml-2 px-2 py-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Extracted Route Result */}
        {currentRoute && (
          <div className="w-full pb-6">
            <Ticket
              route={currentRoute}
              onSave={save}
              onClear={clearCurrent}
            />
          </div>
        )}

        {/* Divider */}
        <div className="w-full my-4 border-t border-slate-800" />

        {/* Terminal Dispatch Archive */}
        <div className="w-full pt-2">
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
