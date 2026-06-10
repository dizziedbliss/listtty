// @ts-nocheck
import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const routes = new Hono();
const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';
const ANILIST_OAUTH_TOKEN_URL = 'https://anilist.co/api/v2/oauth/token';

type AniListLinkRecord = {
  userId: string;
  username: string;
  avatar?: string;
  scoreFormat?: string;
  accessToken: string;
  refreshToken?: string;
  linkedAt: string;
  lastSyncedAt?: string;
};

type UserProfileRecord = {
  user_id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  updated_at: string;
};

type FriendRequestRecord = {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromAvatar?: string;
  toUserId: string;
  toUsername: string;
  createdAt: string;
};

type FriendListRecord = {
  userId: string;
  friendIds: string[];
};

async function anilistGraphQL(query: string, variables: Record<string, unknown>, accessToken?: string) {
  const response = await fetch(ANILIST_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AniList API error: ${response.status} ${errorText}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message || 'AniList GraphQL error');
  }

  return json.data;
}

function buildAniListRedirectUri() {
  return Deno.env.get('ANILIST_REDIRECT_URI')
    || `https://${Deno.env.get('PROJECT_ID') || 'txypbmtiddzurtjxjnyb'}.supabase.co/functions/v1/make-server-19aaa725/api/anilist/callback`;
}

function buildAniListAppRedirectUri() {
  return Deno.env.get('ANILIST_APP_REDIRECT_URI') || 'http://localhost:5173/profile?anilist=linked';
}

function toAniListStatus(listStatus?: string) {
  switch (listStatus) {
    case 'watching':
      return 'CURRENT';
    case 'completed':
      return 'COMPLETED';
    case 'dropped':
      return 'DROPPED';
    case 'watchlist':
    default:
      return 'PLANNING';
  }
}

function toAniListScore(rating: unknown, scoreFormat?: string) {
  const numericRating = typeof rating === 'number' ? rating : Number(rating);
  if (!Number.isFinite(numericRating)) {
    return undefined;
  }

  switch (scoreFormat) {
    case 'POINT_100':
      return Math.round(numericRating * 20);
    case 'POINT_10_DECIMAL':
    case 'POINT_10':
      return Number((numericRating * 2).toFixed(1));
    case 'POINT_3':
      return Number((numericRating * 0.6).toFixed(1));
    case 'POINT_5':
    default:
      return Number(numericRating.toFixed(1));
  }
}

async function getUserProfileRecord(userId: string): Promise<UserProfileRecord> {
  const existing = await kv.get(`users:profile:${userId}`) as UserProfileRecord | null;
  if (existing) {
    return existing;
  }

  const created: UserProfileRecord = {
    user_id: userId,
    username: userId,
    bio: '',
    avatar_url: '',
    email: '',
    updated_at: new Date().toISOString(),
  };
  await kv.set(`users:profile:${userId}`, created);
  return created;
}

async function getFriendList(userId: string): Promise<FriendListRecord> {
  const existing = await kv.get(`friends:list:${userId}`) as FriendListRecord | null;
  if (existing) {
    return { userId, friendIds: Array.isArray(existing.friendIds) ? existing.friendIds : [] };
  }

  const created = { userId, friendIds: [] };
  await kv.set(`friends:list:${userId}`, created);
  return created;
}

async function setFriendList(userId: string, friendIds: string[]) {
  await kv.set(`friends:list:${userId}`, { userId, friendIds });
}

async function getRequestsForUser(userId: string) {
  const incoming = await kv.get(`friends:incoming:${userId}`) as string[] | null;
  const ids = Array.isArray(incoming) ? incoming : [];
  const requestRecords = await Promise.all(ids.map(async (id) => kv.get(`friends:request:${id}`)));
  return requestRecords.filter(Boolean);
}

