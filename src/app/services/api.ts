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

export async function saveWatchlist(userId: string, lists: Record<string, any>) {
  return fetchFromServer(`/api/watchlist/${userId}`, {
    method: 'POST',
    body: lists,
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

// Friends API
export async function sendFriendRequest(fromUserId: string, toUsername: string) {
  return fetchFromServer(`/api/friends/request`, {
    method: 'POST',
    body: { fromUserId, toUsername },
  });
}

export async function getFriendRequests(userId: string) {
  return fetchFromServer(`/api/friends/requests/${userId}`);
}

export async function acceptFriendRequest(requestId: string) {
  return fetchFromServer(`/api/friends/request/${requestId}/accept`, {
    method: 'POST',
  });
}

export async function declineFriendRequest(requestId: string) {
  return fetchFromServer(`/api/friends/request/${requestId}/decline`, {
    method: 'POST',
  });
}

export async function getFriends(userId: string) {
  return fetchFromServer(`/api/friends/${userId}`);
}

export async function removeFriend(userId1: string, userId2: string) {
  return fetchFromServer(`/api/friends/remove`, {
    method: 'POST',
    body: { userId1, userId2 },
  });
}

export async function searchUsers(query: string) {
  return fetchFromServer(`/api/users/search?q=${encodeURIComponent(query)}`);
}

export async function getUserProfile(userId: string) {
  return fetchFromServer(`/api/users/${userId}`);
}

export async function updateUserProfile(userId: string, profile: Record<string, any>) {
  return fetchFromServer(`/api/users/${userId}`, {
    method: 'PUT',
    body: profile,
  });
}
