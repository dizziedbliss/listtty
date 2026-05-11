import { projectId, publicAnonKey } from '../../../utils/supabase/info.tsx';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-19aaa725`;

interface FetchOptions {
  method?: string;
  body?: any;
  requiresAuth?: boolean;
}

async function fetchFromServer(endpoint: string, options: FetchOptions = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };

  const response = await fetch(`${SERVER_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.statusText}`);
  }

  return response.json();
}

// TMDB API via server
export async function fetchTrendingMoviesFromServer() {
  return fetchFromServer('/api/movies/trending');
}

export async function fetchTrendingShowsFromServer() {
  return fetchFromServer('/api/shows/trending');
}

export async function searchMediaFromServer(query: string, type: 'movie' | 'tv') {
  return fetchFromServer(`/api/search?q=${encodeURIComponent(query)}&type=${type}`);
}

// User data API
export async function getWatchlist(userId: string) {
  return fetchFromServer(`/api/watchlist/${userId}`);
}

export async function saveWatchlist(userId: string, watchlist: any[]) {
  return fetchFromServer(`/api/watchlist/${userId}`, {
    method: 'POST',
    body: { watchlist },
  });
}

export async function getProgress(userId: string) {
  return fetchFromServer(`/api/progress/${userId}`);
}

export async function saveProgress(userId: string, progress: Record<string, any>) {
  return fetchFromServer(`/api/progress/${userId}`, {
    method: 'POST',
    body: { progress },
  });
}
