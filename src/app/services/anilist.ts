// AniList API Service
// No API key required - public GraphQL endpoint

const ANILIST_URL = 'https://graphql.anilist.co';

export interface AniListMedia {
  id: number;
  title: {
    english: string | null;
    romaji: string;
  };
  coverImage: {
    large: string;
  };
  seasonYear: number | null;
  episodes: number | null;
  format: string;
}

const TRENDING_ANIME_QUERY = `
  query ($perPage: Int) {
    Page(perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
        seasonYear
        episodes
        format
      }
    }
  }
`;

const SEARCH_ANIME_QUERY = `
  query ($search: String, $perPage: Int) {
    Page(perPage: $perPage) {
      media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
        seasonYear
        episodes
        format
      }
    }
  }
`;

async function queryAniList(query: string, variables: Record<string, any>) {
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  return data.data?.Page?.media || [];
}

export async function fetchTrendingAnime(perPage: number = 20): Promise<AniListMedia[]> {
  return queryAniList(TRENDING_ANIME_QUERY, { perPage });
}

export async function searchAnime(search: string, perPage: number = 20): Promise<AniListMedia[]> {
  return queryAniList(SEARCH_ANIME_QUERY, { search, perPage });
}

export function getAnimeTitle(media: AniListMedia): string {
  return media.title.english || media.title.romaji;
}
