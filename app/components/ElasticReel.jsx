'use client';

import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import './ElasticReel.css';

/**
 * Elastic Reel — React Bits Pro
 * A dock of photo slices that swell open into full images
 * Fully responsive: Automatically scales bars so all photos fit on mobile and desktop
 */
const ElasticReel = forwardRef(function ElasticReel(
  {
    items = [],
    defaultOpen = -1,
    align = 'center',
    autoplay = 'sweep',
    speed = 1.2,
    pauseOnHover = true,
    captions = true,
    labels = true,
    onChange,
    onOpen,
    onClose,
    onItemClick,
    className = '',
    style
  },
  ref
) {
  const containerRef = useRef(null);
  const dockRef = useRef(null);
  const barsRef = useRef([]);

  // Active open item (-1 means dock view, 0+ means full image open)
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);

  // Responsive layout state
  const [layoutConfig, setLayoutConfig] = useState({
    barWidth: 56,
    baseHeight: 360,
    gap: 12,
    radius: 16,
    magnify: 2.4,
    lift: 1.12,
    influence: 200
  });

  const count = items.length || 1;

  // Animated dimensions per bar [width, height]
  const currentSizes = useRef(items.map(() => ({ w: 44, h: 380 })));
  const targetSizes = useRef(items.map(() => ({ w: 44, h: 380 })));

  // Keep size arrays in sync when items length changes
  useEffect(() => {
    if (items.length !== currentSizes.current.length) {
      currentSizes.current = items.map(() => ({ w: layoutConfig.barWidth, h: layoutConfig.baseHeight }));
      targetSizes.current = items.map(() => ({ w: layoutConfig.barWidth, h: layoutConfig.baseHeight }));
    }
  }, [items, layoutConfig.barWidth, layoutConfig.baseHeight]);

  // Pointer position tracking
  const pointerPos = useRef({ x: -9999, y: 0, active: false });
  const sweepAngle = useRef(0);
  const rafId = useRef(null);

  // Compute responsive layout configuration based on container width
  const updateLayout = useCallback((width) => {
    if (!width || count <= 0) return;

    if (width < 480) {
      // Small mobile screens (320px - 479px)
      const gap = 1;
      const dockPadding = 8;
      const availableWidth = Math.max(260, width - dockPadding - (count - 1) * gap);
      const calculatedWidth = Math.max(14, Math.floor(availableWidth / count));
      setLayoutConfig({
        barWidth: calculatedWidth,
        baseHeight: 220,
        gap,
        radius: 0,
        magnify: 3.5,
        lift: 1.18,
        influence: 85
      });
    } else if (width < 768) {
      // Large mobile / Phablet (480px - 767px)
      const gap = 2;
      const dockPadding = 16;
      const availableWidth = Math.max(400, width - dockPadding - (count - 1) * gap);
      const calculatedWidth = Math.max(20, Math.floor(availableWidth / count));
      setLayoutConfig({
        barWidth: calculatedWidth,
        baseHeight: 270,
        gap,
        radius: 0,
        magnify: 2.8,
        lift: 1.16,
        influence: 120
      });
    } else if (width < 1024) {
      // Tablets (768px - 1023px)
      const gap = 4;
      const dockPadding = 24;
      const availableWidth = width - dockPadding - (count - 1) * gap;
      const calculatedWidth = Math.max(28, Math.floor(availableWidth / count));
      setLayoutConfig({
        barWidth: calculatedWidth,
        baseHeight: 320,
        gap,
        radius: 0,
        magnify: 2.5,
        lift: 1.15,
        influence: 160
      });
    } else {
      // Desktop (>= 1024px)
      const gap = 5;
      const dockPadding = 32;
      const availableWidth = Math.min(1150, width) - dockPadding - (count - 1) * gap;
      const calculatedWidth = Math.max(38, Math.min(50, Math.floor(availableWidth / count)));
      setLayoutConfig({
        barWidth: calculatedWidth,
        baseHeight: 380,
        gap,
        radius: 0,
        magnify: 2.4,
        lift: 1.15,
        influence: 200
      });
    }
  }, [count]);

  // Observe container width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateLayout(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    updateLayout(containerRef.current.clientWidth);

    return () => observer.disconnect();
  }, [updateLayout]);

  const openIndexRef = useRef(openIndex);
  useEffect(() => {
    openIndexRef.current = openIndex;
  }, [openIndex]);

  // Imperative handle for parent components
  useImperativeHandle(ref, () => ({
    open: (index) => {
      if (index >= 0 && index < items.length) {
        setOpenIndex(index);
        onChange?.(index);
        onOpen?.(index);
      }
    },
    close: () => {
      setOpenIndex(-1);
      onClose?.();
    },
    next: () => {
      const nextIdx = (openIndexRef.current + 1) % (items.length || 1);
      setOpenIndex(nextIdx);
      onChange?.(nextIdx);
      return nextIdx;
    },
    prev: () => {
      const prevIdx = (openIndexRef.current - 1 + (items.length || 1)) % (items.length || 1);
      setOpenIndex(prevIdx);
      onChange?.(prevIdx);
      return prevIdx;
    }
  }));

  // Calculate target dimensions based on pointer or sweep position
  const updateTargets = useCallback((posX) => {
    const { barWidth, baseHeight, influence, magnify, lift } = layoutConfig;

    barsRef.current.forEach((barEl, idx) => {
      if (!barEl) return;
      const barRect = barEl.getBoundingClientRect();
      const barCenter = barRect.left + barRect.width / 2;

      let dist = Math.abs(posX - barCenter);

      if (dist < influence && posX > -1000) {
        const norm = 1 - dist / influence;
        const factor = Math.cos((1 - norm) * Math.PI * 0.5);
        targetSizes.current[idx] = {
          w: barWidth * (1 + (magnify - 1) * factor),
          h: baseHeight * (1 + (lift - 1) * factor)
        };
      } else {
        targetSizes.current[idx] = {
          w: barWidth,
          h: baseHeight
        };
      }
    });
  }, [layoutConfig]);

  // Spring animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Autoplay sweep when idle
      if (autoplay === 'sweep' && (!isHovered || !pauseOnHover) && openIndex === -1 && dockRef.current) {
        sweepAngle.current += dt * speed;
        const dockRect = dockRef.current.getBoundingClientRect();
        const sweepX = dockRect.left + (dockRect.width / 2) + Math.sin(sweepAngle.current) * (dockRect.width * 0.45);
        updateTargets(sweepX);
      } else if (pointerPos.current.active) {
        updateTargets(pointerPos.current.x);
      } else {
        updateTargets(-9999);
      }

      // Smooth spring interpolation
      const springK = 22;
      barsRef.current.forEach((barEl, idx) => {
        if (!barEl) return;
        const curr = currentSizes.current[idx];
        const targ = targetSizes.current[idx];

        if (!curr || !targ) return;

        curr.w += (targ.w - curr.w) * Math.min(1, springK * dt);
        curr.h += (targ.h - curr.h) * Math.min(1, springK * dt);

        barEl.style.width = `${Math.round(curr.w * 10) / 10}px`;
        barEl.style.height = `${Math.round(curr.h * 10) / 10}px`;

        // Dynamic 3D depth layer based on Photoshop tree hierarchy
        const baseZ = items[idx]?.baseZIndex ?? (100 - (items[idx]?.layerNum ?? idx));
        const liftDiff = layoutConfig.baseHeight * (layoutConfig.lift - 1 || 0.1);
        const liftFactor = Math.max(0, (curr.h - layoutConfig.baseHeight) / liftDiff);
        const zIdx = Math.round(baseZ + liftFactor * 60);
        barEl.style.zIndex = zIdx;
      });

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [autoplay, isHovered, pauseOnHover, openIndex, speed, updateTargets]);

  const identifyClosestBar = useCallback((clientX) => {
    let closestIdx = -1;
    let minDist = 9999;
    barsRef.current.forEach((barEl, idx) => {
      if (!barEl) return;
      const rect = barEl.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) {
        closestIdx = idx;
      }
      const d = Math.abs(clientX - (rect.left + rect.width / 2));
      if (d < minDist) {
        minDist = d;
      }
    });

    if (closestIdx !== -1) {
      setHoverIndex(closestIdx);
      onChange?.(closestIdx);
    }
  }, [onChange]);

  // Pointer interactions (Mouse)
  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return; // Handled by touch events
    pointerPos.current = { x: e.clientX, y: e.clientY, active: true };
    setIsHovered(true);
    identifyClosestBar(e.clientX);
  };

  const handlePointerLeave = () => {
    pointerPos.current = { x: -9999, y: 0, active: false };
    setIsHovered(false);
    setHoverIndex(-1);
  };

  // Touch interactions (Mobile & Tablet)
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      pointerPos.current = { x: touch.clientX, y: touch.clientY, active: true };
      setIsHovered(true);
      identifyClosestBar(touch.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      pointerPos.current = { x: touch.clientX, y: touch.clientY, active: true };
      identifyClosestBar(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    pointerPos.current = { x: -9999, y: 0, active: false };
    setIsHovered(false);
  };

  const handleBarClick = (item, idx) => {
    if (openIndex === idx) {
      setOpenIndex(-1);
      onClose?.();
    } else {
      setOpenIndex(idx);
      onChange?.(idx);
      onOpen?.(idx);
      onItemClick?.(item, idx);
    }
  };

  const activeItem = openIndex >= 0 ? items[openIndex] : null;

  return (
    <div
      ref={containerRef}
      className={`elastic-reel ${className}`}
      style={{
        '--er-gap': `${layoutConfig.gap}px`,
        '--er-radius': `${layoutConfig.radius}px`,
        ...style
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="elastic-reel__viewport">
        {/* The Dock of Photo Slices */}
        <div className={`elastic-reel__dock ${openIndex >= 0 ? 'has-open-item' : ''}`} ref={dockRef}>
          {items.map((item, idx) => {
            const isTarget = hoverIndex === idx;
            const isOpenThis = openIndex === idx;

            return (
              <div
                key={`er-bar-${idx}`}
                ref={(el) => (barsRef.current[idx] = el)}
                className={`elastic-reel__bar ${isOpenThis ? 'is-active-bar' : ''}`}
                style={{
                  width: `${layoutConfig.barWidth}px`,
                  height: `${layoutConfig.baseHeight}px`
                }}
                onClick={() => handleBarClick(item, idx)}
                role="button"
                tabIndex={0}
                aria-label={item.title || `Photo ${idx + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleBarClick(item, idx);
                  }
                }}
              >
                {/* Cutout Silhouette Image */}
                <img
                  src={item.src}
                  alt={item.alt || item.title || ''}
                  className="elastic-reel__bar-image"
                  loading={idx < 5 ? 'eager' : 'lazy'}
                  draggable={false}
                />

                {/* Hover label for the slice */}
                {labels && isTarget && openIndex === -1 && (
                  <span className="elastic-reel__hover-tag">
                    {item.title}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Swelled Full Image View when an item is opened */}
        {activeItem && (
          <div className="elastic-reel__open-stage" onClick={() => setOpenIndex(-1)}>
            <div
              className="elastic-reel__open-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                className="elastic-reel__close-btn"
                aria-label="Close photo"
                onClick={() => {
                  setOpenIndex(-1);
                  onClose?.();
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Full Crisp Photo */}
              <Image
                src={activeItem.fullSrc || activeItem.src}
                alt={activeItem.title || ''}
                fill
                priority
                className="elastic-reel__open-image"
              />

              <div className="elastic-reel__open-scrim" />

              {/* Caption details inside the open hero photo */}
              {captions && (
                <div className="elastic-reel__open-caption">
                  {activeItem.subtitle && (
                    <span className="inline-block self-start font-sans-clean text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#D9A31A] bg-[#D9A31A]/20 px-2.5 py-0.5 rounded-full border border-[#D9A31A]/35 backdrop-blur-sm">
                      {activeItem.subtitle}
                    </span>
                  )}

                  <h3 className="font-editorial text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
                    {activeItem.title}
                  </h3>

                  {activeItem.description && (
                    <p className="font-sans-clean text-xs sm:text-sm text-gray-200 line-clamp-1 sm:line-clamp-2 leading-relaxed drop-shadow">
                      {activeItem.description}
                    </p>
                  )}

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const modalBtn = document.getElementById(`open-pastor-modal-${openIndex}`);
                        if (modalBtn) modalBtn.click();
                      }}
                      className="inline-flex items-center space-x-1.5 text-xs font-sans-clean font-semibold tracking-wider uppercase text-[#D9A31A] hover:text-white transition-colors cursor-pointer group"
                    >
                      <span>Read Full Bio</span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>

                    {/* Step through photos */}
                    <div className="flex items-center space-x-2 text-white/80">
                      <button
                        onClick={() => {
                          const prevIdx = (openIndex - 1 + items.length) % items.length;
                          setOpenIndex(prevIdx);
                          onChange?.(prevIdx);
                        }}
                        aria-label="Previous image"
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#D9A31A] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const nextIdx = (openIndex + 1) % items.length;
                          setOpenIndex(nextIdx);
                          onChange?.(nextIdx);
                        }}
                        aria-label="Next image"
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#D9A31A] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ElasticReel;
