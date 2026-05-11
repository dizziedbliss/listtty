import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, ChevronDown } from 'lucide-react';
import { useList, ListType } from '../contexts/ListContext';

interface ListDropdownProps {
  itemId: number;
  itemType: 'anime' | 'movie' | 'show';
  title: string;
  poster: string;
  year?: string;
  episodes?: number;
}

const listOptions: { value: ListType; label: string; color: string }[] = [
  { value: 'watching', label: 'Watching', color: 'bg-blue-600' },
  { value: 'completed', label: 'Completed', color: 'bg-green-600' },
  { value: 'planning', label: 'Planning', color: 'bg-purple-600' },
  { value: 'dropped', label: 'Dropped', color: 'bg-red-600' },
  { value: 'watchlist', label: 'Watchlist', color: 'bg-yellow-600' },
];

export function ListDropdown({ itemId, itemType, title, poster, year, episodes }: ListDropdownProps) {
  const { getItemList, addToList, removeFromList } = useList();
  const [isOpen, setIsOpen] = useState(false);

  const currentList = getItemList(itemId, itemType);
  const currentOption = listOptions.find((opt) => opt.value === currentList);

  const handleSelect = (listType: ListType) => {
    if (currentList === listType) {
      // Remove from list if clicking the same one
      removeFromList(listType, itemId, itemType);
    } else {
      // Add to new list
      addToList(listType, {
        id: itemId,
        type: itemType,
        title,
        poster,
        year,
        episodes,
      });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          currentList
            ? `${currentOption?.color} hover:opacity-90 shadow-lg`
            : 'bg-white/5 hover:bg-white/10 border border-white/10'
        } backdrop-blur-xl rounded-full px-5 py-2.5 flex items-center gap-2 transition-all text-sm font-medium`}
      >
        {currentList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {currentList ? currentOption?.label : 'Add to List'}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 left-0 z-50 bg-[rgba(15,15,25,0.98)] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-w-[180px]"
            >
              {listOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 transition-all text-sm ${
                    currentList === option.value
                      ? `${option.color} text-white font-medium`
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span>{option.label}</span>
                  {currentList === option.value && <Check className="w-4 h-4" />}
                </button>
              ))}

              {currentList && (
                <>
                  <div className="border-t border-white/5" />
                  <button
                    onClick={() => {
                      removeFromList(currentList, itemId, itemType);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-red-400 hover:bg-red-900/20 transition-colors text-left text-sm"
                  >
                    Remove from List
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
