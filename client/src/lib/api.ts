const API_BASE = '/api';

export interface RouteStep {
  step_order: number;
  mode: 'jeep' | 'tricycle' | 'bus' | 'uv_express' | 'walk' | 'mrt' | 'lrt' | 'pnr' | 'grab';
  line_label: string | null;
  landmark: string;
  instruction: string;
  fare_estimate_php: number | null;
  notes: string | null;
}

export interface ExtractedRoute {
  origin: string;
  destination: string;
  steps: RouteStep[];
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

export async function extractRoute(text: string): Promise<ExtractedRoute> {
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
      const err = await res.json().catch(() => ({ error: `Server error (${res.status})` }));
      throw new Error(err.error || 'Extraction failed');
    }
    
    return res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Matagal sumagot ang server (Request timeout). Pakisubukan ulit.');
    }
    throw err;
  }
}

export async function saveRoute(route: ExtractedRoute, rawText: string): Promise<SavedRoute> {
  const res = await fetch(`${API_BASE}/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      origin: route.origin,
      destination: route.destination,
      raw_text: rawText,
      steps: route.steps,
    }),
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save route');
  }
  
  return res.json();
}

export async function getRoutes(): Promise<SavedRoute[]> {
  const res = await fetch(`${API_BASE}/routes`);
  if (!res.ok) throw new Error('Failed to load routes');
  return res.json();
}

export async function confirmRoute(id: string): Promise<void> {
  await fetch(`${API_BASE}/routes/${id}/confirm`, { method: 'POST' });
}

export async function deleteRoute(id: string): Promise<void> {
  await fetch(`${API_BASE}/routes/${id}`, { method: 'DELETE' });
}
