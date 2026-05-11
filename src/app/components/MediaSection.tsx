import { motion } from 'motion/react';
import { MediaCard } from './MediaCard';
import { MediaItem } from '../data/mockData';
import { GlassCard } from './GlassCard';

interface MediaSectionProps {
  title: string;
  items: MediaItem[];
  size?: 'small' | 'large';
  delay?: number;
}

export function MediaSection({ title, items, size = 'large', delay = 0 }: MediaSectionProps) {
  const height = size === 'small' ? 'h-[163px]' : 'h-[358px]';

  return (
    <div className="relative w-full">
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="font-['Cabin:Italic',sans-serif] italic text-[20px] text-white drop-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] mb-6"
      >
        {title}
      </motion.p>

      <GlassCard className={`${height} p-7 overflow-hidden`} delay={delay + 0.1}>
        <div className="flex gap-[20px] overflow-x-auto overflow-y-hidden h-full pb-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
          {items.map((item, index) => (
            <MediaCard key={item.id} item={item} size={size} index={index} />
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
