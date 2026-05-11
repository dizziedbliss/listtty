# TMDB API Reference — A to Z Index

Source: https://developer.themoviedb.org/reference/

This document is an organized A–Z style index of the major TMDB v3 API reference sections and commonly used endpoints.

---

# A

## Account
- `GET /account/{account_id}` — Get account details
- `GET /account/{account_id}/favorite/movies`
- `GET /account/{account_id}/favorite/tv`
- `POST /account/{account_id}/favorite`
- `GET /account/{account_id}/lists`
- `GET /account/{account_id}/rated/movies`
- `GET /account/{account_id}/rated/tv`
- `GET /account/{account_id}/watchlist/movies`
- `GET /account/{account_id}/watchlist/tv`
- `POST /account/{account_id}/watchlist`

## Authentication
- `GET /authentication`
- `GET /authentication/token/new`
- `POST /authentication/token/validate_with_login`
- `POST /authentication/session/new`
- `DELETE /authentication/session`
- `POST /authentication/guest_session/new`

---

# C

## Certifications
- `GET /certification/movie/list`
- `GET /certification/tv/list`

## Changes
- `GET /movie/changes`
- `GET /tv/changes`
- `GET /person/changes`

## Collections
- `GET /collection/{collection_id}`
- `GET /collection/{collection_id}/images`
- `GET /collection/{collection_id}/translations`

## Companies
- `GET /company/{company_id}`
- `GET /company/{company_id}/alternative_names`
- `GET /company/{company_id}/images`

## Configuration
- `GET /configuration`
- `GET /configuration/countries`
- `GET /configuration/jobs`
- `GET /configuration/languages`
- `GET /configuration/primary_translations`
- `GET /configuration/timezones`

## Credits
- `GET /credit/{credit_id}`

---

# D

## Discover

### Movies
- `GET /discover/movie`

### TV Shows
- `GET /discover/tv`

---

# F

## Find
- `GET /find/{external_id}`

---

# G

## Genres
- `GET /genre/movie/list`
- `GET /genre/tv/list`

## Guest Sessions
- `GET /guest_session/{guest_session_id}/rated/movies`
- `GET /guest_session/{guest_session_id}/rated/tv`
- `GET /guest_session/{guest_session_id}/rated/tv/episodes`

---

# K

## Keywords
- `GET /keyword/{keyword_id}`
- `GET /keyword/{keyword_id}/movies`

---

# L

## Lists
- `GET /list/{list_id}`
- `POST /list`
- `DELETE /list/{list_id}`
- `POST /list/{list_id}/add_item`
- `POST /list/{list_id}/remove_item`
- `POST /list/{list_id}/clear`

---

# M

## Movies

### Details & Metadata
- `GET /movie/{movie_id}`
- `GET /movie/{movie_id}/account_states`
- `GET /movie/{movie_id}/alternative_titles`
- `GET /movie/{movie_id}/changes`
- `GET /movie/{movie_id}/credits`
- `GET /movie/{movie_id}/external_ids`
- `GET /movie/{movie_id}/images`
- `GET /movie/{movie_id}/keywords`
- `GET /movie/{movie_id}/lists`
- `GET /movie/{movie_id}/recommendations`
- `GET /movie/{movie_id}/release_dates`
- `GET /movie/{movie_id}/reviews`
- `GET /movie/{movie_id}/similar`
- `GET /movie/{movie_id}/translations`
- `GET /movie/{movie_id}/videos`
- `GET /movie/{movie_id}/watch/providers`

### Ratings & User Actions
- `POST /movie/{movie_id}/rating`
- `DELETE /movie/{movie_id}/rating`

### Popular Lists
- `GET /movie/latest`
- `GET /movie/now_playing`
- `GET /movie/popular`
- `GET /movie/top_rated`
- `GET /movie/upcoming`

---

# N

## Networks
- `GET /network/{network_id}`
- `GET /network/{network_id}/alternative_names`
- `GET /network/{network_id}/images`

---

# P

## People

### Details & Metadata
- `GET /person/{person_id}`
- `GET /person/{person_id}/changes`
- `GET /person/{person_id}/combined_credits`
- `GET /person/{person_id}/external_ids`
- `GET /person/{person_id}/images`
- `GET /person/{person_id}/movie_credits`
- `GET /person/{person_id}/tv_credits`
- `GET /person/{person_id}/translations`

### Popular Lists
- `GET /person/popular`
- `GET /person/latest`

---

# R

## Reviews
- `GET /review/{review_id}`

