import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Grid, List as ListIcon, SortAsc, Filter, X } from 'lucide-react';
import { useList, ListType } from '../contexts/ListContext';

type ViewMode = 'grid' | 'list';
type SortBy = 'title' | 'date' | 'rating' | 'progress';

export function ListPage() {
  const { listType = 'watchlist' } = useParams<{ listType: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('title');

  const { lists, removeFromList } = useList();

  const listTitles: Record<ListType, string> = {
    watchlist: 'Watchlist',
    watching: 'Currently Watching',
    completed: 'Completed',
    dropped: 'Dropped',
  };

  const listDescriptions: Record<ListType, string> = {
    watchlist: 'Items you want to watch',
    watching: 'Currently watching or in progress',
    completed: 'All finished items',
    dropped: 'Items you stopped watching',
  };

  const currentListType = listType as ListType;
  const title = listTitles[currentListType] || 'My List';
  const description = listDescriptions[currentListType] || '';

  // Get items from context
  const items = lists[currentListType] || [];

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'progress':
        return (b.currentEpisode || 0) - (a.currentEpisode || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-[1400px] mx-auto px-8 pt-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-start mb-6"
          >
            <div>
              <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Cabin' }}>
                {title}
              </h1>
              <p className="text-gray-400 text-lg">{description}</p>
              <p className="text-purple-400 mt-2">{sortedItems.length} items</p>
            </div>

            {/* View Controls */}
            <div className="flex gap-2">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${
                    viewMode === 'grid'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 text-white text-sm outline-none focus:border-purple-500 transition-colors"
              >
                <option value="title">Title</option>
                <option value="date">Date Added</option>
                <option value="rating">Rating</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </motion.div>

          {/* List Type Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(listTitles).map(([type, name]) => (
              <button
                key={type}
                onClick={() => navigate(`/list/${type}`)}
                className={`px-5 py-2 rounded-full border whitespace-nowrap text-sm font-medium transition-all ${
                  currentListType === type
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {sortedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-gray-400 text-xl mb-4">No items in this list yet</p>
              <p className="text-gray-500 mb-6">Browse content and add items to your list</p>
              <button
                onClick={() => navigate('/')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Browse Content
              </button>
            </motion.div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {sortedItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="group relative"
              >
                <div
                  onClick={() => navigate(`/${item.type}/${item.id}`)}
                  className="cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl mb-2 aspect-[2/3] bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {item.progress && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {item.progress}
                      </div>
                    )}
                    {item.rating && (
                      <div className="absolute top-2 left-2 bg-yellow-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5 font-medium">
                        ⭐ {item.rating}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromList(currentListType, item.id, item.type);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      title="Remove from list"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-white font-semibold text-xs line-clamp-2 mb-0.5">{item.title}</p>
                  <p className="text-gray-500 text-[10px]">{item.year || 'N/A'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex gap-3 items-center hover:border-white/20 hover:bg-white/10 transition-all group"
              >
                <div
                  onClick={() => navigate(`/${item.type}/${item.id}`)}
                  className="flex gap-3 items-center flex-1 cursor-pointer"
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-14 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span className="capitalize bg-white/5 px-2 py-0.5 rounded-full">{item.type}</span>
                      <span>{item.year || 'N/A'}</span>
                      {item.progress && <span className="text-blue-400">📊 {item.progress}</span>}
                      {item.rating && <span className="text-yellow-400">⭐ {item.rating}/10</span>}
                      <span>{new Date(item.addedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromList(currentListType, item.id, item.type)}
                  className="text-gray-500 hover:text-red-500 transition-colors p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
