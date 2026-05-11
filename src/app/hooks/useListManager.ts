import { useState, useEffect } from 'react';
import { getWatchlist, saveWatchlist } from '../services/api';

export type ListType = 'watchlist' | 'watching' | 'completed' | 'dropped';

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
  genres?: string[];
}

interface UserLists {
  watchlist: ListItem[];
  watching: ListItem[];
  completed: ListItem[];
  dropped: ListItem[];
}

const STORAGE_KEY = 'user_lists';
const USER_ID_KEY = 'user_id';

function getOrCreateUserId(): string {
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = `user_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch (e) {
    return 'anonymous';
  }
}

// Ensure lists object has proper structure with all list types as arrays
function ensureListStructure(data: any): UserLists {
  const defaultStructure: UserLists = {
    watchlist: [],
    watching: [],
    completed: [],
    dropped: [],
  };

  if (!data || typeof data !== 'object') {
    return defaultStructure;
  }

  return {
    watchlist: Array.isArray(data.watchlist) ? data.watchlist : [],
    watching: Array.isArray(data.watching) ? data.watching : [],
    completed: Array.isArray(data.completed) ? data.completed : [],
    dropped: Array.isArray(data.dropped) ? data.dropped : [],
  };
}

// Get lists from localStorage
function getStoredLists(): UserLists {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return ensureListStructure(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error loading lists from storage:', error);
  }

  return {
    watchlist: [],
    watching: [],
    completed: [],
    dropped: [],
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
  const userId = getOrCreateUserId();

  // Save to storage whenever lists change
  useEffect(() => {
    saveListsToStorage(lists);
    // Also try to persist to Supabase server (best-effort)
    (async () => {
      try {
        await saveWatchlist(userId, lists);
      } catch (err) {
        // ignore network errors; localStorage remains primary
        console.warn('Failed to sync watchlist to server:', err);
      }
    })();
  }, [lists]);

  // On mount, try to load lists from server (overrides localStorage if present)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getWatchlist(userId);
        if (!mounted) return;
        if (data && !data.error && data.watchlist) {
          setLists(ensureListStructure(data.watchlist));
        }
      } catch (err) {
        // ignore; use local storage fallback
        console.warn('Failed to load watchlist from server:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Add item to a list
  const addToList = (listType: ListType, item: Omit<ListItem, 'addedDate'>) => {
    setLists((prev) => {
      // Remove from all other lists first
      const newLists = { ...prev };
      (Object.keys(newLists) as ListType[]).forEach((key) => {
        const listItems = newLists[key];
        if (Array.isArray(listItems)) {
          newLists[key] = listItems.filter(
            (i) => !(i.id === item.id && i.type === item.type)
          );
        } else {
          newLists[key] = [];
        }
      });

      // Add to the specified list
      const targetList = newLists[listType];
      newLists[listType] = [
        ...(Array.isArray(targetList) ? targetList : []),
        { ...item, addedDate: new Date().toISOString() },
      ];

      return newLists;
    });
  };

  // Remove item from a list
  const removeFromList = (listType: ListType, id: number, type: string) => {
    setLists((prev) => {
      const listItems = prev[listType];
      return {
        ...prev,
        [listType]: Array.isArray(listItems)
          ? listItems.filter((item) => !(item.id === id && item.type === type))
          : [],
      };
    });
  };

  // Check if item is in any list
  const getItemList = (id: number, type: string): ListType | null => {
    for (const [listType, items] of Object.entries(lists)) {
      if (Array.isArray(items) && items.some((item) => item.id === id && item.type === type)) {
        return listType as ListType;
      }
    }
    return null;
  };

  // Update item progress
  const updateProgress = (id: number, type: string, currentEpisode: number) => {
    setLists((prev) => {
      const newLists = { ...prev };
      (Object.keys(newLists) as ListType[]).forEach((key) => {
        const listItems = newLists[key];
        if (Array.isArray(listItems)) {
          newLists[key] = listItems.map((item) =>
            item.id === id && item.type === type
              ? {
                  ...item,
                  currentEpisode,
                  progress: item.episodes ? `${currentEpisode}/${item.episodes}` : undefined,
                }
              : item
          );
        }
      });
      return newLists;
    });
  };

  // Update item rating
  const updateRating = (id: number, type: string, rating: number) => {
    setLists((prev) => {
      const newLists = { ...prev };
      (Object.keys(newLists) as ListType[]).forEach((key) => {
        const listItems = newLists[key];
        if (Array.isArray(listItems)) {
          newLists[key] = listItems.map((item) =>
            item.id === id && item.type === type ? { ...item, rating } : item
          );
        }
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
