'use client';

import React, { useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import './ElasticReel.css';

/**
 * Elastic Reel — React Bits Pro
 * A dock of photo slices that swell open into full images
 */
const ElasticReel = forwardRef(function ElasticReel(
  {
    items = [],
    defaultOpen = -1,
    barWidth = 56,
    gap = 12,
    radius = 18,
    magnify = 2.4,
    lift = 1.15,
    influence = 200,
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

  // Animated dimensions per bar [width, height]
  const currentSizes = useRef(items.map(() => ({ w: barWidth, h: 360 })));
  const targetSizes = useRef(items.map(() => ({ w: barWidth, h: 360 })));

  // Pointer position tracking
  const pointerPos = useRef({ x: -9999, y: 0, active: false });
  const sweepAngle = useRef(0);
  const rafId = useRef(null);

  const baseHeight = 360;

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
      setOpenIndex((prev) => {
        const nextIdx = (prev + 1) % items.length;
        onChange?.(nextIdx);
        return nextIdx;
      });
    },
    prev: () => {
      setOpenIndex((prev) => {
        const prevIdx = (prev - 1 + items.length) % items.length;
        onChange?.(prevIdx);
        return prevIdx;
      });
    }
  }));

  // Calculate target dimensions based on pointer or sweep position
  const updateTargets = useCallback((posX) => {
    if (!dockRef.current) return;
    const dockRect = dockRef.current.getBoundingClientRect();

    barsRef.current.forEach((barEl, idx) => {
      if (!barEl) return;
      const barRect = barEl.getBoundingClientRect();
      const barCenter = barRect.left + barRect.width / 2;

      let dist = Math.abs(posX - barCenter);

      if (dist < influence && posX > -1000) {
        const norm = 1 - dist / influence;
        // Bell-curve weight
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
  }, [barWidth, baseHeight, influence, magnify, lift]);

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
        const sweepX = dockRect.left + (dockRect.width / 2) + Math.sin(sweepAngle.current) * (dockRect.width * 0.42);
        updateTargets(sweepX);
      } else if (pointerPos.current.active) {
        updateTargets(pointerPos.current.x);
      } else {
        updateTargets(-9999);
      }

      // Smooth spring interpolation
      const springK = 18;
      barsRef.current.forEach((barEl, idx) => {
        if (!barEl) return;
        const curr = currentSizes.current[idx];
        const targ = targetSizes.current[idx];

        if (!curr || !targ) return;

        curr.w += (targ.w - curr.w) * Math.min(1, springK * dt);
        curr.h += (targ.h - curr.h) * Math.min(1, springK * dt);

        barEl.style.width = `${Math.round(curr.w * 10) / 10}px`;
        barEl.style.height = `${Math.round(curr.h * 10) / 10}px`;
      });

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [autoplay, isHovered, pauseOnHover, openIndex, speed, updateTargets]);

  // Pointer interactions
  const handlePointerMove = (e) => {
    pointerPos.current = { x: e.clientX, y: e.clientY, active: true };
    setIsHovered(true);

    // Identify which bar is directly under cursor
    let closestIdx = -1;
    let minDist = 9999;
    barsRef.current.forEach((barEl, idx) => {
      if (!barEl) return;
      const rect = barEl.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right) {
        closestIdx = idx;
      }
      const d = Math.abs(e.clientX - (rect.left + rect.width / 2));
      if (d < minDist) {
        minDist = d;
      }
    });
    setHoverIndex(closestIdx);
  };

  const handlePointerLeave = () => {
    pointerPos.current = { x: -9999, y: 0, active: false };
    setIsHovered(false);
    setHoverIndex(-1);
  };

  const handleBarClick = (item, idx) => {
    if (openIndex === idx) {
      // Toggle close if already open
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
        '--er-gap': `${gap}px`,
        '--er-radius': `${radius}px`,
        ...style
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
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
                  width: `${barWidth}px`,
                  height: `${baseHeight}px`
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
                {/* Vertical Slice Image */}
                <Image
                  src={item.src}
                  alt={item.alt || item.title || ''}
                  fill
                  sizes="320px"
                  priority={idx < 4}
                  className="elastic-reel__bar-image"
                />

                <div className="elastic-reel__bar-overlay" />
                <div className="elastic-reel__bar-rim" />

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
                src={activeItem.src}
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
                    <span className="inline-block self-start font-sans-clean text-[11px] font-bold tracking-[0.2em] uppercase text-[#D9A31A] bg-[#D9A31A]/20 px-2.5 py-0.5 rounded-full border border-[#D9A31A]/35 backdrop-blur-sm">
                      {activeItem.subtitle}
                    </span>
                  )}

                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
                    {activeItem.title}
                  </h3>

                  {activeItem.description && (
                    <p className="font-sans-clean text-xs sm:text-sm text-gray-200 line-clamp-2 leading-relaxed drop-shadow">
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
