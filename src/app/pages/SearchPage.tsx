import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchAnime } from '../services/anilist';
import { MediaItem } from '../data/mockData';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query) return [];
      const data = await searchAnime(query);
      return data.map((anime): MediaItem => ({
        id: anime.id,
        title: anime.title.english || anime.title.romaji,
        poster: anime.coverImage.large,
        year: anime.seasonYear?.toString() || 'N/A',
        type: 'anime',
      }));
    },
    enabled: query.length > 0,
  });

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life'];
  const formats = ['TV', 'Movie', 'OVA', 'ONA', 'Special'];
  const statuses = ['Finished', 'Releasing', 'Not Yet Released', 'Cancelled'];
  const years = Array.from({ length: 30 }, (_, i) => (2024 - i).toString());

  const handleSearch = () => {
    if (query) {
      setSearchParams({ q: query });
    }
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-[1400px] mx-auto px-8 pt-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Cabin' }}
          >
            Search
          </motion.h1>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search anime, movies, or shows..."
                className="w-full bg-[rgba(138,56,245,0.2)] backdrop-blur-md border-2 border-white/20 rounded-lg pl-14 pr-4 py-4 text-white text-xl placeholder-white/60 outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-[rgba(138,56,245,0.2)] hover:bg-[rgba(138,56,245,0.3)] backdrop-blur-md border-2 border-white/20 text-white px-6 py-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Filters</h3>
              <button
                onClick={() => {
                  setSelectedGenres([]);
                  setSelectedFormat('');
                  setSelectedStatus('');
                  setSelectedYear('');
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Genres */}
              <div>
                <label className="block text-white font-semibold mb-3">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        selectedGenres.includes(genre)
                          ? 'bg-purple-600 text-white'
                          : 'bg-[rgba(138,56,245,0.2)] text-gray-300 hover:bg-[rgba(138,56,245,0.3)]'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-white font-semibold mb-3">Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500"
                >
                  <option value="">All Formats</option>
                  {formats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-white font-semibold mb-3">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500"
                >
                  <option value="">All Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-white font-semibold mb-3">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white mt-4">Searching...</p>
            </div>
          ) : query && results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400">No results found for "{query}"</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <p className="text-gray-400 mb-6">{results.length} results found</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {results.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/anime/${item.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3 aspect-[2/3]">
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 p-3">
                          <p className="text-white font-bold text-sm line-clamp-2">{item.title}</p>
                          <p className="text-gray-300 text-xs mt-1">{item.year}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Search className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-2xl text-gray-400">Start searching to find anime, movies, and shows</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
