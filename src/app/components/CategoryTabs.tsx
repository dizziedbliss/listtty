import { motion } from 'motion/react';

interface CategoryTabsProps {
  activeCategory: 'movies' | 'shows' | 'anime';
  onCategoryChange: (category: 'movies' | 'shows' | 'anime') => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const tabs = [
    { id: 'movies' as const, label: 'movies' },
    { id: 'shows' as const, label: 'shows' },
    { id: 'anime' as const, label: 'anime' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex gap-6 justify-center mb-12"
    >
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onCategoryChange(tab.id)}
            className={`relative w-[210px] h-[71px] rounded-[20px] border-2 border-black font-['Cabin:Regular',sans-serif] text-[32px] transition-colors ${
              isActive
                ? 'bg-[rgba(122,35,188,0.2)] backdrop-blur-md text-black'
                : 'bg-transparent text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[rgba(122,35,188,0.2)] backdrop-blur-md rounded-[20px] border-2 border-black -z-10"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
