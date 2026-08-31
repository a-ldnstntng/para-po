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
    <div className="min-h-screen w-full flex flex-col items-center justify-start pb-16 bg-jeep-darker text-jeep-text">
      <main className="w-full max-w-3xl md:max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header */}
        <Board />

        {/* Route Input */}
        <RouteInput onSubmit={extract} onClear={clearCurrent} isExtracting={isExtracting} />

        {/* Error Display */}
        {error && (
          <div className="w-full pb-4">
            <div className="bg-jeep-red/10 border border-jeep-red/30 rounded-lg p-3 flex items-center justify-between">
              <p className="text-jeep-red text-sm">⚠️ {error}</p>
              <button
                onClick={() => setError(null)}
                className="text-jeep-red/60 hover:text-jeep-red text-lg leading-none"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Extracted Route (current, unsaved) */}
        {currentRoute && (
          <div className="w-full pb-8">
            <Ticket
              route={currentRoute}
              onSave={save}
              onClear={clearCurrent}
            />
          </div>
        )}

        {/* Chrome separator */}
        <div className="w-full">
          <div className="chrome-stripe" />
        </div>

        {/* Saved Routes Archive */}
        <div className="w-full pt-4">
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
