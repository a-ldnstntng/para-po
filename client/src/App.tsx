import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X, WifiOff, MapPin, ChevronRight, Clock } from 'lucide-react';
import Board from './components/Board';
import RouteInput from './components/RouteInput';
import Ticket from './components/Ticket';
import ByaheKoTab from './components/ByaheKoTab';
import ProfileTab from './components/ProfileTab';
import BottomNav, { type TabType } from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import { useRoutes } from './hooks/useRoutes';
import { useOfflineStatus } from './hooks/useOfflineStatus';
import { getUserProfile, saveUserProfile, toggleFavoriteRoute, addRecentSearch, type UserProfile } from './lib/userProfile';
import type { ExtractedRoute, SavedRoute } from './lib/api';

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
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);
  const [prefillText, setPrefillText] = useState('');
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
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

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    const updated = saveUserProfile(updates);
    setProfile(updated);
  };

  const handleToggleFavorite = (routeId: string) => {
    toggleFavoriteRoute(routeId);
    setProfile(getUserProfile());
  };

  const handleClearRoute = () => {
    clearCurrent();
    setIsInputCollapsed(false);
    setOfflineNotice(null);
    setPrefillText('');
  };

  const handleSelectRouteTag = (destination: string) => {
    setIsInputCollapsed(false);
    setActiveTab('search');
    if (profile.homeLocation) {
      setPrefillText(`Papuntang ${destination}`);
    } else {
      setPrefillText(`Papuntang ${destination} galing sa `);
    }
  };

  const handleSearch = async (text: string) => {
    setOfflineNotice(null);
    addRecentSearch(text);

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
    setActiveTab('search');
  };

  const handleResetSearch = () => {
    setIsInputCollapsed(false);
    setOfflineNotice(null);
    setPrefillText('');
  };

  const handleSakayUlit = (route: SavedRoute) => {
    setCurrentRoute(route);
    setIsInputCollapsed(true);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between pt-[env(safe-area-inset-top,0.75rem)] pb-28 px-4 sm:px-6 lg:px-8 bg-[#F8F9FB] text-slate-900 selection:bg-orange-100">
      <div className="w-full max-w-xl lg:max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center">
        {/* PWA Install Banner */}
        <div className="w-full pt-1 pb-0.5">
          <InstallPrompt />
        </div>

        {/* Offline Status Notice */}
        {isOffline && (
          <div className="w-full my-1.5">
            <div className="bg-slate-900 text-orange-400 text-xs font-body px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <WifiOff className="w-4 h-4 flex-shrink-0 text-orange-500" />
              <span className="leading-snug font-medium text-slate-200">
                Offline ka ngayon — available ang huling {offlineRoutes.length} na-save mong byahe.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 1: SEARCH (Default / Landing Screen)
            ======================================================== */}
        {activeTab === 'search' && (
          <div key="tab-search" className="w-full animate-tab-content">
            <main className="w-full flex flex-col items-center space-y-4 sm:space-y-5">
              {/* Header */}
              <Board
                onSelectRouteTag={handleSelectRouteTag}
                hasActiveResult={!!currentRoute}
                onResetSearch={handleResetSearch}
              />

              {/* Primary Input Task with Bahay Ko support */}
              <div className="w-full max-w-xl lg:max-w-2xl mx-auto">
                <RouteInput
                  onSubmit={handleSearch}
                  onClear={handleClearRoute}
                  isExtracting={isExtracting}
                  isCollapsed={isInputCollapsed}
                  onExpand={() => setIsInputCollapsed(false)}
                  prefillText={prefillText}
                  homeLocation={profile.homeLocation}
                />
              </div>

              {/* Offline Query Fallback Helper Box */}
              {offlineNotice && (
                <div className="w-full max-w-xl lg:max-w-2xl mx-auto ios-card p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-2.5 text-slate-800 font-body text-xs">
                    <WifiOff className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="font-semibold leading-relaxed">{offlineNotice}</p>
                  </div>

                  {offlineRoutes.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {offlineRoutes.map((cached, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectOfflineRoute(cached)}
                          type="button"
                          className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 rounded-2xl p-3 text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                              <span>{cached.origin}</span>
                              <span className="text-slate-400">➔</span>
                              <span>{cached.destination}</span>
                            </div>
                            <div className="text-[11px] font-body text-slate-400 mt-1 flex items-center gap-2.5">
                              <span>{cached.steps?.length} sakay</span>
                              {cached.total_duration_min && (
                                <span className="flex items-center gap-1 text-slate-600">
                                  <Clock className="w-3 h-3" />
                                  <span>~{cached.total_duration_min}m</span>
                                </span>
                              )}
                              <span className="text-orange-600 font-bold">
                                ₱{cached.total_fare_php || cached.steps?.reduce((sum, s) => sum + (s.fare_estimate_php || 0), 0) || 0}
                              </span>
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-slate-700 text-xs font-body font-semibold shadow-xs flex-shrink-0">
                            <span>Buksan</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="w-full max-w-xl lg:max-w-2xl mx-auto">
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <p className="text-rose-900 font-body text-xs font-semibold">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-rose-400 hover:text-rose-700 p-1 rounded-full transition-colors"
                      title="Dismiss error"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Extracted Route Result (Dual-Pane on Desktop) */}
              {currentRoute && (
                <div ref={ticketRef} className="w-full pt-1">
                  <Ticket
                    route={currentRoute}
                    onSave={save}
                    onClear={handleClearRoute}
                  />
                </div>
              )}
            </main>
          </div>
        )}

        {/* ========================================================
            TAB 2: BYAHE KO (Favorites, History, & Sakay Ulit)
            ======================================================== */}
        {activeTab === 'byahe_ko' && (
          <div key="tab-byahe-ko" className="w-full animate-tab-content">
            <ByaheKoTab
              routes={savedRoutes}
              isLoading={isLoading}
              favoriteRouteIds={profile.favoriteRouteIds}
              onToggleFavorite={handleToggleFavorite}
              onConfirm={confirm}
              onDelete={remove}
              onSakayUlit={handleSakayUlit}
              onGoToSearch={() => setActiveTab('search')}
            />
          </div>
        )}

        {/* ========================================================
            TAB 3: PROFILE & SETTINGS (Name, Bahay Ko, Feedback)
            ======================================================== */}
        {activeTab === 'profile' && (
          <div key="tab-profile" className="w-full animate-tab-content">
            <ProfileTab
              profile={profile}
              onSaveProfile={handleUpdateProfile}
            />
          </div>
        )}

      {/* PERSISTENT BOTTOM TAB NAVIGATION */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        savedCount={savedRoutes.length}
      />
    </div>
    </div>
  );
}

export default App;
