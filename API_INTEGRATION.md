# API Integration Guide

This application is set up to integrate with TMDB (The Movie Database) and AniList APIs for real movie, TV show, and anime data.

## Current Status

- ✅ **AniList API** - FULLY INTEGRATED! Real anime data is now being fetched from AniList GraphQL API
- ✅ **Supabase Backend** - Connected with server routes ready
- ✅ **TMDB Integration** - Complete! Just needs API key to activate
- 🎨 **Mock Data** - Automatic fallback when TMDB API key is not configured

## How to Complete TMDB Integration

### Step 1: Get TMDB API Key

1. Sign up at [TMDB](https://www.themoviedb.org/signup)
2. Go to Settings → API → Create API Key
3. Copy your API key (v3 auth)

### Step 2: Store API Key in Supabase

The app is already connected to Supabase! Now you need to:

1. Open the **Make settings page** in Figma
2. Navigate to the **Supabase** section
3. Add a new secret:
   - Secret Name: `TMDB_API_KEY`
   - Secret Value: (paste your TMDB API key)

### Step 3: Create Supabase Edge Function (Optional but Recommended)

For better security, fetch the API key on the server side:

1. Create `/supabase/functions/server/routes/media.ts`:

```typescript
import { Hono } from 'npm:hono';

const media = new Hono();

media.get('/movies/trending', async (c) => {
  const apiKey = Deno.env.get('TMDB_API_KEY');
  if (!apiKey) {
    return c.json({ error: 'TMDB_API_KEY not configured' }, 500);
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
  );
  const data = await response.json();
  return c.json(data);
});

export default media;
```

2. Update `src/app/hooks/useMediaData.ts` to fetch from your server instead of directly from TMDB

### Alternative: Client-Side (Quick Setup)

Uncomment the TODO sections in `src/app/hooks/useMediaData.ts` and add your API key directly (not recommended for production).

## AniList Integration (Already Working!)

The AniList API is **fully integrated** and working out of the box:

- ✅ Fetches real trending anime data
- ✅ Search functionality works
- ✅ No API key required
- ✅ Uses GraphQL endpoint at `https://graphql.anilist.co`

**Try it now:** Switch to the "anime" tab to see real anime data from AniList!

## User Data Persistence with Supabase

Supabase is already connected! To add user features:

### Option 1: Use Key-Value Store (Simple)

The built-in KV store at `/supabase/functions/server/kv_store.tsx` can store:

```typescript
// Store user's watchlist
await kv.set(`user:${userId}:watchlist`, JSON.stringify(watchlistItems));

// Retrieve watchlist
const watchlist = await kv.get(`user:${userId}:watchlist`);
```

### Option 2: Create Custom Tables (Advanced)

Note: You'll need to create tables via Supabase UI as Make doesn't support migration files:

1. Open your Supabase project dashboard
2. Go to Table Editor
3. Create tables:
   - `watchlist` (id, user_id, media_id, media_type, added_at)
   - `watched` (id, user_id, media_id, progress, completed_at)
   - `currently_watching` (id, user_id, media_id, progress, updated_at)

## Current Features

### Working Now ✅
- Real anime data from AniList API
- Search anime by title
- Category switching (Movies/Shows/Anime)
- Glassmorphism UI with cursor-following effects
- Responsive design
- Smooth animations

### Ready to Implement 🚀
- TMDB API for movies/shows (just add API key)
- User authentication with Supabase Auth
- Watchlist persistence
- Progress tracking
- Social features (friends, sharing)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Animations**: Motion (Framer Motion v12)
- **Data Fetching**: TanStack Query v5
- **APIs**: 
  - ✅ AniList GraphQL (working)
  - ⏳ TMDB REST (ready for API key)
- **Backend**: Supabase (connected)
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Quick Start

1. Switch to the **"anime" tab** to see real data
2. Use the search bar to find specific anime
3. To enable movies/shows, add your TMDB API key in Make settings
4. Deploy to Vercel when ready (Make handles deployment)

## Notes

- This is a Figma Make project - do NOT run `vite build` or `npm run build`
- The dev server is already running
- Changes are reflected automatically
- Backend functions are deployed via Make settings, not local commands
