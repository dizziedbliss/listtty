// TMDB API Service
// To use: Set TMDB_API_KEY in Supabase secrets via Make settings

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

export interface TMDBShow {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  overview: string;
}

export async function fetchTrendingMovies(apiKey: string): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}`
  );
  const data = await response.json();
  return data.results || [];
}

export async function fetchTrendingShows(apiKey: string): Promise<TMDBShow[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/tv/week?api_key=${apiKey}`
  );
  const data = await response.json();
  return data.results || [];
}

export async function searchMovies(query: string, apiKey: string): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results || [];
}

export async function searchShows(query: string, apiKey: string): Promise<TMDBShow[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results || [];
}

export function getImageUrl(path: string): string {
  return path ? `${TMDB_IMAGE_BASE}${path}` : '';
}
