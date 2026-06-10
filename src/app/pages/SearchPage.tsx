import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMoviesData, useShowsData, useAnimeData } from '../hooks/useMediaData';
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
  const [searchType, setSearchType] = useState<'movies' | 'shows' | 'anime'>('anime');

  const { data: moviesData = [] } = useMoviesData(query);
  const { data: showsData = [] } = useShowsData(query);
  const { data: animeData = [] } = useAnimeData(query);

  const results = {
    movies: moviesData.map((item) => ({ ...item, type: 'movie' as const })),
    shows: showsData.map((item) => ({ ...item, type: 'show' as const })),
    anime: animeData,
  }[searchType];

  const isLoading = false;

  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life'];
  const formats = ['TV', 'Movie', 'OVA', 'ONA', 'Special'];
  const statuses = ['Finished', 'Releasing', 'Not Yet Released', 'Cancelled'];
  const years = Array.from({ length: 30 }, (_, i) => (2024 - i).toString());

  const handleSearch = () => {
    if (query) {
      setSearchParams({ q: query });
    }
  };

  const handleItemClick = (item: any) => {
    const type = item.type || searchType;
    const routeType = type === 'movie' ? 'movie' : type === 'show' ? 'show' : 'anime';
    navigate(`/${routeType}/${item.id}`);
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
                className="w-full bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-white/10 rounded-xl pl-14 pr-4 py-4 text-white text-xl placeholder-white/50 outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-white text-black hover:bg-white/90 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-6 py-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Type Tabs */}
          <div className="flex gap-2 mt-6">
            {['movies', 'shows', 'anime'].map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type as 'movies' | 'shows' | 'anime')}
                className={`px-6 py-2 rounded-lg border-2 transition-all capitalize font-semibold ${
                  searchType === type
                    ? 'bg-white border-white text-black'
                    : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[rgba(255,255,255,0.06)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
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
                className="text-white/70 hover:text-white transition-colors"
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
                          ? 'bg-white text-black'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
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
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30"
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
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30"
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
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30"
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
          {query && results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400">No results found for "{query}"</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <p className="text-gray-400 mb-6">{results.length} results found</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {results.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.type}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleItemClick(item)}
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
