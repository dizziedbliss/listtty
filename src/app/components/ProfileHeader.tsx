import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import imgYourName from '../../imports/MacBookPro161/7d79dd21ad2a81a35b4d25077a54ac17b46223bc.png';
import imgDownload1 from '../../imports/MacBookPro161/23150e758a0121c122da84e127091bdd7d714e68.png';

export function ProfileHeader() {
  return (
    <div className="relative w-full h-[380px] overflow-hidden shadow-[0px_11px_12.2px_0px_rgba(0,0,0,0.25)]">
      {/* Banner Background */}
      <div className="absolute inset-0">
        <img
          src={imgYourName}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Profile Picture */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="absolute left-[70px] top-[43px] w-[285px] h-[285px] rounded-[25px] overflow-hidden border-5 border-black shadow-2xl"
      >
        <img
          src={imgDownload1}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Username */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute left-[401px] top-[282px] font-['Cabin:Bold',sans-serif] text-[48px] text-white font-bold drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.25)]"
      >
        dizziedbliss
      </motion.h1>

      {/* Action Buttons */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-[963px] top-[294px] w-[228px] h-[46px] bg-[rgba(138,56,245,0.2)] backdrop-blur-md border-2 border-black rounded-[10px] font-['Cabin:Regular',sans-serif] text-[32px] text-white"
      >
        edit profile
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-[1220px] top-[294px] w-[228px] h-[46px] bg-[rgba(138,56,245,0.2)] backdrop-blur-md border-2 border-black rounded-[10px] font-['Cabin:Regular',sans-serif] text-[32px] text-white"
      >
        share profile
      </motion.button>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute left-[1309px] top-[43px] w-[349px] h-[46px] bg-[rgba(138,56,245,0.2)] backdrop-blur-md border-2 border-black rounded-[10px] flex items-center px-4 gap-3"
      >
        <Search className="w-5 h-5 text-white" />
        <input
          type="text"
          placeholder="search friends"
          className="flex-1 bg-transparent text-white placeholder-white/70 font-['Cabin:Regular',sans-serif] text-[20px] outline-none"
        />
      </motion.div>
    </div>
  );
}
