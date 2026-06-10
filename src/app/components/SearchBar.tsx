import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full h-[44px] bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-white/10 rounded-[12px] flex items-center px-4 gap-3 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <Search className="w-6 h-6 text-white/80" />
      <input
        type="text"
        placeholder="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        className="flex-1 bg-transparent text-white placeholder-white/50 font-['Cabin:Regular',sans-serif] text-[32px] outline-none"
      />
    </motion.div>
  );
}
