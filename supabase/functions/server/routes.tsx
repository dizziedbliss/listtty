import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const routes = new Hono();

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

export default routes;
