import { createContext, useContext, ReactNode } from 'react';
import { ToastMessage } from '../components/Toast';

interface ToastContextType {
  addToast: (message: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({
  children,
  addToast,
}: {
  children: ReactNode;
  addToast: (message: Omit<ToastMessage, 'id'>) => void;
}) {
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
