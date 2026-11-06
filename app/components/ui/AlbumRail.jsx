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
 * Album Rail — React Bits Pro (Tailwind & CSS)
 * A fan of album sleeves, each with a record tucked inside.
 * Features smooth infinite auto-scrolling, touch gestures, and 3D perspective animations.
 */
const AlbumRail = forwardRef(function AlbumRail(
  {
    items = [],
    startIndex = 0,
    aspectRatio = 1,
    coverHeight = 250,
    neighborSpacing = 0.25,
    compactness = 0.55,
    draggable = true,
    withRecord = null, // Auto-detect: true for square albums (1:1), false for custom cards
    showCaption = false,
    showRuler = true,
    autoplay = true,
    autoplayInterval = 3500,
    ariaLabel = 'Album Rail',
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
  const [isHovered, setIsHovered] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [responsiveHeight, setResponsiveHeight] = useState(coverHeight);

  const stageRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const userInteractionTimerRef = useRef(null);

  // Responsive cover height calculation
  useEffect(() => {
    const updateSize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setResponsiveHeight(Math.min(coverHeight, 210));
      } else if (window.innerWidth < 1024) {
        setResponsiveHeight(Math.min(coverHeight, 240));
      } else {
        setResponsiveHeight(coverHeight);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [coverHeight]);

  // Sync external index changes
  useEffect(() => {
    if (startIndex >= 0 && startIndex < items.length) {
      setCurrentIndex(startIndex);
    }
  }, [startIndex, items.length]);

  const pauseAutoPlayTemporarily = useCallback((durationMs = 4500) => {
    setIsUserInteracting(true);
    if (userInteractionTimerRef.current) clearTimeout(userInteractionTimerRef.current);
    userInteractionTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, durationMs);
  }, []);

  const goToIndex = useCallback(
    (newIndex) => {
      if (items.length === 0) return;
      const validIndex = ((newIndex % items.length) + items.length) % items.length;
      setCurrentIndex(validIndex);
      onIndexChange?.(validIndex);
    },
    [items.length, onIndexChange]
  );

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    pauseAutoPlayTemporarily();
    const prev = (currentIndex - 1 + items.length) % items.length;
    goToIndex(prev);
  }, [currentIndex, items.length, goToIndex, pauseAutoPlayTemporarily]);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    const next = (currentIndex + 1) % items.length;
    goToIndex(next);
  }, [currentIndex, items.length, goToIndex]);

  const handleNextWithPause = useCallback(() => {
    pauseAutoPlayTemporarily();
    handleNext();
  }, [handleNext, pauseAutoPlayTemporarily]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const nextState = !prev;
      onPlayStateChange?.(nextState);
      return nextState;
    });
  }, [onPlayStateChange]);

  // Smooth Auto-Scrolling Loop
  useEffect(() => {
    if (!autoplay || !isPlaying || isHovered || isUserInteracting || items.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, isPlaying, isHovered, isUserInteracting, autoplayInterval, handleNext, items.length]);

  // Imperative navigation handle for parent component
  useImperativeHandle(ref, () => ({
    next: handleNextWithPause,
    prev: handlePrev,
    open: (idx) => {
      pauseAutoPlayTemporarily();
      goToIndex(idx);
    },
    play: () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    },
    pause: () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    },
    togglePlay
  }));

  // Keyboard Navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextWithPause();
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect?.(items[currentIndex], currentIndex);
    }
  };

  // Pointer & Touch Events
  const handlePointerDown = (e) => {
    if (!draggable) return;
    pauseAutoPlayTemporarily();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    touchCurrentX.current = clientX;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !draggable) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const diffX = clientX - touchStartX.current;
    const diffY = clientY - touchStartY.current;

    // Ignore if mostly vertical scrolling on mobile
    if (Math.abs(diffY) > Math.abs(diffX) && !hasMovedRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      return;
    }

    if (Math.abs(diffX) > 6) {
      hasMovedRef.current = true;
    }

    touchCurrentX.current = clientX;
    setDragOffset(diffX);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const diff = touchCurrentX.current - touchStartX.current;
    const threshold = 35;

    if (diff > threshold) {
      handlePrev();
    } else if (diff < -threshold) {
      handleNextWithPause();
    }
    setDragOffset(0);
  };

  // Card & Sleeve Dimensions
  const cardHeight = responsiveHeight;
  const cardWidth = cardHeight * aspectRatio;

  // Determine whether to show the vinyl record (default true for square 1:1 albums)
  const shouldShowRecord = withRecord !== null ? withRecord : Math.abs(aspectRatio - 1) < 0.1;

  const handleCardClick = (idx, e) => {
    e.stopPropagation();
    pauseAutoPlayTemporarily();
    if (hasMovedRef.current) return;

    if (idx === currentIndex) {
      onSelect?.(items[currentIndex], currentIndex);
    } else {
      goToIndex(idx);
    }
  };

  return (
    <div
      className={`album-rail-root ${className}`}
      style={style}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
              handleNextWithPause();
            }
          }}
          aria-label="Next card"
        />

        {items.map((item, idx) => {
          let offset = idx - currentIndex;

          // Infinite circular wrapping so adjacent items wrap seamlessly around the ends
          if (items.length > 4) {
            const half = items.length / 2;
            if (offset > half) {
              offset -= items.length;
            } else if (offset < -half) {
              offset += items.length;
            }
          }

          const isActive = offset === 0;
          const absOffset = Math.abs(offset);

          // Render only visible neighborhood for peak performance (active + 3 on each side)
          if (absOffset > 3.5) return null;

          // 3D positioning calculations
          const dragInfluence = isDragging ? dragOffset * 0.45 : 0;
          const stepX = Math.round(cardWidth * (shouldShowRecord ? 0.52 : 0.48));

          let translateX = offset * stepX + dragInfluence;
          let translateZ = -absOffset * (shouldShowRecord ? 70 : 65);
          let rotateY = offset > 0 ? -18 : offset < 0 ? 18 : 0;
          let scale = Math.max(0.76, 1 - absOffset * 0.09);
          let opacity = Math.max(0.3, 1 - absOffset * 0.2);
          let zIndex = 50 - Math.round(absOffset);

          // Active elevated card
          if (isActive) {
            translateX = dragInfluence;
            translateZ = 25;
            rotateY = (dragOffset / 240) * 10;
            scale = 1;
            opacity = 1;
            zIndex = 100;
          }

          const transformStyle = `translate(-50%, -50%) translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;

          return (
            <div
              key={`card-${item.id || item.tag || item.videoId || idx}`}
              className={`album-rail-card ${isActive ? 'is-active' : 'is-neighbor'} ${
                isActive && isPlaying ? 'is-playing' : ''
              }`}
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
              title={isActive ? (item.title || item.name) : `Select ${item.title || item.name}`}
            >
              {/* Variant 1: Music Album Sleeve with Vinyl Record tucked inside */}
              {shouldShowRecord ? (
                <>
                  {/* Vinyl Record */}
                  <div className="album-vinyl">
                    {/* Micro-Grooves */}
                    <div className="album-vinyl-grooves" />
                    {/* Dynamic Conic Luster Sheen */}
                    <div className="album-vinyl-luster" />
                    {/* Center Vinyl Label */}
                    <div className="album-vinyl-label">
                      {item.labelSrc ? (
                        <img src={item.labelSrc} alt="" className="w-full h-full object-cover" />
                      ) : item.src ? (
                        <img src={item.src} alt="" className="w-full h-full object-cover opacity-85" />
                      ) : (
                        <span className="text-[9px] font-bold text-[#D9A31A]">FLAG</span>
                      )}
                      {/* Spindle Center Hole */}
                      <div className="album-vinyl-spindle" />
                    </div>
                  </div>

                  {/* Album Sleeve Jacket */}
                  <div className="album-sleeve group cursor-pointer">
                    <div className="relative w-full h-full bg-[#121626] overflow-hidden flex items-center justify-center">
                      <img
                        src={item.src || item.fullSrc}
                        alt={item.title || item.name || 'Song'}
                        className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                        loading={absOffset <= 2 ? 'eager' : 'lazy'}
                        draggable={false}
                      />

                      {/* Gradient Overlay for bottom text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                      {/* Center Play Button Icon on Active Sleeve */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-[#D9A31A]/70 flex items-center justify-center text-[#D9A31A] shadow-[0_0_20px_rgba(217,163,26,0.5)] transition-transform duration-300 group-hover:scale-110">
                            <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Top Duration Badge */}
                      {item.duration && (
                        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                          <span className="font-sans-clean text-[10px] font-bold tracking-wider text-white bg-black/75 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 shadow-sm">
                            {item.duration}
                          </span>
                        </div>
                      )}

                      {/* Top Corner Flag Tag */}
                      <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                        <span className="font-sans-clean text-[9px] font-bold tracking-widest text-[#D9A31A] bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded border border-[#D9A31A]/30 uppercase">
                          WORSHIP
                        </span>
                      </div>

                      {/* Bottom Title & Subtitle */}
                      <div className="absolute bottom-2.5 inset-x-2.5 z-10 text-left pointer-events-none">
                        <p className="font-editorial text-sm font-bold text-white tracking-wide truncate drop-shadow">
                          {item.title || item.name}
                        </p>
                        {item.subtitle && (
                          <p className="font-sans-clean text-[10px] font-semibold text-[#D9A31A] truncate tracking-wider uppercase">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Variant 2: Portrait Card Surface (for Pastoral Team) */
                <div className="album-card-inner group bg-white">
                  <div className="relative w-full h-full overflow-hidden flex items-end justify-center bg-white">
                    <img
                      src={item.src || item.fullSrc}
                      alt={item.title || item.name || 'Card'}
                      className="w-full h-full object-contain object-bottom select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
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
              )}
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
            aria-label="Previous item"
            className="album-rail-btn"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Interactive Scrub Ruler Ticks */}
          <div className="album-rail-ticks" role="tablist" aria-label="Choose album">
            {items.map((it, i) => {
              const active = i === currentIndex;
              return (
                <div
                  key={`tick-${i}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    pauseAutoPlayTemporarily();
                    goToIndex(i);
                  }}
                  className={`album-rail-tick ${active ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={active}
                  aria-label={it.title || it.name || `Track ${i + 1}`}
                >
                  <div className="album-rail-tick-bar" />
                </div>
              );
            })}
          </div>

          {/* Play/Pause Vinyl Spin & Auto-scroll Button (Shown for music albums) */}
          {shouldShowRecord && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              aria-label={isPlaying ? 'Pause Auto-scroll & Vinyl' : 'Resume Auto-scroll & Vinyl'}
              className="album-rail-btn !w-9 !h-9 text-xs"
              title={isPlaying ? 'Pause Auto-scroll & Vinyl' : 'Resume Auto-scroll & Vinyl'}
            >
              {isPlaying ? (
                <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextWithPause();
            }}
            aria-label="Next item"
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
