import { motion } from 'motion/react';
import { MediaItem } from '../data/mockData';

interface MediaCardProps {
  item: MediaItem;
  size?: 'small' | 'large';
  index: number;
}

export function MediaCard({ item, size = 'small', index }: MediaCardProps) {
  const isSmall = size === 'small';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative shrink-0 ${isSmall ? 'w-[120px] h-[114px]' : 'w-[225px] h-[295px]'} bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden cursor-pointer shadow-xl`}
    >
      <img
        src={item.poster}
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 p-3 w-full">
          <p className="font-['Cabin_Condensed:Regular',sans-serif] text-white text-sm font-semibold line-clamp-2">
            {item.title}
          </p>
          {item.progress && (
            <p className="font-['Cabin_Condensed:Regular',sans-serif] text-white/70 text-xs mt-1">
              {item.progress}
            </p>
          )}
          {item.year && (
            <p className="font-['Cabin_Condensed:Regular',sans-serif] text-white/50 text-xs mt-1">
              {item.year}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
