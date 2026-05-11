# 🚀 Quick Setup Guide

## What's Already Working

✅ **Anime Tab** - Click on "anime" to see real data from AniList!  
✅ **Animations** - Cursor-following effects, glassmorphism, particles  
✅ **Search** - Works for all categories  
✅ **Backend** - Supabase connected and server routes deployed

## 🎬 Enable Real Movie & TV Data (Optional)

Currently, the Movies and TV Shows tabs use placeholder data. To enable real data from TMDB:

### Step 1: Get TMDB API Key (Free)

1. Go to [TMDB](https://www.themoviedb.org/signup) and create a free account
2. Navigate to: **Settings** → **API** → **Create** → **Developer**
3. Fill out the form (select "Website" or "Education")
4. Copy your **API Key (v3 auth)** - it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Step 2: Add API Key to Supabase

**Method 1: Via Figma Make Settings (Recommended)**
1. Open your Make file in Figma
2. Click the **Settings** icon (gear)
3. Go to **Supabase** → **Secrets**
4. Click **Add Secret**
5. Name: `TMDB_API_KEY`
6. Value: (paste your API key)
7. Click **Save**

**Method 2: Via Supabase Dashboard**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `txypbmtiddzurtjxjnyb`
3. Go to **Edge Functions** → **make-server-19aaa725**
4. Click **Secrets**
5. Add: `TMDB_API_KEY` = (your API key)

### Step 3: Deploy Server (if needed)

After adding the secret:
1. In Figma Make settings, go to **Supabase** → **Edge Functions**
2. Click **Deploy** on the `make-server-19aaa725` function
3. Wait for deployment to complete (~30 seconds)

### Step 4: Test It!

1. Switch to the **"movies"** or **"shows"** tab
2. You should now see real data from TMDB!
3. Try searching for your favorite movies

---

## 🎯 How It Works

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ Searches for "Inception"
       ▼
┌─────────────────────┐
│  Supabase Server    │
│  (Edge Function)    │
│                     │
│  Uses TMDB_API_KEY  │
│  from secrets       │
└──────┬──────────────┘
       │ Fetches from TMDB
       ▼
┌─────────────────────┐
│   TMDB API          │
│   (Movie Database)  │
└──────┬──────────────┘
       │ Returns movie data
       ▼
    Browser
    Displays results
```

**Why use the server?**
- ✅ API key stays secret (not exposed in browser)
- ✅ Better security
- ✅ Can cache results
- ✅ Automatic fallback to mock data if key is missing

---

## 💾 Add User Features (Optional)

The backend has routes ready for:

### Watchlist Storage
```typescript
// Save user's watchlist
POST /api/watchlist/:userId
{ "watchlist": [...items] }

// Get user's watchlist
GET /api/watchlist/:userId
```

### Progress Tracking
```typescript
// Save progress
POST /api/progress/:userId
{ "progress": { "movie-123": { "watched": true } } }

// Get progress
GET /api/progress/:userId
```

### Authentication
Add Supabase Auth to enable:
- Sign up / Login
- User profiles
- Persistent data across devices

---

## 🐛 Troubleshooting

**Movies/Shows still showing placeholder images?**
- Check that `TMDB_API_KEY` is added in Supabase secrets
- Verify the server function is deployed
- Check browser console for errors
- Try refreshing the page

**Search not working?**
- Make sure you're on the correct tab (anime/movies/shows)
- Anime search works immediately (no API key needed)
- Movie/Show search requires TMDB API key

**Backend not responding?**
- Check server health: `https://txypbmtiddzurtjxjnyb.supabase.co/functions/v1/make-server-19aaa725/health`
- Should return: `{"status":"ok"}`
- If not, redeploy the edge function

---

## 📝 Notes

- **Anime data** works immediately via AniList (no setup needed)
- **TMDB API** has a free tier with 1000+ requests/day
- **Mock data** is used automatically as fallback
- **Server routes** are already deployed and ready
- **Deploy to Vercel** when you're ready to share

Need help? Check the main README.md or API_INTEGRATION.md for more details!
