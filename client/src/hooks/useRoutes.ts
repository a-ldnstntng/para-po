import { useState, useEffect, useCallback } from 'react';
import type { ExtractedRoute, SavedRoute } from '../lib/api';
import { extractRoute, saveRoute, getRoutes, confirmRoute as apiConfirm, deleteRoute as apiDelete } from '../lib/api';

export function useRoutes() {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState<ExtractedRoute | null>(null);
  const [currentRawText, setCurrentRawText] = useState<string>('');

  const loadRoutes = useCallback(async () => {
    setIsLoading(true);
    try {
      const routes = await getRoutes();
      setSavedRoutes(routes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const extract = useCallback(async (text: string) => {
    setIsExtracting(true);
    setError(null);
    setCurrentRoute(null);
    setCurrentRawText(text);
    try {
      const route = await extractRoute(text);
      setCurrentRoute(route);
      return route;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const save = useCallback(async () => {
    if (!currentRoute) return;
    try {
      await saveRoute(currentRoute, currentRawText);
      setCurrentRoute(null);
      setCurrentRawText('');
      await loadRoutes();
    } catch (err: any) {
      setError(err.message);
    }
  }, [currentRoute, currentRawText, loadRoutes]);

  const confirm = useCallback(async (id: string) => {
    try {
      await apiConfirm(id);
      await loadRoutes();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadRoutes]);

  const remove = useCallback(async (id: string) => {
    try {
      await apiDelete(id);
      await loadRoutes();
    } catch (err: any) {
      setError(err.message);
    }
  }, [loadRoutes]);

  const clearCurrent = useCallback(() => {
    setCurrentRoute(null);
    setCurrentRawText('');
    setError(null);
    setIsExtracting(false);
  }, []);

  return {
    savedRoutes,
    isLoading,
    isExtracting,
    error,
    currentRoute,
    currentRawText,
    extract,
    save,
    confirm,
    remove,
    clearCurrent,
    setError,
  };
}
