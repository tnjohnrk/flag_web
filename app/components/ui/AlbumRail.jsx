'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef
} from 'react';
import Image from 'next/image';
import './AlbumRail.css';

/**
 * Album Rail — React Bits Pro
 * A fan of album sleeves, each with a record tucked inside.
 * Optimized for mobile touch, smooth gestures, and reactive navigation.
 */
const AlbumRail = forwardRef(function AlbumRail(
  {
    items = [],
    startIndex = 0,
    aspectRatio = 1,
    coverHeight = 220,
    neighborSpacing = 0.22,
    compactness = 0.55,
    draggable = true,
    showCaption = false,
    showRuler = true,
    autoplay = false,
    autoplayInterval = 4000,
    ariaLabel = 'Pastoral team album rail',
    className = '',
    style,
    onIndexChange,
    onSelect,
    onPlayStateChange
  },
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isSwiping = useRef(false);

  // Sync external index changes
  useEffect(() => {
    if (startIndex >= 0 && startIndex < items.length) {
      setCurrentIndex(startIndex);
    }
  }, [startIndex, items.length]);

  // Imperative navigation handle for parent component
  useImperativeHandle(ref, () => ({
    next: () => {
      handleNext();
    },
    prev: () => {
      handlePrev();
    },
    open: (idx) => {
      if (idx >= 0 && idx < items.length) {
        goToIndex(idx);
      }
    },
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    togglePlay: () => setIsPlaying((p) => !p)
  }));

  const goToIndex = useCallback(
    (newIndex) => {
      if (items.length === 0) return;
      const validIndex = Math.max(0, Math.min(items.length - 1, newIndex));
      setCurrentIndex(validIndex);
      onIndexChange?.(validIndex);
    },
    [items.length, onIndexChange]
  );

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    const prev = (currentIndex - 1 + items.length) % items.length;
    goToIndex(prev);
  }, [currentIndex, items.length, goToIndex]);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    const next = (currentIndex + 1) % items.length;
    goToIndex(next);
  }, [currentIndex, items.length, goToIndex]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    onPlayStateChange?.(nextState);
  };

  // Keyboard Navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect?.(items[currentIndex], currentIndex);
    }
  };

  // Touch & Drag Handling for Mobile
  const handleTouchStart = (e) => {
    if (!draggable) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    touchCurrentX.current = clientX;
    isSwiping.current = true;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current || !draggable) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    touchCurrentX.current = clientX;
    const diff = clientX - touchStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current || !draggable) return;
    isSwiping.current = false;
    setIsDragging(false);

    const threshold = 40; // Pixels needed to trigger slide
    const diff = touchCurrentX.current - touchStartX.current;

    if (diff > threshold) {
      handlePrev();
    } else if (diff < -threshold) {
      handleNext();
    }
    setDragOffset(0);
  };

  // Autoplay option
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, handleNext]);

  // Width & dimensions of album cards
  const sleeveSize = coverHeight;
  const sleeveWidth = sleeveSize * aspectRatio;

  return (
    <div
      className={`album-rail-root ${className}`}
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 3D Rail Stage */}
      <div
        ref={stageRef}
        className="album-rail-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {items.map((item, idx) => {
          // Calculate relative position to active index
          const offset = idx - currentIndex;
          const isActive = offset === 0;
          const absOffset = Math.abs(offset);

          // Only render visible neighborhood for performance
          if (absOffset > 5) return null;

          // 3D positioning calculations
          const dragInfluence = isDragging ? dragOffset * 0.4 : 0;
          const horizontalSpread = sleeveWidth * (1 + neighborSpacing * (1 - compactness));
          
          let translateX = offset * horizontalSpread * 0.42 + dragInfluence;
          let translateZ = -absOffset * 80;
          let rotateY = offset > 0 ? -28 : offset < 0 ? 28 : 0;
          let scale = Math.max(0.72, 1 - absOffset * 0.08);
          let opacity = Math.max(0.2, 1 - absOffset * 0.22);
          let zIndex = 50 - absOffset;

          // When active, center and stand out
          if (isActive) {
            translateX = dragInfluence;
            translateZ = 40;
            rotateY = (dragOffset / 300) * 12; // Dynamic tilt while dragging
            scale = 1;
            opacity = 1;
            zIndex = 100;
          }

          const transformStyle = `translate(-50%, -50%) translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;

          return (
            <div
              key={`album-${item.tag || item.name || idx}`}
              className={`album-rail-card ${isActive ? 'is-active' : ''} ${isPlaying ? 'is-playing' : ''}`}
              style={{
                width: `${sleeveWidth}px`,
                height: `${sleeveSize}px`,
                transform: transformStyle,
                opacity,
                zIndex
              }}
              onClick={() => {
                if (isActive) {
                  onSelect?.(item, idx);
                } else {
                  goToIndex(idx);
                }
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={item.title || item.name}
            >
              {/* Vinyl Record (Tucked Inside Sleeve) */}
              <div className="album-vinyl">
                <div className="album-vinyl-grooves" />
                <div className="album-vinyl-luster" />
                <div className="album-vinyl-label">
                  <div className="album-vinyl-spindle" />
                </div>
              </div>

              {/* Album Sleeve Jacket */}
              <div className="album-sleeve group cursor-pointer">
                {/* Pastor Portrait / Image */}
                <div className="relative w-full h-full bg-gradient-to-b from-[#1E2640] to-[#0D1222] overflow-hidden flex items-end justify-center">
                  <img
                    src={item.src || item.fullSrc}
                    alt={item.title || item.name || 'Pastor'}
                    className="w-full h-full object-contain object-bottom select-none pointer-events-none drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                    loading={absOffset <= 2 ? 'eager' : 'lazy'}
                    draggable={false}
                  />

                  {/* Gradient Overlay for Crisp Framing */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

                  {/* Sleeve Card Badge / Tag */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="font-sans-clean text-[9px] font-bold tracking-widest uppercase text-[#D9A31A] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-[#D9A31A]/30">
                      FLAG LEADERSHIP
                    </span>
                  </div>

                  {/* Micro Name Plate on Sleeve Bottom */}
                  <div className="absolute bottom-2 inset-x-2 z-10 text-center pointer-events-none">
                    <p className="font-editorial text-xs font-bold text-white tracking-wide truncate drop-shadow">
                      {item.title || item.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional Integrated Caption */}
      {showCaption && items[currentIndex] && (
        <div className="mt-3 text-center px-4 max-w-sm">
          <p className="font-sans-clean text-[10px] font-bold tracking-[0.2em] uppercase text-[#D9A31A]">
            {items[currentIndex].subtitle || items[currentIndex].role}
          </p>
          <h4 className="font-editorial text-lg font-bold text-flag-navy dark:text-white mt-0.5">
            {items[currentIndex].title || items[currentIndex].name}
          </h4>
        </div>
      )}

      {/* Interactive Timeline Ruler / Stepper */}
      {showRuler && (
        <div className="album-rail-ruler select-none">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Pastor"
            className="album-rail-btn"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Interactive Scrub Ruler Ticks */}
          <div className="album-rail-ticks" role="tablist" aria-label="Choose pastor">
            {items.map((it, i) => {
              const active = i === currentIndex;
              return (
                <div
                  key={`tick-${i}`}
                  onClick={() => goToIndex(i)}
                  className={`album-rail-tick ${active ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={active}
                  aria-label={it.title || it.name || `Pastor ${i + 1}`}
                >
                  <div className="album-rail-tick-bar" />
                </div>
              );
            })}
          </div>

          {/* Play/Pause Vinyl Spin Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Vinyl Rotation' : 'Spin Vinyl Record'}
            className="album-rail-btn !w-7 !h-7 !text-[10px]"
            title={isPlaying ? 'Pause Spin' : 'Spin Vinyl'}
          >
            {isPlaying ? (
              <svg className="w-3 h-3 text-[#D9A31A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-[#D9A31A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Pastor"
            className="album-rail-btn"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

export default AlbumRail;
