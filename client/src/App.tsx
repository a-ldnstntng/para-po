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
    <div className="min-h-screen w-full flex flex-col items-center justify-start pb-16 bg-[#0A0A0A] text-[#FFFFFF]">
      <main className="w-full max-w-3xl md:max-w-4xl px-3 sm:px-6 flex flex-col items-center">
        {/* Header Board */}
        <Board />

        {/* Route Input Console */}
        <RouteInput onSubmit={extract} onClear={clearCurrent} isExtracting={isExtracting} />

        {/* Error Banner */}
        {error && (
          <div className="w-full pb-4">
            <div className="bg-[#FF0000] border-3 border-[#000000] shadow-[4px_4px_0px_#FFFFFF] p-3 sm:p-4 flex items-center justify-between">
              <p className="text-white font-mono font-bold text-xs sm:text-sm">⚠️ {error}</p>
              <button
                onClick={() => setError(null)}
                className="bg-[#000000] text-white px-2 py-1 font-mono text-xs font-bold border border-white hover:bg-white hover:text-black transition-none ml-2"
              >
                ✕ ISARA
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

        {/* Solid Color Separator */}
        <div className="w-full my-4 border-t-4 border-[#333333]" />

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
