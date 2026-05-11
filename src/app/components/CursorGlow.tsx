import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed w-[400px] h-[400px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50"
      style={{
        background: 'radial-gradient(circle, rgba(138,56,245,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
  );
}
