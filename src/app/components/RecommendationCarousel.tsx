import React, { useRef } from 'react';

export type RecItem = {
  id: number | string;
  title: string;
  poster?: string;
  year?: string | number;
  [key: string]: any;
};

type Props = {
  title?: string;
  items: RecItem[];
  onItemClick?: (item: RecItem) => void;
  visibleCount?: number; // how many items to show at once on wide screens
  gap?: number; // px gap between items
  itemWidth?: number; // px
  itemHeight?: number; // px
  showArrows?: boolean;
  className?: string;
};

export default function RecommendationCarousel({
  title,
  items,
  onItemClick,
  visibleCount = 5,
  gap = 16,
  itemWidth = 200,
  itemHeight = 260,
  showArrows = true,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const amount = (itemWidth + gap) * Math.max(1, Math.floor(visibleCount / 2));
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className={`w-full ${className}`} aria-label={title || 'Recommendations'}>
      {title && <h3 className="text-sm text-gray-300 mb-3 font-medium">{title}</h3>}

      <div className="relative">
        {showArrows && (
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white"
            style={{ transform: 'translateY(-50%)' }}
          >
            ‹
          </button>
        )}

        <div
          ref={containerRef}
          className="flex overflow-x-auto no-scrollbar py-2 px-6"
          style={{ gap: `${gap}px`, scrollBehavior: 'smooth' }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              role="button"
              tabIndex={0}
              onClick={() => onItemClick?.(it)}
              onKeyDown={(e) => e.key === 'Enter' && onItemClick?.(it)}
              className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform bg-gray-800"
              style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}
            >
              <div className="w-full h-full relative">
                {it.poster ? (
                  <img alt={it.title} src={it.poster} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-gray-200">No image</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-xs text-gray-100 line-clamp-1 font-semibold">{it.title}</div>
                  {it.year && <div className="text-[11px] text-gray-400">{it.year}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showArrows && (
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white"
            style={{ transform: 'translateY(-50%)' }}
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}
