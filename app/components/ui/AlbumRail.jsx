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
 * A fan of elegant cards in 3D perspective.
 * Smooth touch swipe and instant click-to-move navigation.
 */
const AlbumRail = forwardRef(function AlbumRail(
  {
    items = [],
    startIndex = 0,
    aspectRatio = 0.69,
    coverHeight = 210,
    neighborSpacing = 0.28,
    compactness = 0.5,
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
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);

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

  // Touch & Pointer Handling
  const handlePointerDown = (e) => {
    if (!draggable) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    touchCurrentX.current = clientX;
    hasMovedRef.current = false;
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e) => {
    if (!draggable || touchStartX.current === 0) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - touchStartX.current;
    const dy = clientY - touchStartY.current;

    // Detect intentional horizontal drag vs tap
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      hasMovedRef.current = true;
      isDraggingRef.current = true;
      setIsDragging(true);
      touchCurrentX.current = clientX;
      setDragOffset(dx);
    }
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      const diff = touchCurrentX.current - touchStartX.current;
      const swipeThreshold = 22; // Low threshold for effortless flick

      if (diff > swipeThreshold) {
        handlePrev();
      } else if (diff < -swipeThreshold) {
        handleNext();
      }
    }

    touchStartX.current = 0;
    touchStartY.current = 0;
    setIsDragging(false);
    setDragOffset(0);

    // Briefly keep hasMovedRef true to block accidental click right after a swipe
    setTimeout(() => {
      hasMovedRef.current = false;
      isDraggingRef.current = false;
    }, 60);
  };

  // Direct card click / tap
  const handleCardClick = (idx, e) => {
    // If the user just completed a swipe gesture, ignore
    if (hasMovedRef.current) return;
    e.stopPropagation();

    if (idx === currentIndex) {
      onSelect?.(items[idx], idx);
    } else {
      goToIndex(idx);
    }
  };

  // Autoplay option
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, handleNext]);

  // Dimensions of cards
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
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      >
        {/* Left Side Tap-To-Previous Zone */}
        <div
          className="album-rail-tap-zone album-rail-tap-zone--left"
          onClick={(e) => {
            if (!hasMovedRef.current) {
              e.stopPropagation();
              handlePrev();
            }
          }}
          aria-label="Previous card"
        />

        {/* Right Side Tap-To-Next Zone */}
        <div
          className="album-rail-tap-zone album-rail-tap-zone--right"
          onClick={(e) => {
            if (!hasMovedRef.current) {
              e.stopPropagation();
              handleNext();
            }
          }}
          aria-label="Next card"
        />

        {items.map((item, idx) => {
          const offset = idx - currentIndex;
          const isActive = offset === 0;
          const absOffset = Math.abs(offset);

          // Only render visible neighborhood for optimal performance
          if (absOffset > 3) return null;

          // 3D positioning calculations: clear offset so next cards are prominently visible
          const dragInfluence = isDragging ? dragOffset * 0.45 : 0;
          // Step distance per card offset: 108px ensures adjacent cards clearly show
          const stepX = 108;
          
          let translateX = offset * stepX + dragInfluence;
          let translateZ = -absOffset * 65;
          let rotateY = offset > 0 ? -18 : offset < 0 ? 18 : 0;
          let scale = Math.max(0.78, 1 - absOffset * 0.1);
          let opacity = Math.max(0.35, 1 - absOffset * 0.22);
          let zIndex = 50 - absOffset;

          // When active, center and elevate
          if (isActive) {
            translateX = dragInfluence;
            translateZ = 20;
            rotateY = (dragOffset / 240) * 10;
            scale = 1;
            opacity = 1;
            zIndex = 100;
          }

          const transformStyle = `translate(-50%, -50%) translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;

          return (
            <div
              key={`card-${item.tag || item.name || idx}`}
              className={`album-rail-card ${isActive ? 'is-active' : 'is-neighbor'}`}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                transform: transformStyle,
                opacity,
                zIndex
              }}
              onClick={(e) => handleCardClick(idx, e)}
              role="group"
              aria-roledescription="slide"
              aria-label={item.title || item.name}
              title={isActive ? (item.title || item.name) : `Click to view ${item.title || item.name}`}
            >
              {/* Card Surface */}
              <div className="album-card-inner group bg-white">
                <div className="relative w-full h-full overflow-hidden flex items-end justify-center bg-white">
                  {/* Pastor Silhouette / Portrait Image */}
                  <img
                    src={item.src || item.fullSrc}
                    alt={item.title || item.name || 'Pastor'}
                    className="w-full h-full object-contain object-bottom select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
                    loading={absOffset <= 1 ? 'eager' : 'lazy'}
                    draggable={false}
                  />

                  {/* Gradient Overlay for bottom text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                  {/* Micro Name Plate on Card Bottom */}
                  <div className="absolute bottom-2 inset-x-2 z-10 text-center pointer-events-none">
                    <p className="font-editorial text-xs font-bold text-white tracking-wide truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
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
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous Pastor"
            className="album-rail-btn"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(i);
                  }}
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
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next Pastor"
            className="album-rail-btn"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

export default AlbumRail;
