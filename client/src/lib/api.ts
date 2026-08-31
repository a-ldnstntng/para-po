const API_BASE = '/api';

export interface RouteStep {
  step_order: number;
  mode: 'jeep' | 'tricycle' | 'bus' | 'p2p_bus' | 'uv_express' | 'walk' | 'mrt' | 'lrt' | 'pnr' | 'grab' | string;
  line_label: string | null;
  landmark: string;
  instruction: string;
  fare_estimate_php: number | null;
  estimated_duration_min?: number | null;
  notes: string | null;
}

export interface RouteOption {
  option_id: string;
  title: string;
  badge?: string;
  summary?: string;
  total_fare_php?: number;
  total_duration_min?: number;
  steps: RouteStep[];
}

export interface ExtractedRoute {
  origin: string;
  destination: string;
  options?: RouteOption[];
  steps: RouteStep[];
  total_duration_min?: number;
  total_fare_php?: number;
  is_offline_cached?: boolean;
}

export interface SavedRoute extends ExtractedRoute {
  id: string;
  raw_text: string;
  confirms: number;
  created_at: string;
}

export interface ExtractError {
  error: string;
}

// In-memory client cache for instant responses on repeated queries
const routeCache = new Map<string, ExtractedRoute>();

export async function extractRoute(text: string): Promise<ExtractedRoute> {
  const normalizedKey = text.trim().toLowerCase();
  if (routeCache.has(normalizedKey)) {
    return routeCache.get(normalizedKey)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 50000);
  try {
    const res = await fetch(`${API_BASE}/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errData: ExtractError = await res.json().catch(() => ({ error: 'Communication error with server' }));
      throw new Error(errData.error || `HTTP ${res.status}: Failed to extract route`);
    }

    const data: ExtractedRoute = await res.json();
    routeCache.set(normalizedKey, data);
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Medyo matagal sumagot ang AI service. Pakisubukan ulit.');
    }
    throw err;
  }
}

export async function getRoutes(): Promise<SavedRoute[]> {
  const res = await fetch(`${API_BASE}/routes`);
  if (!res.ok) throw new Error('Failed to load saved routes');
  return res.json();
}

export async function saveRoute(route: ExtractedRoute, rawText: string): Promise<SavedRoute> {
  const res = await fetch(`${API_BASE}/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      origin: route.origin,
      destination: route.destination,
      steps: route.steps,
      options: route.options,
      total_duration_min: route.total_duration_min,
      total_fare_php: route.total_fare_php,
      raw_text: rawText,
    }),
  });
  if (!res.ok) throw new Error('Failed to save route');
  return res.json();
}

export async function confirmRoute(id: string): Promise<SavedRoute> {
  const res = await fetch(`${API_BASE}/routes/${id}/confirm`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to confirm route');
  return res.json();
}

export async function deleteRoute(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/routes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete route');
}
