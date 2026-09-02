export interface UserProfile {
  name: string;
  homeLocation: string;
  favoriteRouteIds: string[];
  recentSearches: string[];
}

export interface StepReport {
  id: string;
  timestamp: string;
  stepIndex: number;
  mode: string;
  instruction: string;
  landmark?: string;
  fare?: number | null;
  reason: string;
  notes?: string;
}

const PROFILE_KEY = 'para_po_user_profile';
const STEP_REPORTS_KEY = 'para_po_step_reports';

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse user profile', err);
  }
  return {
    name: '',
    homeLocation: '',
    favoriteRouteIds: [],
    recentSearches: [],
  };
}

export function saveUserProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save user profile', err);
  }
  return updated;
}

export function addRecentSearch(query: string): void {
  if (!query || !query.trim()) return;
  const current = getUserProfile();
  const filtered = current.recentSearches.filter((q) => q.toLowerCase() !== query.toLowerCase());
  const updated = [query.trim(), ...filtered].slice(0, 10);
  saveUserProfile({ recentSearches: updated });
}

export function toggleFavoriteRoute(routeId: string): boolean {
  const current = getUserProfile();
  const isFav = current.favoriteRouteIds.includes(routeId);
  const updated = isFav
    ? current.favoriteRouteIds.filter((id) => id !== routeId)
    : [...current.favoriteRouteIds, routeId];
  saveUserProfile({ favoriteRouteIds: updated });
  return !isFav;
}

export function getStepReports(): StepReport[] {
  try {
    const raw = localStorage.getItem(STEP_REPORTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse step reports', err);
  }
  return [];
}

export function saveStepReport(report: Omit<StepReport, 'id' | 'timestamp'>): StepReport {
  const newReport: StepReport = {
    ...report,
    id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  const existing = getStepReports();
  try {
    localStorage.setItem(STEP_REPORTS_KEY, JSON.stringify([newReport, ...existing]));
  } catch (err) {
    console.error('Failed to save step report', err);
  }
  return newReport;
}
