import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = '', delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className={`bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-black/30 rounded-xl shadow-xl relative overflow-hidden ${className}`}
      whileHover={{
        scale: 1.01,
        boxShadow: '0 20px 40px rgba(138, 56, 245, 0.3)',
        transition: { duration: 0.3 }
      }}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
