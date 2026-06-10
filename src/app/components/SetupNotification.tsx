import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingMoviesFromServer } from '../services/api';

interface SetupNotificationProps {
  activeCategory: 'movies' | 'shows' | 'anime';
}

export function SetupNotification({ activeCategory }: SetupNotificationProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const { data } = useQuery({
    queryKey: ['api-status'],
    queryFn: fetchTrendingMoviesFromServer,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isTMDBConfigured = data && !data.error && data.results?.length > 0;
  const showNotification = !isDismissed && !isTMDBConfigured && (activeCategory === 'movies' || activeCategory === 'shows');

  // Reset dismissed state when switching categories
  useEffect(() => {
    setIsDismissed(false);
  }, [activeCategory]);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6"
        >
          <div className="bg-[rgba(255,255,255,0.06)] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative shadow-xl shadow-black/20">
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-white font-['Cabin:Bold',sans-serif] text-lg mb-2">
                  Enable Real {activeCategory === 'movies' ? 'Movie' : 'TV Show'} Data
                </h3>
                <p className="text-white/80 font-['Cabin:Regular',sans-serif] text-sm mb-4">
                  You're currently viewing placeholder data. Add your free TMDB API key to see real {activeCategory === 'movies' ? 'movies' : 'TV shows'}, search functionality, and more!
                </p>

                <div className="flex gap-3">
                  <a
                    href="https://www.themoviedb.org/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white font-['Cabin:Regular',sans-serif] text-sm transition-all"
                  >
                    Get API Key
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setIsDismissed(true)}
                    className="text-white/60 hover:text-white font-['Cabin:Regular',sans-serif] text-sm transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>

                <p className="text-white/50 font-['Cabin:Regular',sans-serif] text-xs mt-3">
                  💡 Tip: Check SETUP_GUIDE.md for step-by-step instructions
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
