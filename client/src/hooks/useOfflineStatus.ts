import { useState, useEffect, useCallback } from 'react';
import type { ExtractedRoute } from '../lib/api';

const OFFLINE_HISTORY_KEY = 'para_po_offline_routes_v2';
const MAX_OFFLINE_ROUTES = 5;

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineRoutes, setOfflineRoutes] = useState<ExtractedRoute[]>([]);

  // Load cached offline routes from storage
  const loadOfflineRoutes = useCallback((): ExtractedRoute[] => {
    try {
      const stored = localStorage.getItem(OFFLINE_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setOfflineRoutes(parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse offline routes history:', e);
    }
    return [];
  }, []);

  useEffect(() => {
    loadOfflineRoutes();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      loadOfflineRoutes();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadOfflineRoutes]);

  // Save a full extracted route into the offline history (keeps last 5)
  const saveRouteToOffline = useCallback((route: ExtractedRoute) => {
    try {
      const currentList = loadOfflineRoutes();
      // Deduplicate by origin + destination
      const filtered = currentList.filter(
        (r) =>
          r.origin.toLowerCase() !== route.origin.toLowerCase() ||
          r.destination.toLowerCase() !== route.destination.toLowerCase()
      );
      const updated = [{ ...route, is_offline_cached: true }, ...filtered].slice(0, MAX_OFFLINE_ROUTES);
      localStorage.setItem(OFFLINE_HISTORY_KEY, JSON.stringify(updated));
      setOfflineRoutes(updated);
    } catch (e) {
      console.warn('Failed to save route to offline cache:', e);
    }
  }, [loadOfflineRoutes]);

  return {
    isOffline,
    offlineRoutes,
    saveRouteToOffline,
    loadOfflineRoutes,
  };
}