async function updateRequestQueues(request: FriendRequestRecord) {
  const incoming = (await kv.get(`friends:incoming:${request.toUserId}`)) as string[] | null;
  const outgoing = (await kv.get(`friends:outgoing:${request.fromUserId}`)) as string[] | null;

  await kv.set(`friends:incoming:${request.toUserId}`, [...new Set([...(incoming || []), request.id])]);
  await kv.set(`friends:outgoing:${request.fromUserId}`, [...new Set([...(outgoing || []), request.id])]);
  await kv.set(`friends:request:${request.id}`, request);
}

routes.get('/make-server-19aaa725/api/users/search', async (c) => {
  try {
    const query = (c.req.query('q') || '').trim().toLowerCase();
    if (!query) {
      return c.json([]);
    }

    const profiles = await kv.getByPrefix('users:profile:') as UserProfileRecord[];
    const results = profiles
      .filter((profile) => profile?.username?.toLowerCase().includes(query) || profile?.bio?.toLowerCase().includes(query))
      .slice(0, 20)
      .map((profile) => ({
        user_id: profile.user_id,
        username: profile.username,
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      }));

    return c.json(results);
  } catch (error) {
    console.error('Error searching users:', error);
    return c.json({ error: error.message, results: [] }, 500);
  }
});

routes.get('/make-server-19aaa725/api/users/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await getUserProfileRecord(userId);
    const friends = await getFriendList(userId);

    return c.json({
      ...profile,
      friends: friends.friendIds,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: error.message }, 500);
  }
});

routes.put('/make-server-19aaa725/api/users/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const body = await c.req.json();

    const profile: UserProfileRecord = {
      user_id: userId,
      username: body.username || userId,
      bio: body.bio || '',
      avatar_url: body.avatar_url || '',
      email: body.email || '',
      updated_at: new Date().toISOString(),
    };

    await kv.set(`users:profile:${userId}`, profile);
    return c.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return c.json({ error: error.message }, 500);
  }
});

routes.post('/make-server-19aaa725/api/friends/request', async (c) => {
  try {
    const body = await c.req.json();
    const fromUserId = body.fromUserId as string | undefined;
    const toUsername = body.toUsername as string | undefined;

    if (!fromUserId || !toUsername) {
      return c.json({ error: 'fromUserId and toUsername are required' }, 400);
    }

    const profiles = await kv.getByPrefix('users:profile:') as UserProfileRecord[];
    const target = profiles.find((profile) => profile.username.toLowerCase() === toUsername.toLowerCase());
    if (!target) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (target.user_id === fromUserId) {
      return c.json({ error: 'Cannot friend yourself' }, 400);
    }

    const sender = await getUserProfileRecord(fromUserId);
    const request: FriendRequestRecord = {
      id: crypto.randomUUID(),
      fromUserId,
      fromUsername: sender.username,
      fromAvatar: sender.avatar_url,
      toUserId: target.user_id,
      toUsername: target.username,
      createdAt: new Date().toISOString(),
    };

    await updateRequestQueues(request);
    return c.json(request);
  } catch (error) {
    console.error('Error sending friend request:', error);
    return c.json({ error: error.message }, 500);
  }
});

routes.get('/make-server-19aaa725/api/friends/requests/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const requests = await getRequestsForUser(userId);
    return c.json({ requests });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return c.json({ error: error.message, requests: [] }, 500);
  }
});

