import { useState, useEffect } from 'react';

export type ListType = 'watchlist' | 'watching' | 'completed' | 'dropped' | 'planning';

export interface ListItem {
  id: number;
  type: 'anime' | 'movie' | 'show';
  title: string;
  poster: string;
  year?: string;
  addedDate: string;
  progress?: string;
  rating?: number;
  episodes?: number;
  currentEpisode?: number;
}

interface UserLists {
  watchlist: ListItem[];
  watching: ListItem[];
  completed: ListItem[];
  dropped: ListItem[];
  planning: ListItem[];
}

const STORAGE_KEY = 'user_lists';

// Get lists from localStorage
function getStoredLists(): UserLists {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading lists from storage:', error);
  }

  return {
    watchlist: [],
    watching: [],
    completed: [],
    dropped: [],
    planning: [],
  };
}

// Save lists to localStorage
function saveListsToStorage(lists: UserLists) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (error) {
    console.error('Error saving lists to storage:', error);
  }
}

export function useListManager() {
  const [lists, setLists] = useState<UserLists>(getStoredLists());

  // Save to storage whenever lists change
  useEffect(() => {
    saveListsToStorage(lists);
  }, [lists]);

  // Add item to a list
  const addToList = (listType: ListType, item: Omit<ListItem, 'addedDate'>) => {
    setLists((prev) => {
      // Remove from all other lists first
      const newLists = { ...prev };
      Object.keys(newLists).forEach((key) => {
        newLists[key as ListType] = newLists[key as ListType].filter(
          (i) => !(i.id === item.id && i.type === item.type)
        );
      });

      // Add to the specified list
      newLists[listType] = [
        ...newLists[listType],
        { ...item, addedDate: new Date().toISOString() },
      ];

      return newLists;
    });
  };

  // Remove item from a list
  const removeFromList = (listType: ListType, id: number, type: string) => {
    setLists((prev) => ({
      ...prev,
      [listType]: prev[listType].filter((item) => !(item.id === id && item.type === type)),
    }));
  };

  // Check if item is in any list
  const getItemList = (id: number, type: string): ListType | null => {
    for (const [listType, items] of Object.entries(lists)) {
      if (items.some((item) => item.id === id && item.type === type)) {
        return listType as ListType;
      }
    }
    return null;
  };

  // Update item progress
  const updateProgress = (id: number, type: string, currentEpisode: number) => {
    setLists((prev) => {
      const newLists = { ...prev };
      Object.keys(newLists).forEach((key) => {
        newLists[key as ListType] = newLists[key as ListType].map((item) =>
          item.id === id && item.type === type
            ? {
                ...item,
                currentEpisode,
                progress: item.episodes ? `${currentEpisode}/${item.episodes}` : undefined,
              }
            : item
        );
      });
      return newLists;
    });
  };

  // Update item rating
  const updateRating = (id: number, type: string, rating: number) => {
    setLists((prev) => {
      const newLists = { ...prev };
      Object.keys(newLists).forEach((key) => {
        newLists[key as ListType] = newLists[key as ListType].map((item) =>
          item.id === id && item.type === type ? { ...item, rating } : item
        );
      });
      return newLists;
    });
  };

  return {
    lists,
    addToList,
    removeFromList,
    getItemList,
    updateProgress,
    updateRating,
  };
}
