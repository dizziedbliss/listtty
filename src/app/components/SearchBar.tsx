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
      className="w-full h-[44px] bg-[rgba(138,56,245,0.2)] backdrop-blur-md border-2 border-black rounded-[10px] flex items-center px-4 gap-3 mb-12"
    >
      <Search className="w-6 h-6 text-white" />
      <input
        type="text"
        placeholder="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        className="flex-1 bg-transparent text-white placeholder-white/70 font-['Cabin:Regular',sans-serif] text-[32px] outline-none"
      />
    </motion.div>
  );
}
