// Service for fetching detailed information about anime/movies/shows

const ANILIST_URL = 'https://graphql.anilist.co';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

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
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
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
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
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