---

# S

## Search

### Search Endpoints
- `GET /search/movie`
- `GET /search/tv`
- `GET /search/person`
- `GET /search/company`
- `GET /search/collection`
- `GET /search/keyword`
- `GET /search/multi`

---

# T

## Trending
- `GET /trending/all/day`
- `GET /trending/all/week`
- `GET /trending/movie/day`
- `GET /trending/movie/week`
- `GET /trending/tv/day`
- `GET /trending/tv/week`
- `GET /trending/person/day`
- `GET /trending/person/week`

## TV Shows

### Details & Metadata
- `GET /tv/{series_id}`
- `GET /tv/{series_id}/account_states`
- `GET /tv/{series_id}/aggregate_credits`
- `GET /tv/{series_id}/alternative_titles`
- `GET /tv/{series_id}/changes`
- `GET /tv/{series_id}/content_ratings`
- `GET /tv/{series_id}/credits`
- `GET /tv/{series_id}/episode_groups`
- `GET /tv/{series_id}/external_ids`
- `GET /tv/{series_id}/images`
- `GET /tv/{series_id}/keywords`
- `GET /tv/{series_id}/recommendations`
- `GET /tv/{series_id}/reviews`
- `GET /tv/{series_id}/screened_theatrically`
- `GET /tv/{series_id}/similar`
- `GET /tv/{series_id}/translations`
- `GET /tv/{series_id}/videos`
- `GET /tv/{series_id}/watch/providers`

### Ratings
- `POST /tv/{series_id}/rating`
- `DELETE /tv/{series_id}/rating`

### Popular Lists
- `GET /tv/airing_today`
- `GET /tv/on_the_air`
- `GET /tv/popular`
- `GET /tv/top_rated`
- `GET /tv/latest`

---

# TV EPISODES

## Episode Details
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}`
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/credits`
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids`
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/images`
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/translations`
- `GET /tv/{series_id}/season/{season_number}/episode/{episode_number}/videos`

## Episode Ratings
- `POST /tv/{series_id}/season/{season_number}/episode/{episode_number}/rating`
- `DELETE /tv/{series_id}/season/{season_number}/episode/{episode_number}/rating`

---

# TV SEASONS

## Season Details
- `GET /tv/{series_id}/season/{season_number}`
- `GET /tv/{series_id}/season/{season_number}/account_states`
- `GET /tv/{series_id}/season/{season_number}/aggregate_credits`
- `GET /tv/{series_id}/season/{season_number}/changes`
- `GET /tv/{series_id}/season/{season_number}/credits`
- `GET /tv/{series_id}/season/{season_number}/external_ids`
- `GET /tv/{series_id}/season/{season_number}/images`
- `GET /tv/{series_id}/season/{season_number}/translations`
- `GET /tv/{series_id}/season/{season_number}/videos`

---

# W

## Watch Providers
- `GET /watch/providers/movie`
- `GET /watch/providers/tv`
- `GET /watch/providers/movie/{watch_provider_id}`
- `GET /watch/providers/tv/{watch_provider_id}`

---

# Useful Query Parameters

## Common Parameters
- `language=en-US`
- `page=1`
- `region=US`
- `append_to_response=videos,images,credits`

## Discover Filters
- `with_genres`
- `with_cast`
- `with_crew`
- `vote_average.gte`
- `vote_count.gte`
- `primary_release_date.gte`
- `sort_by=popularity.desc`

---

# Common Base URLs

## API Base URL
```bash
https://api.themoviedb.org/3
```

## Image Base URL
```bash
https://image.tmdb.org/t/p/
```

Example:
```bash
https://image.tmdb.org/t/p/w500/abc.jpg
```

---

# Authentication Example

```js
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer YOUR_ACCESS_TOKEN'
  }
}
```

---

# Most Useful Endpoints for Web Apps

## Homepage Content
- `/trending/all/day`
- `/movie/popular`
- `/tv/top_rated`
- `/movie/upcoming`

## Search
- `/search/multi`

## Netflix-style Details Page
- `/movie/{id}?append_to_response=videos,images,credits,recommendations`

## Anime Discovery
- `/discover/tv?with_genres=16`

---

# Notes

- TMDB API uses Bearer Token authentication.
- Responses are JSON.
- Pagination starts at page 1.
- `append_to_response` is extremely useful for optimization.
- Rate limits exist but are generous for personal projects.
- TMDB requires attribution in apps using their data.

---

Official Docs:
https://developer.themoviedb.org/reference/

