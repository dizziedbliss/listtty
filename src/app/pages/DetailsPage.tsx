import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Plus, Star, Check } from 'lucide-react';
import { fetchAnimeDetails, fetchMovieDetails, fetchShowDetails, AnimeDetails, MovieDetails, ShowDetails } from '../services/details';
import { useList, ListType } from '../contexts/ListContext';
import { ListDropdown } from '../components/ListDropdown';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

export function DetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  const { data: details, isLoading, error } = useQuery({
    queryKey: ['details', type, id],
    queryFn: async () => {
      if (type === 'anime') {
        return { type: 'anime', data: await fetchAnimeDetails(Number(id)) };
      } else if (type === 'movie') {
        return { type: 'movie', data: await fetchMovieDetails(Number(id)) };
      } else if (type === 'show') {
        return { type: 'show', data: await fetchShowDetails(Number(id)) };
      }
      throw new Error('Invalid media type');
    },
    enabled: !!id && !!type,
  });

  // Fetch recommendations for movies/shows
  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', type, id],
    queryFn: async () => {
      if (type === 'movie' || type === 'show') {
        const response = await fetch(
          `https://txypbmtiddzurtjxjnyb.supabase.co/functions/v1/make-server-19aaa725/api/${type}/${id}/recommendations`,
          {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eXBibXRpZGR6dXJ0anhqbnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjI1OTgsImV4cCI6MjA5NDA5ODU5OH0.V7S1_om13vI-QpLk3WFTXjiPv9OZ6-_PuQ-T4fJhQcY`
            }
          }
        );
        const data = await response.json();
        return data.results || [];
      }
      return [];
    },
    enabled: !!id && (type === 'movie' || type === 'show'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1622]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!details || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1622]">
        <div className="text-white text-2xl">
          {error ? 'Error loading details. Make sure the server is deployed.' : 'Not found'}
        </div>
      </div>
    );
  }

  // Render based on type
  if (details.type === 'anime') {
    const anime = details.data as AnimeDetails;
    const title = anime.title.english || anime.title.romaji;

    return (
      <div className="min-h-screen bg-[#0b1622] text-white pb-32">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/')}
          className="fixed top-6 left-6 z-50 bg-[rgba(138,56,245,0.3)] hover:bg-[rgba(138,56,245,0.5)] backdrop-blur-md border-2 border-white/20 rounded-full p-3 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

      {/* Banner */}
      <div className="relative h-[400px] w-full">
        {anime.bannerImage ? (
          <img
            src={anime.bannerImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: anime.coverImage.color
                ? `linear-gradient(180deg, ${anime.coverImage.color}40 0%, #0b1622 100%)`
                : 'linear-gradient(180deg, rgba(138,56,245,0.3) 0%, #0b1622 100%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1622] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 -mt-32 relative z-10">
        <div className="flex gap-8">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0"
          >
            <img
              src={anime.coverImage.extraLarge}
              alt={title}
              className="w-[230px] h-[330px] object-cover rounded-lg shadow-2xl"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold mb-4"
              style={{ fontFamily: 'Cabin' }}
            >
              {title}
            </motion.h1>

            {anime.title.romaji !== title && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 mb-2"
              >
                {anime.title.romaji}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mb-6"
            >
              <ListDropdown
                itemId={anime.id}
                itemType="anime"
                title={title}
                poster={anime.coverImage.large}
                year={anime.seasonYear?.toString()}
                episodes={anime.episodes || undefined}
              />
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-4 gap-3 mb-6"
            >
              {anime.averageScore && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-yellow-400 mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xl font-bold">{anime.averageScore}%</span>
                  </div>
                  <p className="text-xs text-gray-400">Score</p>
                </div>
              )}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                <p className="text-xl font-bold mb-1">{anime.format}</p>
                <p className="text-xs text-gray-400">Format</p>
              </div>
              {anime.episodes && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                  <p className="text-xl font-bold mb-1">{anime.episodes}</p>
                  <p className="text-xs text-gray-400">Episodes</p>
                </div>
              )}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                <p className="text-xl font-bold mb-1">{anime.status}</p>
                <p className="text-xs text-gray-400">Status</p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-3">Description</h2>
              <div
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: anime.description?.replace(/<br>/g, '<br/>') || 'No description available.',
                }}
              />
            </motion.div>

            {/* Genres */}
            {anime.genres.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <h2 className="text-xl font-semibold mb-3">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Studios */}
            {anime.studios.nodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-6"
              >
                <h2 className="text-xl font-semibold mb-3">Studios</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.nodes.map((studio, i) => (
                    <span
                      key={i}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Characters */}
        {anime.characters.edges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-semibold mb-4">Characters</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {anime.characters.edges.slice(0, 12).map((edge) => (
                <div
                  key={edge.node.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:scale-105 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <img
                    src={edge.node.image.large}
                    alt={edge.node.name.full}
                    className="w-full h-[180px] object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-2.5">
                    <p className="font-semibold text-xs truncate">{edge.node.name.full}</p>
                    <p className="text-[10px] text-gray-400">{edge.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Relations */}
        {anime.relations.edges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-semibold mb-4">Related</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {anime.relations.edges.slice(0, 6).map((edge) => (
                <div
                  key={edge.node.id}
                  onClick={() => navigate(`/anime/${edge.node.id}`)}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:scale-105 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <img
                    src={edge.node.coverImage.large}
                    alt={edge.node.title.romaji}
                    className="w-full h-[160px] object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-2.5">
                    <p className="text-[10px] text-purple-400 mb-0.5 uppercase tracking-wide">{edge.relationType}</p>
                    <p className="font-semibold text-xs line-clamp-2">{edge.node.title.romaji}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
    );
  }

  // Movie or Show Details
  const isMovie = details.type === 'movie';
  const media = details.data as MovieDetails | ShowDetails;
  const title = isMovie ? (media as MovieDetails).title : (media as ShowDetails).name;
  const releaseDate = isMovie ? (media as MovieDetails).release_date : (media as ShowDetails).first_air_date;
  const runtime = isMovie ? (media as MovieDetails).runtime : (media as ShowDetails).episode_run_time?.[0];

  return (
    <div className="min-h-screen bg-[#0b1622] text-white pb-32">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 bg-[rgba(138,56,245,0.3)] hover:bg-[rgba(138,56,245,0.5)] backdrop-blur-md border-2 border-white/20 rounded-full p-3 transition-all"
      >
        <ArrowLeft className="w-6 h-6" />
      </motion.button>

      {/* Banner */}
      <div className="relative h-[400px] w-full">
        {media.backdrop_path ? (
          <img
            src={`${TMDB_IMAGE_BASE}${media.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-purple-900/50 to-[#0b1622]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1622] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 -mt-32 relative z-10">
        <div className="flex gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0"
          >
            <img
              src={media.poster_path ? `${TMDB_IMAGE_BASE}${media.poster_path}` : 'https://via.placeholder.com/230x330?text=No+Poster'}
              alt={title}
              className="w-[230px] h-[330px] object-cover rounded-lg shadow-2xl"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold mb-4"
              style={{ fontFamily: 'Cabin' }}
            >
              {title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mb-6"
            >
              <ListDropdown
                itemId={Number(id)}
                itemType={isMovie ? 'movie' : 'show'}
                title={title}
                poster={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : ''}
                year={releaseDate?.split('-')[0]}
                episodes={!isMovie ? (media as ShowDetails).number_of_episodes : undefined}
              />
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-4 gap-3 mb-6"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-yellow-400 mb-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xl font-bold">{media.vote_average?.toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                <p className="text-xl font-bold mb-1">{releaseDate?.split('-')[0] || 'N/A'}</p>
                <p className="text-xs text-gray-400">Year</p>
              </div>
              {runtime && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                  <p className="text-xl font-bold mb-1">{runtime} min</p>
                  <p className="text-xs text-gray-400">Runtime</p>
                </div>
              )}
              {!isMovie && (media as ShowDetails).number_of_seasons && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                  <p className="text-xl font-bold mb-1">{(media as ShowDetails).number_of_seasons}</p>
                  <p className="text-xs text-gray-400">Seasons</p>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{media.overview || 'No overview available.'}</p>
            </motion.div>

            {/* Genres */}
            {media.genres && media.genres.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <h2 className="text-xl font-semibold mb-3">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Production */}
            {media.production_companies && media.production_companies.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-6"
              >
                <h2 className="text-xl font-semibold mb-3">Production</h2>
                <div className="flex flex-wrap gap-2">
                  {media.production_companies.slice(0, 3).map((company) => (
                    <span
                      key={company.id}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                    >
                      {company.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Cast */}
        {media.cast && media.cast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-semibold mb-4">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {media.cast.slice(0, 12).map((actor) => (
                <div
                  key={actor.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:scale-105 hover:border-white/20 transition-all group"
                >
                  {actor.profile_path ? (
                    <img
                      src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-[180px] object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-[180px] bg-white/5 flex items-center justify-center text-gray-600 text-xs">
                      No Photo
                    </div>
                  )}
                  <div className="p-2.5">
                    <p className="font-semibold text-xs truncate">{actor.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-semibold mb-4">Recommended</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {recommendations.slice(0, 6).map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/${type}/${item.id}`)}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:scale-105 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <img
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Poster'}
                    alt={isMovie ? item.title : item.name}
                    className="w-full h-[160px] object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="p-2.5">
                    <p className="font-semibold text-xs line-clamp-2">{isMovie ? item.title : item.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] text-gray-400">{item.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
