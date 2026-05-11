import { createContext, useContext, ReactNode } from 'react';
import { useListManager, ListType, ListItem } from '../hooks/useListManager';

interface ListContextType {
  lists: {
    watchlist: ListItem[];
    watching: ListItem[];
    completed: ListItem[];
    dropped: ListItem[];
    planning: ListItem[];
  };
  addToList: (listType: ListType, item: Omit<ListItem, 'addedDate'>) => void;
  removeFromList: (listType: ListType, id: number, type: string) => void;
  getItemList: (id: number, type: string) => ListType | null;
  updateProgress: (id: number, type: string, currentEpisode: number) => void;
  updateRating: (id: number, type: string, rating: number) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: ReactNode }) {
  const listManager = useListManager();

  return (
    <ListContext.Provider value={listManager}>
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useList must be used within ListProvider');
  }
  return context;
}
