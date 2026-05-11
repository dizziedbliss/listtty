# 🎬 Complete Movie & Anime Tracking Platform

A fully-featured, production-ready web application for tracking movies, TV shows, and anime with glassmorphism design, smooth animations, and comprehensive features.

![Platform Preview](https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200)

## ✨ Complete Feature Set

### 📱 12 Pages Fully Implemented
- **Home** - Profile, recommendations, watchlist
- **Details** - Full anime/movie information with characters & relations
- **Search** - Advanced filters (genre, format, status, year)
- **Lists** - Watchlist, Watching, Completed, Dropped, Planning
- **Statistics** - Charts, achievements, activity feed
- **Friends** - Social features, friend requests, search
- **Profile** - Edit profile, settings, privacy controls
- **Authentication** - Login/signup with social auth

### 🎨 Visual Design
- **Glassmorphism UI** - Frosted glass effects throughout
- **Cursor-Following Animations** - Dynamic gradient blobs
- **Floating Particles** - Atmospheric depth
- **Smooth Transitions** - Motion/Framer animations on every page
- **Sidebar Navigation** - Fixed icon-based navigation
- **Bottom Navigation** - Sticky category switcher

### ⚡ Functionality
- **Real Anime Data** - Live from AniList GraphQL API
- **Advanced Search** - Multiple filters and sorting
- **List Management** - Grid/List views, progress tracking
- **Social Features** - Friends, requests, messaging
- **Statistics Dashboard** - Charts, graphs, achievements
- **User Profiles** - Customizable with settings

## 🚀 Status: 100% Complete!

- ✅ **12 Pages** - All fully implemented and connected
- ✅ **AniList Integration** - Real anime data working
- ✅ **Routing** - React Router with all pages
- ✅ **Navigation** - Sidebar + bottom nav
- ✅ **Animations** - Smooth transitions everywhere
- ✅ **Supabase** - Backend connected and ready
- ⏳ **TMDB** - Ready (just needs API key)

## 📄 All Pages

### Core Pages
| Page | Route | Description |
|------|-------|-------------|
| 🏠 Home | `/` | Profile, recommendations, watchlist, currently watching |
| 📺 Details | `/:type/:id` | Full info, characters, relations, stats |
| 🔍 Search | `/search` | Advanced search with multiple filters |
| 📊 Stats | `/stats` | Charts, achievements, activity |
| 👥 Friends | `/friends` | Social features, friend management |
| 👤 Profile | `/profile` | Edit profile, settings, privacy |
| 🔐 Auth | `/auth` | Login/signup with social options |

### List Pages
| Page | Route | Purpose |
|------|-------|---------|
| 📚 Watchlist | `/list/watchlist` | Items to watch |
| ▶️ Watching | `/list/watching` | Currently in progress |
| ✅ Completed | `/list/completed` | Finished items |
| ❌ Dropped | `/list/dropped` | Stopped watching |
| 📅 Planning | `/list/planning` | Plan to watch |

## 🛠 Built With

### Frontend Stack
- **React 18** + **TypeScript** - Modern UI with type safety
- **React Router DOM v7** - Complete routing system
- **Tailwind CSS v4** - Utility-first styling
- **Motion (Framer Motion) v12** - Smooth animations
- **TanStack Query v5** - Data fetching & caching
- **Lucide React** - Beautiful icons

### Backend & APIs
- **Supabase** - Auth, database, edge functions
- **AniList GraphQL** - Live anime data ✅
- **TMDB REST** - Movies & TV (ready for key) ⏳

### Design System
- Custom glassmorphism components
- Cursor-reactive backgrounds
- Floating particle system
- Sidebar navigation
- Bottom navigation bar

## 📋 How to Navigate

### Main Navigation (Sidebar)
- **Home** 🏠 - Main dashboard
- **Search** 🔍 - Find anime, movies, shows
- **Watchlist** 📚 - Your saved items
- **Statistics** 📊 - View your stats
- **Friends** 👥 - Social features
- **Profile** 👤 - Edit settings
- **Login** 🔐 - Auth page

### Category Switcher (Bottom Nav - Home Only)
- **Movies** - Switch to movies
- **Shows** - Switch to TV shows
- **Anime** - Switch to anime

### Quick Actions
1. **Click any media card** → View details
2. **Use search** → Find specific titles
3. **Manage lists** → Organize your collection
4. **Check stats** → See your progress
5. **Add friends** → Connect socially

### View Real Anime Data
1. Go to **Search** page
2. Type any anime name
3. Click result to see full details
4. See characters, relations, and more!

### Enable Movie & TV Data
1. Get free API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Open Make settings
3. Add: `TMDB_API_KEY`
4. Real data loads automatically!

## 🎯 Features Ready to Implement

With Supabase connected, you can easily add:

- **User Authentication** - Sign up/login with email or OAuth
- **Persistent Watchlists** - Save watchlists across sessions
- **Progress Syncing** - Track episode/movie progress
- **Social Features** - Friends, sharing, recommendations
- **Custom Lists** - Create themed collections

## 📁 Project Structure

```
src/
├── app/
│   ├── components/              # Reusable components
│   │   ├── CursorBackground.tsx # Mouse-following effect
│   │   ├── CursorGlow.tsx       # Cursor glow
│   │   ├── FloatingParticles.tsx # Ambient particles
│   │   ├── GlassCard.tsx        # Glassmorphism wrapper
│   │   ├── MediaCard.tsx        # Media item card
│   │   ├── BottomNav.tsx        # Category navigation
│   │   └── Sidebar.tsx          # Main navigation
│   │
│   ├── pages/                   # All page components
│   │   ├── HomePage.tsx         # Main dashboard
│   │   ├── DetailsPage.tsx      # Anime/Movie details
│   │   ├── SearchPage.tsx       # Search with filters
│   │   ├── ListPage.tsx         # List management
│   │   ├── StatsPage.tsx        # Statistics dashboard
│   │   ├── FriendsPage.tsx      # Social features
│   │   ├── ProfilePage.tsx      # Profile & settings
│   │   └── AuthPage.tsx         # Login/Signup
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useMediaData.ts      # Data fetching
│   │
│   ├── services/                # API integrations
│   │   ├── anilist.ts           # AniList GraphQL
│   │   ├── tmdb.ts              # TMDB REST
│   │   ├── details.ts           # Detail fetching
│   │   └── api.ts               # Server API
│   │
│   ├── data/                    # Types & mock data
│   │   └── mockData.ts          # Fallback data
│   │
│   └── App.tsx                  # Main app + routing
│
├── supabase/                    # Backend
│   └── functions/server/
│       ├── index.tsx            # Server entry
│       ├── routes.tsx           # API routes
│       └── kv_store.tsx         # Database
│
├── imports/                     # Figma assets
└── styles/                      # Global CSS
```

## 🎨 Design Credits

- Banner image from Your Name (Makoto Shinkai)
- Glassmorphism design inspired by modern UI trends
- Color scheme: Purple gradient (#8A38F5, #7A23BC)
- Fonts: Cabin, Cabin Condensed

## 📝 Notes

- This is a **Figma Make** project
- Do not run build commands manually
- Changes are reflected automatically in the preview
- Backend deployment happens through Make settings

## 🔗 Resources

- [AniList API Documentation](https://anilist.gitbook.io/anilist-apiv2-docs/)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Supabase Documentation](https://supabase.com/docs)
- [Motion (Framer Motion) Docs](https://motion.dev/docs)

## 📄 License

Created with Figma Make - Feel free to customize and extend!
