import React from 'react';
import { Star } from 'lucide-react';

type Item = {
  id: number | string;
  title?: string;
  poster?: string;
  year?: string | number;
  type?: string;
  episodes?: number;
  currentEpisode?: number;
  rating?: number;
  addedDate?: string;
  progress?: string;
  genres?: string[];
  overview?: string;
};

type Props = {
  open: boolean;
  item?: Item | null;
  onClose: () => void;
  onAddToList: (list: 'watchlist' | 'watching' | 'completed' | 'dropped', item: Item) => void;
  onRate: (id: number, type: string, rating: number) => void;
  getItemList: (id: number, type: string) => string | null;
  onViewDetails: (id: number, type: string) => void;
};

export default function PreviewModal({ open, item, onClose, onAddToList, onRate, getItemList, onViewDetails }: Props) {
  if (!open || !item) return null;

  const inList = getItemList(Number(item.id), item.type || '');
  const isWatchlist = inList === 'watchlist';
  const [localRating, setLocalRating] = React.useState<number>(item.rating || 0);
  const [showRatingPrompt, setShowRatingPrompt] = React.useState(false);

  React.useEffect(() => {
    setLocalRating(item.rating || 0);
    setShowRatingPrompt(false);
  }, [item]);

  if (!isWatchlist) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#0b0b0f] border border-white/10 rounded-lg max-w-2xl w-full mx-4 p-6 z-10 shadow-xl transform transition-all duration-180 ease-out scale-100 opacity-100">
        <div className="flex gap-4">
          <div className="w-36 h-48 bg-gray-700 rounded overflow-hidden flex-shrink-0">
            {item.poster ? <img src={item.poster} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-800" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/80">
              {item.type && <span className="rounded-full bg-white/10 px-2 py-1 uppercase tracking-wide">{item.type}</span>}
              {item.year && <span className="rounded-full bg-white/10 px-2 py-1">{item.year}</span>}
              {item.episodes && <span className="rounded-full bg-white/10 px-2 py-1">{item.episodes} eps</span>}
              {item.currentEpisode !== undefined && <span className="rounded-full bg-white/10 px-2 py-1">Ep {item.currentEpisode}</span>}
              {item.rating !== undefined && item.rating > 0 && <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-yellow-300">{item.rating.toFixed(1)} / 5</span>}
            </div>

            <p className="text-sm text-gray-300 mt-4 mb-3">Manage your watchlist item.</p>

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-300">
              {item.progress && (
                <div className="rounded-md bg-white/5 border border-white/10 px-3 py-2">
                  <div className="text-gray-500 uppercase tracking-wide mb-1">Progress</div>
                  <div>{item.progress}</div>
                </div>
              )}
              {item.addedDate && (
                <div className="rounded-md bg-white/5 border border-white/10 px-3 py-2">
                  <div className="text-gray-500 uppercase tracking-wide mb-1">Added</div>
                  <div>{new Date(item.addedDate).toLocaleDateString()}</div>
                </div>
              )}
            </div>

            {item.genres && item.genres.length > 0 && (
              <div className="mb-4">
                <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Genres</div>
                <div className="flex flex-wrap gap-2">
                  {item.genres.slice(0, 5).map((genre) => (
                    <span key={genre} className="rounded-full bg-purple-500/15 border border-purple-500/20 px-2 py-1 text-[11px] text-purple-200">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.overview && (
              <p className="text-sm text-gray-300 mb-4 leading-relaxed line-clamp-4">
                {item.overview}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  onAddToList('watching', item);
                  onClose();
                }}
                className="px-3 py-1 bg-green-700 hover:bg-green-800 rounded text-white text-sm"
              >
                Start Watching
              </button>
              <button
                onClick={() => {
                  setShowRatingPrompt(true);
                }}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded text-white text-sm"
              >
                Mark Completed
              </button>
              <button
                onClick={() => {
                  onAddToList('dropped', item);
                  onClose();
                }}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-800 rounded text-white text-sm"
              >
                Remove from Watchlist
              </button>
            </div>

            {/* Rating input for marking completed */}
            {showRatingPrompt && (
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/50 rounded">
                <p className="text-sm text-white mb-2">Rate before marking completed (optional)</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={localRating}
                    onChange={(e) => setLocalRating(parseFloat(e.target.value))}
                    className="w-48"
                  />
                  <div className="text-sm text-white w-12 text-center">{localRating.toFixed(1)}</div>
                  <button
                    onClick={() => {
                      onAddToList('completed', item);
                      if (localRating > 0) {
                        onRate(Number(item.id), item.type || '', Number(localRating.toFixed(1)));
                      }
                      onClose();
                    }}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => onViewDetails(Number(item.id), item.type || '')}
              className="mt-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-sm"
            >
              Open Details
            </button>
          </div>
          <button onClick={onClose} className="absolute right-3 top-3 text-gray-300 hover:text-white">✕</button>
        </div>
      </div>
    </div>
  );
}
