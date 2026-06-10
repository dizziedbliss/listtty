import { useState, useEffect } from 'react';
import { getWatchlist, saveWatchlist, getProgress, saveProgress } from '../services/api';

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

function mergeListItems(existing: ListItem[], incoming: ListItem[]) {
  const merged = [...existing];

  incoming.forEach((item) => {
    const index = merged.findIndex((current) => current.id === item.id && current.type === item.type);
    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        ...item,
        addedDate: merged[index].addedDate || item.addedDate,
        rating: merged[index].rating ?? item.rating,
        progress: item.progress ?? merged[index].progress,
        currentEpisode: item.currentEpisode ?? merged[index].currentEpisode,
      };
    } else {
      merged.push(item);
    }
  });

  return merged;
}

export function useListManager() {
  const [lists, setLists] = useState<UserLists>(getStoredLists());
  const [hydrated, setHydrated] = useState(false);
  const [lastProgressChange, setLastProgressChange] = useState<{
    id: number;
    type: string;
    previousEpisode: number;
    timestamp: number;
  } | null>(null);
  const userId = getOrCreateUserId();

  // Save to storage whenever lists change
  useEffect(() => {
    saveListsToStorage(lists);
    if (!hydrated) return;
    (async () => {
      try {
        await saveWatchlist(userId, lists);
      } catch (error) {
        console.warn('Failed to save lists to server:', error);
      }
    })();
  }, [lists, userId, hydrated]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getWatchlist(userId);
        if (!cancelled && response?.watchlist) {
          const serverLists = ensureListStructure(response.watchlist);
          const hasServerData = Object.values(serverLists).some((items) => items.length > 0);
          if (hasServerData) {
            setLists(serverLists);
          }
        }
      } catch (error) {
        console.warn('Failed to load lists from server:', error);
      }

      try {
        const response = await getProgress(userId);
        if (cancelled || !response?.progress) return;
        const progressMap = response.progress || {};
        setLists((prev) => {
          const next = { ...prev };

          (Object.keys(next) as ListType[]).forEach((listType) => {
            next[listType] = next[listType].map((item) => {
              const progressEntry = progressMap?.[`${item.type}:${item.id}`] || progressMap?.[String(item.id)];
              if (!progressEntry) return item;

              const currentEpisode = typeof progressEntry.currentEpisode === 'number'
                ? progressEntry.currentEpisode
                : typeof progressEntry === 'number'
                  ? progressEntry
                  : item.currentEpisode;

              return {
                ...item,
                currentEpisode,
                progress: item.episodes && typeof currentEpisode === 'number'
                  ? `${currentEpisode}/${item.episodes}`
                  : item.progress,
              };
            });
          });

          return next;
        });
      } catch (error) {
        console.warn('Failed to load progress from server:', error);
      }

      if (!cancelled) {
        setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

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
    let nextListsSnapshot: UserLists | null = null;

    setLists((prev) => {
      const newLists = { ...prev };
      let previousEpisode = 0;
      (Object.keys(newLists) as ListType[]).forEach((key) => {
        const listItems = newLists[key];
        if (Array.isArray(listItems)) {
          newLists[key] = listItems.map((item) => {
            if (item.id === id && item.type === type) {
              previousEpisode = item.currentEpisode || 0;
              return {
                ...item,
                currentEpisode,
                progress: item.episodes ? `${currentEpisode}/${item.episodes}` : undefined,
              };
            }
            return item;
          });
        }
      });
      
      // Track the last change for undo
      setLastProgressChange({
        id,
        type,
        previousEpisode,
        timestamp: Date.now(),
      });

      nextListsSnapshot = newLists;
      
      return newLists;
    });

    (async () => {
      try {
        const currentLists = nextListsSnapshot || getStoredLists();
        const progress = Object.fromEntries(
          Object.values(currentLists)
            .flat()
            .map((item) => [`${item.type}:${item.id}`, { currentEpisode: item.currentEpisode || 0 }])
        );
        await saveProgress(userId, progress);
      } catch (error) {
        console.warn('Failed to save progress to server:', error);
      }
    })();
  };

  // Undo the last progress change
  const undoLastProgress = () => {
    if (!lastProgressChange) return;
    
    const { id, type, previousEpisode } = lastProgressChange;
    updateProgress(id, type, previousEpisode);
    setLastProgressChange(null);
  };

  // Update item rating
  const updateRating = (id: number, type: string, rating: number) => {
    let nextListsSnapshot: UserLists | null = null;

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

      nextListsSnapshot = newLists;
      return newLists;
    });

    saveWatchlist(userId, nextListsSnapshot || getStoredLists()).catch((error) => {
      console.warn('Failed to persist rating update:', error);
    });
  };

  const mergeExternalLists = (incoming: Partial<UserLists>) => {
    setLists((prev) => {
      const next = {
      watchlist: mergeListItems(prev.watchlist, incoming.watchlist || []),
      watching: mergeListItems(prev.watching, incoming.watching || []),
      completed: mergeListItems(prev.completed, incoming.completed || []),
      dropped: mergeListItems(prev.dropped, incoming.dropped || []),
      };

      saveListsToStorage(next);
      saveWatchlist(userId, next).catch((error) => {
        console.warn('Failed to sync merged lists to server:', error);
      });

      return next;
    });
  };

  return {
    lists,
    addToList,
    removeFromList,
    getItemList,
    updateProgress,
    updateRating,
    undoLastProgress,
    lastProgressChange,
    mergeExternalLists,
  };
}
