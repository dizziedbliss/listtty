import { motion } from 'motion/react';

interface BottomNavProps {
  activeCategory: 'movies' | 'shows' | 'anime';
  onCategoryChange: (category: 'movies' | 'shows' | 'anime') => void;
}

export function BottomNav({ activeCategory, onCategoryChange }: BottomNavProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      {/* Container Background Box */}
      <div className="bg-[rgba(8,8,8,0.7)] backdrop-blur-2xl border border-white/10 rounded-full px-3 py-3 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3">
          {/* Movies Tab */}
          <button
            onClick={() => onCategoryChange('movies')}
            className={`transition-all duration-300 ${
              activeCategory === 'movies' ? '-translate-y-1.5 scale-105' : 'hover:scale-102'
            }`}
          >
            <div
              className={`h-[44px] px-6 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                activeCategory === 'movies'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <p
                className={`font-['Poppins',sans-serif] font-medium text-[18px] tracking-wide transition-colors ${
                  activeCategory === 'movies' ? 'text-black' : 'text-white/60'
                }`}
              >
                movies
              </p>
            </div>
          </button>

          {/* Shows Tab */}
          <button
            onClick={() => onCategoryChange('shows')}
            className={`transition-all duration-300 ${
              activeCategory === 'shows' ? '-translate-y-1.5 scale-105' : 'hover:scale-102'
            }`}
          >
            <div
              className={`h-[44px] px-6 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                activeCategory === 'shows'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <p
                className={`font-['Poppins',sans-serif] font-medium text-[18px] tracking-wide transition-colors ${
                  activeCategory === 'shows' ? 'text-black' : 'text-white/60'
                }`}
              >
                shows
              </p>
            </div>
          </button>

          {/* Anime Tab */}
          <button
            onClick={() => onCategoryChange('anime')}
            className={`transition-all duration-300 ${
              activeCategory === 'anime' ? '-translate-y-1.5 scale-105' : 'hover:scale-102'
            }`}
          >
            <div
              className={`h-[44px] px-6 rounded-full border border-white/10 flex items-center justify-center transition-all ${
                activeCategory === 'anime'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <p
                className={`font-['Poppins',sans-serif] font-medium text-[18px] tracking-wide transition-colors ${
                  activeCategory === 'anime' ? 'text-black' : 'text-white/60'
                }`}
              >
                anime
              </p>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
