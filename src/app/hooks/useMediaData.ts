import { useQuery } from '@tanstack/react-query';
import { fetchTrendingAnime, searchAnime } from '../services/anilist';
import { fetchTrendingMoviesFromServer, fetchTrendingShowsFromServer, searchMediaFromServer } from '../services/api';
import { buildTmdbRequest, TMDB_IMAGE_BASE } from '../services/details';
import { mockMovies, mockShows, mockAnime, MediaItem } from '../data/mockData';

// Hook for fetching anime data from AniList
export function useAnimeData(searchQuery?: string) {
  return useQuery({
    queryKey: ['anime', searchQuery || 'trending'],
    queryFn: async () => {
      try {
        const data = searchQuery
          ? await searchAnime(searchQuery)
          : await fetchTrendingAnime();

        return data.map((anime): MediaItem => ({
          id: anime.id,
          title: anime.title.english || anime.title.romaji,
          poster: anime.coverImage.large,
          year: anime.seasonYear?.toString() || 'N/A',
          type: 'anime',
        }));
      } catch (error) {
        console.error('Failed to fetch anime data:', error);
        return mockAnime; // Fallback to mock data
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for movies - fetches from TMDB via Supabase server
async function fetchWithFallback(clientFetch: () => Promise<any>, serverFetch: () => Promise<any>) {
  try {
    const clientKey = (import.meta as any).env?.VITE_TMDB_API_KEY;
    if (clientKey) {
      try {
        const data = await clientFetch();
        // TMDB returns status_code/message for errors
        if (data && !data.status_code) return data;
        console.warn('TMDB client returned error:', data?.status_code, data?.status_message);
      } catch (err) {
        console.warn('TMDB client fetch failed:', err);
      }
    }
  } catch (e) {
    console.warn('Error checking client key:', e);
  }

  // Fallback to server proxy
  return serverFetch();
}

export function useMoviesData(searchQuery?: string) {
  return useQuery({
    queryKey: ['movies', searchQuery || 'trending'],
    queryFn: async () => {
      try {
        const data = await fetchWithFallback(
          () => {
            const request = buildTmdbRequest(
              searchQuery
                ? `/search/movie?query=${encodeURIComponent(searchQuery)}`
                : '/trending/movie/week'
            );
            return fetch(request.url, request.init).then((r) => r.json());
          },
          () => (searchQuery ? searchMediaFromServer(searchQuery, 'movie') : fetchTrendingMoviesFromServer())
        );

        if (data.error || !data.results?.length) {
          console.log('TMDB API Error:', data.error || 'No results');
          console.log('Using mock data. Make sure TMDB_API_KEY is set and server is deployed.');
          return mockMovies;
        }

        return data.results.map((movie: any): MediaItem => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : mockMovies[0].poster,
          year: movie.release_date?.split('-')[0] || 'N/A',
          type: 'movie',
        }));
      } catch (error) {
        console.error('Failed to fetch movie data from server:', error);
        console.log('Make sure the Supabase edge function is deployed in Make settings.');
        return mockMovies;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Hook for shows - fetches from TMDB via Supabase server
export function useShowsData(searchQuery?: string) {
  return useQuery({
    queryKey: ['shows', searchQuery || 'trending'],
    queryFn: async () => {
      try {
        const data = await fetchWithFallback(
          () => {
            const request = buildTmdbRequest(
              searchQuery
                ? `/search/tv?query=${encodeURIComponent(searchQuery)}`
                : '/trending/tv/week'
            );
            return fetch(request.url, request.init).then((r) => r.json());
          },
          () => (searchQuery ? searchMediaFromServer(searchQuery, 'tv') : fetchTrendingShowsFromServer())
        );

        if (data.error || !data.results?.length) {
          console.log('TMDB API Error:', data.error || 'No results');
          console.log('Using mock data. Make sure TMDB_API_KEY is set and server is deployed.');
          return mockShows;
        }

        return data.results.map((show: any): MediaItem => ({
          id: show.id,
          title: show.name,
          poster: show.poster_path ? `${TMDB_IMAGE_BASE}${show.poster_path}` : mockShows[0].poster,
          year: show.first_air_date?.split('-')[0] || 'N/A',
          type: 'show',
        }));
      } catch (error) {
        console.error('Failed to fetch show data from server:', error);
        console.log('Make sure the Supabase edge function is deployed in Make settings.');
        return mockShows;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
