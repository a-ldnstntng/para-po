import { useState, useEffect } from 'react';
import type { ExtractedRoute } from '../lib/api';

const LAST_ROUTE_STORAGE_KEY = 'para_po_last_route';

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveLastRouteOffline = (route: ExtractedRoute) => {
    try {
      localStorage.setItem(LAST_ROUTE_STORAGE_KEY, JSON.stringify(route));
    } catch (e) {
      console.warn('Failed to cache last route in localStorage:', e);
    }
  };

  const getLastRouteOffline = (): ExtractedRoute | null => {
    try {
      const stored = localStorage.getItem(LAST_ROUTE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  };

  return {
    isOffline,
    saveLastRouteOffline,
    getLastRouteOffline,
  };
}