routes.post('/make-server-19aaa725/api/friends/request/:requestId/accept', async (c) => {
  try {
    const requestId = c.req.param('requestId');
    const request = await kv.get(`friends:request:${requestId}`) as FriendRequestRecord | null;

    if (!request) {
      return c.json({ error: 'Friend request not found' }, 404);
    }

    const fromFriends = await getFriendList(request.fromUserId);
    const toFriends = await getFriendList(request.toUserId);
    await setFriendList(request.fromUserId, [...new Set([...fromFriends.friendIds, request.toUserId])]);
    await setFriendList(request.toUserId, [...new Set([...toFriends.friendIds, request.fromUserId])]);

    const incoming = (await kv.get(`friends:incoming:${request.toUserId}`)) as string[] | null;
    const outgoing = (await kv.get(`friends:outgoing:${request.fromUserId}`)) as string[] | null;
    await kv.set(`friends:incoming:${request.toUserId}`, (incoming || []).filter((id) => id !== requestId));
    await kv.set(`friends:outgoing:${request.fromUserId}`, (outgoing || []).filter((id) => id !== requestId));
    await kv.del(`friends:request:${requestId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return c.json({ error: error.message, success: false }, 500);
  }
});

routes.post('/make-server-19aaa725/api/friends/request/:requestId/decline', async (c) => {
  try {
    const requestId = c.req.param('requestId');
    const request = await kv.get(`friends:request:${requestId}`) as FriendRequestRecord | null;

    if (!request) {
      return c.json({ error: 'Friend request not found' }, 404);
    }

    const incoming = (await kv.get(`friends:incoming:${request.toUserId}`)) as string[] | null;
    const outgoing = (await kv.get(`friends:outgoing:${request.fromUserId}`)) as string[] | null;
    await kv.set(`friends:incoming:${request.toUserId}`, (incoming || []).filter((id) => id !== requestId));
    await kv.set(`friends:outgoing:${request.fromUserId}`, (outgoing || []).filter((id) => id !== requestId));
    await kv.del(`friends:request:${requestId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error declining friend request:', error);
    return c.json({ error: error.message, success: false }, 500);
  }
});

routes.get('/make-server-19aaa725/api/friends/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const friends = await getFriendList(userId);
    const profiles = await Promise.all(friends.friendIds.map((friendId) => getUserProfileRecord(friendId)));

    return c.json({
      friends: profiles.map((profile) => ({
        user_id: profile.user_id,
        username: profile.username,
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      })),
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return c.json({ error: error.message, friends: [] }, 500);
  }
});

routes.post('/make-server-19aaa725/api/friends/remove', async (c) => {
  try {
    const body = await c.req.json();
    const userId1 = body.userId1 as string | undefined;
    const userId2 = body.userId2 as string | undefined;

    if (!userId1 || !userId2) {
      return c.json({ error: 'userId1 and userId2 are required' }, 400);
    }

    const list1 = await getFriendList(userId1);
    const list2 = await getFriendList(userId2);
    await setFriendList(userId1, list1.friendIds.filter((id) => id !== userId2));
    await setFriendList(userId2, list2.friendIds.filter((id) => id !== userId1));

    return c.json({ success: true });
  } catch (error) {
    console.error('Error removing friend:', error);
    return c.json({ error: error.message, success: false }, 500);
  }
});

// TMDB API Routes
routes.get("/make-server-19aaa725/api/movies/trending", async (c) => {
  try {
    const apiKey = Deno.env.get('TMDB_API_KEY');

    if (!apiKey) {
      console.log('TMDB_API_KEY not configured - using mock data');
      return c.json({
        results: [],
        error: 'TMDB_API_KEY not configured. Add it in Make settings to fetch real movie data.'
      });
    }

    const response = await fetch(
      'https://api.themoviedb.org/3/trending/movie/week',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error:', response.status, errorText);
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return c.json({ error: error.message, results: [] }, 500);
  }
});

routes.get("/make-server-19aaa725/api/shows/trending", async (c) => {
  try {
    const apiKey = Deno.env.get('TMDB_API_KEY');

    if (!apiKey) {
      console.log('TMDB_API_KEY not configured - using mock data');
      return c.json({
        results: [],
        error: 'TMDB_API_KEY not configured. Add it in Make settings to fetch real TV show data.'
      });
    }

    const response = await fetch(
      'https://api.themoviedb.org/3/trending/tv/week',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error:', response.status, errorText);
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Error fetching trending shows:', error);
    return c.json({ error: error.message, results: [] }, 500);
  }
});

routes.get("/make-server-19aaa725/api/search", async (c) => {
  try {
    const query = c.req.query('q');
    const type = c.req.query('type') || 'movie'; // movie, tv, or multi
    const apiKey = Deno.env.get('TMDB_API_KEY');

    if (!apiKey) {
      return c.json({
        results: [],
        error: 'TMDB_API_KEY not configured'
      });
    }

    if (!query) {
      return c.json({ results: [], error: 'Query parameter required' }, 400);
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API error:', response.status, errorText);
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Error searching:', error);
    return c.json({ error: error.message, results: [] }, 500);
  }
});

// Movie Details Route
routes.get("/make-server-19aaa725/api/movie/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const apiKey = Deno.env.get('TMDB_API_KEY');

    if (!apiKey) {
      return c.json({ error: 'TMDB_API_KEY not configured' }, 500);
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'accept': 'application/json'
    };

    // Fetch movie details
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}`, { headers }),
      fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, { headers })
    ]);

    if (!detailsRes.ok || !creditsRes.ok) {
      const errorText = await detailsRes.text();
      console.error('TMDB API error:', detailsRes.status, errorText);
      throw new Error('TMDB API error');
    }

    const details = await detailsRes.json();
    const credits = await creditsRes.json();

    return c.json({
      ...details,
      cast: credits.cast?.slice(0, 10) || []
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return c.json({ error: error.message }, 500);
  }
});

// TV Show Details Route
routes.get("/make-server-19aaa725/api/show/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const apiKey = Deno.env.get('TMDB_API_KEY');

    if (!apiKey) {
      return c.json({ error: 'TMDB_API_KEY not configured' }, 500);
    }

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'accept': 'application/json'
    };

    // Fetch show details
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/tv/${id}`, { headers }),
      fetch(`https://api.themoviedb.org/3/tv/${id}/credits`, { headers })
    ]);

    if (!detailsRes.ok || !creditsRes.ok) {
      const errorText = await detailsRes.text();
      console.error('TMDB API error:', detailsRes.status, errorText);
      throw new Error('TMDB API error');
    }

    const details = await detailsRes.json();
    const credits = await creditsRes.json();

    return c.json({
      ...details,
      cast: credits.cast?.slice(0, 10) || []
    });
  } catch (error) {
    console.error('Error fetching show details:', error);
    return c.json({ error: error.message }, 500);
  }
});

