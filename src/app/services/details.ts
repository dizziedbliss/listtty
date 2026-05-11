// Service for fetching detailed information about anime/movies/shows

const ANILIST_URL = 'https://graphql.anilist.co';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

function getTmdbAuthConfig() {
  const envKey = (import.meta as any).env?.VITE_TMDB_API_KEY?.trim();

  if (!envKey) {
    return null;
  }

  // TMDB v4 access tokens are JWT-like and must be sent as a Bearer token.
  if (envKey.startsWith('eyJ') || envKey.includes('.')) {
    return {
      mode: 'bearer' as const,
      token: envKey,
    };
  }

  return {
    mode: 'api_key' as const,
    key: envKey,
  };
}

export function buildTmdbRequest(path: string) {
  const auth = getTmdbAuthConfig();
  const headers: Record<string, string> = { accept: 'application/json' };

  if (auth && auth.mode === 'bearer') {
    headers.Authorization = `Bearer ${auth.token}`;
    return {
      url: `${TMDB_BASE_URL}${path}`,
      init: { headers } as RequestInit,
    };
  }

  if (auth && auth.mode === 'api_key') {
    const separator = path.includes('?') ? '&' : '?';
    return {
      url: `${TMDB_BASE_URL}${path}${separator}api_key=${auth.key}`,
      init: { headers } as RequestInit,
    };
  }

  return {
    url: `${TMDB_BASE_URL}${path}`,
    init: { headers } as RequestInit,
  };
}

const ANIME_DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        english
        romaji
        native
      }
      coverImage {
        extraLarge
        large
        color
      }
      bannerImage
      description
      seasonYear
      episodes
      duration
      format
      status
      genres
      averageScore
      popularity
      studios {
        nodes {
          name
        }
      }
      characters(page: 1, perPage: 10, sort: ROLE) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              romaji
            }
            coverImage {
              large
            }
            format
          }
        }
      }
    }
  }
`;

export interface AnimeDetails {
  id: number;
  title: {
    english: string | null;
    romaji: string;
    native: string;
  };
  coverImage: {
    extraLarge: string;
    large: string;
    color: string | null;
  };
  bannerImage: string | null;
  description: string;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  format: string;
  status: string;
  genres: string[];
  averageScore: number | null;
  popularity: number;
  studios: {
    nodes: Array<{ name: string }>;
  };
  characters: {
    edges: Array<{
      role: string;
      node: {
        id: number;
        name: { full: string };
        image: { large: string };
      };
    }>;
  };
  relations: {
    edges: Array<{
      relationType: string;
      node: {
        id: number;
        title: { romaji: string };
        coverImage: { large: string };
        format: string;
      };
    }>;
  };
}

export async function fetchAnimeDetails(id: number): Promise<AnimeDetails> {
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: ANIME_DETAIL_QUERY,
      variables: { id },
    }),
  });

  const data = await response.json();
  return data.data.Media;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  vote_count: number;
  production_companies: Array<{ id: number; name: string }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  recommendations?: {
    results: Array<{
      id: number;
      title?: string;
      name?: string;
      poster_path: string | null;
      vote_average: number;
    }>;
  };
}

export interface ShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  episode_run_time: number[];
  genres: Array<{ id: number; name: string }>;
  vote_average: number;
  vote_count: number;
  production_companies: Array<{ id: number; name: string }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  recommendations?: {
    results: Array<{
      id: number;
      title?: string;
      name?: string;
      poster_path: string | null;
      vote_average: number;
    }>;
  };
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  // If a Vite TMDB API key is provided, fetch directly from TMDB (client-side).
  // Otherwise fall back to the Supabase function (serverless) as before.
  const clientRequest = buildTmdbRequest(`/movie/${id}?append_to_response=credits,recommendations,videos`);
  if ((import.meta as any).env?.VITE_TMDB_API_KEY) {
    const resp = await fetch(clientRequest.url, clientRequest.init);
    if (resp.ok) {
      const data = await resp.json();

      const movie: MovieDetails = {
        id: data.id,
        title: data.title,
        overview: data.overview,
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        release_date: data.release_date,
        runtime: data.runtime,
        genres: data.genres || [],
        vote_average: data.vote_average,
        vote_count: data.vote_count,
        production_companies: data.production_companies || [],
        credits: {
          cast: (data.credits?.cast || []).slice(0, 50).map((c: any) => ({
            id: c.id,
            name: c.name,
            character: c.character,
            profile_path: c.profile_path || null,
          })),
        },
        recommendations: {
          results: data.recommendations?.results || [],
        },
      };

      return movie;
    }

    console.warn('TMDB client movie fetch failed, status:', resp.status);
  }

  // Fallback to Supabase function endpoint
  const response = await fetch(
    `https://txypbmtiddzurtjxjnyb.supabase.co/functions/v1/make-server-19aaa725/api/movie/${id}`,
    {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eXBibXRpZGR6dXJ0anhqbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjI1OTgsImV4cCI6MjA5NDA5ODU5OH0.V7S1_om13vI-QpLk3WFTXjiPv9OZ6-_PuQ-T4fJhQcY`
      }
    }
  );
  const data = await response.json();
  return data;
}

export async function fetchShowDetails(id: number): Promise<ShowDetails> {
  const clientRequest = buildTmdbRequest(`/tv/${id}?append_to_response=credits,recommendations,videos`);
  if ((import.meta as any).env?.VITE_TMDB_API_KEY) {
    const resp = await fetch(clientRequest.url, clientRequest.init);
    if (resp.ok) {
      const data = await resp.json();

      const show: ShowDetails = {
        id: data.id,
        name: data.name,
        overview: data.overview,
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        first_air_date: data.first_air_date,
        number_of_episodes: data.number_of_episodes,
        number_of_seasons: data.number_of_seasons,
        episode_run_time: data.episode_run_time || [],
        genres: data.genres || [],
        vote_average: data.vote_average,
        vote_count: data.vote_count,
        production_companies: data.production_companies || [],
        credits: {
          cast: (data.credits?.cast || []).slice(0, 50).map((c: any) => ({
            id: c.id,
            name: c.name,
            character: c.character,
            profile_path: c.profile_path || null,
          })),
        },
        recommendations: {
          results: data.recommendations?.results || [],
        },
      };

      return show;
    }

    console.warn('TMDB client show fetch failed, status:', resp.status);
  }

  const response = await fetch(
    `https://txypbmtiddzurtjxjnyb.supabase.co/functions/v1/make-server-19aaa725/api/show/${id}`,
    {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eXBibXRpZGR6dXJ0anhqbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjI1OTgsImV4cCI6MjA5NDA5ODU5OH0.V7S1_om13vI-QpLk3WFTXjiPv9OZ6-_PuQ-T4fJhQcY`
      }
    }
  );
  const data = await response.json();
  return data;
}
