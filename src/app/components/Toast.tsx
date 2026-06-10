import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'undo';
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border ${
              toast.type === 'undo'
                ? 'bg-yellow-600/80 border-yellow-500/50 text-white'
                : toast.type === 'error'
                ? 'bg-red-600/80 border-red-500/50 text-white'
                : toast.type === 'success'
                ? 'bg-green-600/80 border-green-500/50 text-white'
                : 'bg-blue-600/80 border-blue-500/50 text-white'
            }`}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <div className="flex items-center gap-2">
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action!.onClick();
                    onRemove(toast.id);
                  }}
                  className="text-xs font-bold hover:underline"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => onRemove(toast.id)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
