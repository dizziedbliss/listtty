import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { MediaCard } from './MediaCard';
import { watchlistItems } from '../data/mockData';
import imgAvengers from '../../imports/MacBookPro161/e79a63dc0e8757702d36184335982fb4a454da53.png';

export function CurrentlyWatching() {
  return (
    <GlassCard className="w-[446px] h-[854px] p-6 flex flex-col gap-6" delay={0.3}>
      {/* Currently Watching */}
      <div>
        <p className="font-['Cabin:Italic',sans-serif] italic text-[20px] text-white drop-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] mb-4">
          currently watching
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-black/20 backdrop-blur-sm rounded-lg border-2 border-black p-6 h-[177px] flex items-center gap-4"
        >
          <img
            src={imgAvengers}
            alt="Avengers: Endgame"
            className="w-[78px] h-[114px] object-cover rounded shadow-[0px_3px_3px_0px_rgba(0,0,0,0.25)] border border-white/50"
          />
          <div className="flex-1">
            <h3 className="font-['Cabin:Italic',sans-serif] italic text-[20px] text-white drop-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)]">
              Avengers: Endgame
            </h3>
            <p className="font-['Cabin_Condensed:Regular',sans-serif] text-[12px] text-white/70 mt-2">
              progress: 0/1
            </p>
            <p className="font-['Cabin:Regular',sans-serif] text-[10px] text-[#a2a2a2] drop-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] mt-1">
              2019
            </p>

            {/* Progress Dots */}
            <div className="flex gap-4 mt-4">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <div className="w-2 h-2 rounded-full bg-black" />
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <div className="w-2 h-2 rounded-full bg-gray-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Watchlist */}
      <div className="flex-1">
        <p className="font-['Cabin:Italic',sans-serif] italic text-[20px] text-white drop-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] mb-4">
          watchlist
        </p>

        <div className="bg-black/20 backdrop-blur-sm rounded-lg border-2 border-black p-4 h-[268px]">
          <div className="grid grid-cols-4 gap-4 overflow-y-auto h-full">
            {watchlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="relative w-[74px] h-[108px] rounded overflow-hidden cursor-pointer shadow-lg"
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 w-full bg-black/77 px-1 py-2">
                  <p className="font-['Cabin_Condensed:Regular',sans-serif] text-white text-[10px] text-center line-clamp-1">
                    {item.title}
                  </p>
                  <p className="font-['Cabin_Condensed:Regular',sans-serif] text-white text-[7px] text-center">
                    1
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