// User Data Routes (using KV store)
routes.get("/make-server-19aaa725/api/watchlist/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const watchlist = await kv.get(`user:${userId}:watchlist`);

    return c.json({
      watchlist: watchlist ? JSON.parse(watchlist) : []
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return c.json({ error: error.message, watchlist: [] }, 500);
  }
});

routes.post("/make-server-19aaa725/api/watchlist/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const body = await c.req.json();

    await kv.set(`user:${userId}:watchlist`, JSON.stringify(body.watchlist));

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving watchlist:', error);
    return c.json({ error: error.message, success: false }, 500);
  }
});

routes.get("/make-server-19aaa725/api/progress/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const progress = await kv.get(`user:${userId}:progress`);

    return c.json({
      progress: progress ? JSON.parse(progress) : {}
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return c.json({ error: error.message, progress: {} }, 500);
  }
});

routes.post("/make-server-19aaa725/api/progress/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const body = await c.req.json();

    await kv.set(`user:${userId}:progress`, JSON.stringify(body.progress));

    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    return c.json({ error: error.message, success: false }, 500);
  }
});

// Movie Recommendations Route
routes.get("/make-server-19aaa725/api/movie/:id/recommendations", async (c) => {
  try {
    const id = c.req.param('id');
    const apiKey = Deno.env.get('TMDB_API_KEY');

    if (!apiKey) {
      return c.json({ results: [] }, 200);
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return c.json({ results: [] }, 200);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    return c.json({ results: [] }, 200);
  }
});

// TV Show Recommendations Route
routes.get("/make-server-19aaa725/api/show/:id/recommendations", async (c) => {
  try {
    const id = c.req.param('id');
    const apiKey = Deno.env.get('TMDB_API_KEY');

    if (!apiKey) {
      return c.json({ results: [] }, 200);
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/recommendations`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return c.json({ results: [] }, 200);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Error fetching show recommendations:', error);
    return c.json({ results: [] }, 200);
  }
});

routes.get('/make-server-19aaa725/api/anilist/status/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const record = await kv.get(`anilist:${userId}:link`);

    return c.json({
      connected: Boolean(record),
      account: record ? JSON.parse(record) : null,
    });
  } catch (error) {
    console.error('Error fetching AniList status:', error);
    return c.json({ connected: false, account: null, error: error.message }, 500);
  }
});

routes.get('/make-server-19aaa725/api/anilist/auth-url', async (c) => {
  try {
    const clientId = c.req.query('clientId') || Deno.env.get('ANILIST_CLIENT_ID');
    const userId = c.req.query('userId');
    const redirectUriFromQuery = c.req.query('redirectUri');

    if (!clientId) {
      return c.json({ error: 'ANILIST_CLIENT_ID is not configured' }, 400);
    }

    if (!userId) {
      return c.json({ error: 'userId query parameter is required' }, 400);
    }

    const state = crypto.randomUUID();
    await kv.set(`anilist:state:${state}`, JSON.stringify({ userId, createdAt: new Date().toISOString() }));

    const redirectUri = redirectUriFromQuery || buildAniListRedirectUri();
    const authUrl = new URL('https://anilist.co/api/v2/oauth/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);

    return c.json({ authUrl: authUrl.toString(), state, redirectUri });
  } catch (error) {
    console.error('Error building AniList auth url:', error);
    return c.json({ error: error.message }, 500);
  }
});

routes.get('/make-server-19aaa725/api/anilist/callback', async (c) => {
  try {
    const code = c.req.query('code');
    const state = c.req.query('state');

    if (!code || !state) {
      return c.json({ error: 'Missing code or state' }, 400);
    }

    const stateRecord = await kv.get(`anilist:state:${state}`);
    if (!stateRecord) {
      return c.json({ error: 'Invalid or expired AniList state' }, 400);
    }

    const parsedState = JSON.parse(stateRecord) as { userId?: string };
    const userId = parsedState.userId;
    if (!userId) {
      return c.json({ error: 'AniList state is missing a userId' }, 400);
    }

    const clientId = Deno.env.get('ANILIST_CLIENT_ID');
    const clientSecret = Deno.env.get('ANILIST_CLIENT_SECRET');
    if (!clientId || !clientSecret) {
      return c.json({ error: 'AniList OAuth credentials are not configured' }, 500);
    }

    const redirectUri = buildAniListRedirectUri();
    const tokenResponse = await fetch(ANILIST_OAUTH_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`AniList token exchange failed: ${tokenResponse.status} ${errorText}`);
    }

    const tokenData = await tokenResponse.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
      token_type?: string;
    };

    const viewerData = await anilistGraphQL(
      `query ViewerInfo {
        Viewer {
          id
          name
          avatar {
            large
          }
          mediaListOptions {
            scoreFormat
          }
        }
      }`,
      {},
      tokenData.access_token,
    );

    const record: AniListLinkRecord = {
      userId,
      username: viewerData.Viewer?.name || 'AniList user',
      avatar: viewerData.Viewer?.avatar?.large,
      scoreFormat: viewerData.Viewer?.mediaListOptions?.scoreFormat,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      linkedAt: new Date().toISOString(),
      lastSyncedAt: undefined,
    };

    await kv.set(`anilist:${userId}:link`, JSON.stringify(record));
    await kv.delete(`anilist:state:${state}`);

    return Response.redirect(buildAniListAppRedirectUri(), 302);
  } catch (error) {
    console.error('Error handling AniList callback:', error);
    return c.json({ error: error.message }, 500);
  }
});

routes.delete('/make-server-19aaa725/api/anilist/link/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    await kv.delete(`anilist:${userId}:link`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error unlinking AniList account:', error);
    return c.json({ error: error.message, success: false }, 500);
  }
});

routes.post('/make-server-19aaa725/api/anilist/import/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const recordText = await kv.get(`anilist:${userId}:link`);

    if (!recordText) {
      return c.json({ error: 'AniList account is not linked' }, 401);
    }

    const record = JSON.parse(recordText) as AniListLinkRecord;
    const data = await anilistGraphQL(
      `query ImportLibrary {
        Viewer {
          id
          name
          avatar {
            large
          }
        }
        MediaListCollection(type: ANIME) {
          lists {
            name
            entries {
              id
              status
              progress
              score
              updatedAt
              media {
                id
                title {
                  romaji
                  english
                  native
                }
                format
                status
                episodes
                duration
                seasonYear
                genres
                coverImage {
                  extraLarge
                  large
                }
                siteUrl
              }
            }
          }
        }
      }`,
      {},
      record.accessToken,
    );

    const lists = (data.MediaListCollection?.lists || []).flatMap((list: { name?: string; entries?: Array<Record<string, unknown>> }) => {
      return (list.entries || []).map((entry) => {
        const media = entry.media as Record<string, unknown> | undefined;
        const title = media?.title as Record<string, string> | undefined;
        const coverImage = media?.coverImage as Record<string, string> | undefined;

        return {
          listName: list.name,
          id: media?.id,
          title: title?.english || title?.romaji || title?.native || 'Untitled',
          status: entry.status,
          progress: entry.progress,
          score: entry.score,
          updatedAt: entry.updatedAt,
          format: media?.format,
          episodes: media?.episodes,
          seasonYear: media?.seasonYear,
          genres: media?.genres || [],
          coverImage: coverImage?.extraLarge || coverImage?.large,
          siteUrl: media?.siteUrl,
        };
      });
    });

    return c.json({
      viewer: data.Viewer,
      lists,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error importing AniList library:', error);
    return c.json({ error: error.message, lists: [] }, 500);
  }
});

routes.post('/make-server-19aaa725/api/anilist/sync/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const recordText = await kv.get(`anilist:${userId}:link`);

    if (!recordText) {
      return c.json({ error: 'AniList account is not linked' }, 401);
    }

    const record = JSON.parse(recordText) as AniListLinkRecord;
    const body = await c.req.json().catch(() => ({}));
    const lists = Array.isArray(body.lists) ? body.lists : [];

    const operations = lists.flatMap((list: { status?: string; items?: Array<Record<string, unknown>> }) => {
      return (list.items || []).map((item) => ({
        mediaId: item.id,
        status: toAniListStatus(list.status),
        progress: item.progress,
        score: toAniListScore(item.rating, record.scoreFormat),
      }));
    }).filter((item) => item.mediaId);

    const results: Array<{ mediaId: number; success: boolean; error?: string }> = [];

    for (const operation of operations) {
      try {
        await anilistGraphQL(
          `mutation SaveMediaListEntry($mediaId: Int, $status: MediaListStatus, $progress: Int, $score: Float) {
            SaveMediaListEntry(mediaId: $mediaId, status: $status, progress: $progress, score: $score) {
              id
              mediaId
              status
              progress
              score
            }
          }`,
          {
            mediaId: operation.mediaId,
            status: operation.status,
            progress: operation.progress ?? undefined,
            score: operation.score ?? undefined,
          },
          record.accessToken,
        );

        results.push({ mediaId: Number(operation.mediaId), success: true });
      } catch (error) {
        results.push({ mediaId: Number(operation.mediaId), success: false, error: error.message });
      }
    }

    const updatedRecord: AniListLinkRecord = {
      ...record,
      lastSyncedAt: new Date().toISOString(),
    };
    await kv.set(`anilist:${userId}:link`, JSON.stringify(updatedRecord));

    return c.json({
      success: true,
      syncedAt: updatedRecord.lastSyncedAt,
      results,
    });
  } catch (error) {
    console.error('Error syncing AniList library:', error);
    return c.json({ error: error.message, success: false }, 500);
  }
});

export default routes;
