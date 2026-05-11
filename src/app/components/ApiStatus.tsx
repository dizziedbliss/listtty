import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingMoviesFromServer } from '../services/api';

export function ApiStatus() {
  const { data } = useQuery({
    queryKey: ['api-status'],
    queryFn: fetchTrendingMoviesFromServer,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isTMDBConfigured = data && !data.error && data.results?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2 shadow-xl">
        {isTMDBConfigured ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-['Cabin:Regular',sans-serif]">
              TMDB Connected
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-['Cabin:Regular',sans-serif]">
              TMDB Key Needed
            </span>
          </>
        )}

        <div className="h-4 w-px bg-white/20 mx-2" />

        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-green-400 text-sm font-['Cabin:Regular',sans-serif]">
          AniList Active
        </span>
      </div>
    </motion.div>
  );
}
