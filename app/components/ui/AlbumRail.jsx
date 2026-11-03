'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef
} from 'react';
import './AlbumRail.css';

/**
 * Album Rail / 3D Card Rail — React Bits Pro
 * A fan of elegant cards fanned in 3D perspective.
 * Pure card representation (no CD/vinyl disc or audio player).
 * Tailored for mobile touch, smooth drag gestures, and reactive navigation.
 */
const AlbumRail = forwardRef(function AlbumRail(
  {
    items = [],
    startIndex = 0,
    aspectRatio = 0.72,
    coverHeight = 220,
    neighborSpacing = 0.22,
    compactness = 0.58,
    draggable = true,
    showCaption = false,
    showRuler = true,
    autoplay = false,
    autoplayInterval = 4000,
    ariaLabel = 'Pastoral team card rail',
    className = '',
    style,
    onIndexChange,
    onSelect
  },
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
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

  // Imperative navigation handle for parent component
  useImperativeHandle(ref, () => ({
    next: handleNext,
    prev: handlePrev,
    open: (idx) => {
      if (idx >= 0 && idx < items.length) {
        goToIndex(idx);
      }
    }
  }));

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

    const threshold = 35; // Pixels needed to trigger slide
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

  // Width & dimensions of cards
  const cardHeight = coverHeight;
  const cardWidth = Math.round(cardHeight * aspectRatio);

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
          if (absOffset > 4) return null;

          // 3D positioning calculations
          const dragInfluence = isDragging ? dragOffset * 0.45 : 0;
          const horizontalSpread = cardWidth * (1 + neighborSpacing * (1 - compactness));
          
          let translateX = offset * horizontalSpread * 0.52 + dragInfluence;
          let translateZ = -absOffset * 70;
          let rotateY = offset > 0 ? -22 : offset < 0 ? 22 : 0;
          let scale = Math.max(0.75, 1 - absOffset * 0.08);
          let opacity = Math.max(0.25, 1 - absOffset * 0.22);
          let zIndex = 50 - absOffset;

          // When active, center and elevate
          if (isActive) {
            translateX = dragInfluence;
            translateZ = 30;
            rotateY = (dragOffset / 260) * 10;
            scale = 1;
            opacity = 1;
            zIndex = 100;
          }

          const transformStyle = `translate(-50%, -50%) translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;

          return (
            <div
              key={`card-${item.tag || item.name || idx}`}
              className={`album-rail-card ${isActive ? 'is-active' : ''}`}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
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
              {/* Card Surface */}
              <div className="album-card-inner group">
                <div className="relative w-full h-full overflow-hidden flex items-end justify-center">
                  {/* Pastor Silhouette / Portrait Image */}
                  <img
                    src={item.src || item.fullSrc}
                    alt={item.title || item.name || 'Pastor'}
                    className="w-full h-full object-contain object-bottom select-none pointer-events-none drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                    loading={absOffset <= 1 ? 'eager' : 'lazy'}
                    draggable={false}
                  />

                  {/* Gradient Overlay for bottom text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Micro Name Plate on Card Bottom */}
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
        <div className="mt-2 text-center px-4 max-w-sm">
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
