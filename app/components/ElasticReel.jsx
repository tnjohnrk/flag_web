'use client';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import './ElasticReel.css';

/**
 * Exact Photoshop Canvas Coordinate Mapping for all 18 Pastors
 * Reconstructs the master group photo with 100% mathematical precision.
 * Every pastor has their exact designed horizontal position (leftPct, widthPct),
 * vertical height (heightPct), and natural zIndex depth.
 */
const STAGE_POSITIONS = {
  "-09": { zIndex: 1,  leftPct: 0.07,  widthPct: 13.76, heightPct: 78.93 },
  "-08": { zIndex: 2,  leftPct: 7.82,  widthPct: 7.16,  heightPct: 85.68 },
  "-07": { zIndex: 3,  leftPct: 12.21, widthPct: 6.67,  heightPct: 93.98 },
  "-06": { zIndex: 4,  leftPct: 15.58, widthPct: 6.10,  heightPct: 84.95 },
  "-05": { zIndex: 5,  leftPct: 19.17, widthPct: 6.19,  heightPct: 92.68 },
  "-04": { zIndex: 6,  leftPct: 23.70, widthPct: 5.95,  heightPct: 90.81 },
  "-03": { zIndex: 7,  leftPct: 27.59, widthPct: 5.92,  heightPct: 93.98 },
  "-02": { zIndex: 8,  leftPct: 31.90, widthPct: 8.66,  heightPct: 92.68 },
  "-01": { zIndex: 19, leftPct: 36.33, widthPct: 12.34, heightPct: 95.44 }, // In front of 01 layer
  "01":  { zIndex: 18, leftPct: 46.82, widthPct: 12.12, heightPct: 94.30 }, // Rev. N. Johnson & Pastor Jemimah in back of -01
  "02":  { zIndex: 17, leftPct: 54.03, widthPct: 11.36, heightPct: 97.23 }, // Jerusha & family
  "03":  { zIndex: 16, leftPct: 60.60, widthPct: 9.34,  heightPct: 81.94 }, // Pr. Balaji
  "04":  { zIndex: 15, leftPct: 67.84, widthPct: 5.82,  heightPct: 88.93 }, // Pr. Daniel
  "05":  { zIndex: 14, leftPct: 71.35, widthPct: 6.54,  heightPct: 86.33 }, // Pr. Nagaraj
  "06":  { zIndex: 13, leftPct: 75.41, widthPct: 8.83,  heightPct: 97.64 }, // Pr. Joshua
  "07":  { zIndex: 12, leftPct: 77.86, widthPct: 9.48,  heightPct: 96.42 }, // Pr. Sundar
  "08":  { zIndex: 11, leftPct: 81.30, widthPct: 11.50, heightPct: 97.07 }, // Pr. Vicky
  "09":  { zIndex: 10, leftPct: 90.86, widthPct: 8.33,  heightPct: 94.30 }, // Sis. Jency
  "10":  { zIndex: 9,   leftPct: 93.80, widthPct: 7.20,  heightPct: 94.30 }  // Sis. Machtalin
};

const ElasticReel = forwardRef(function ElasticReel(
  {
    items = [],
    selectedIndex = 0,
    onChange,
    onItemClick,
    className = '',
    style
  },
  ref
) {
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const figuresRef = useRef([]);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  // Smoothly center the active pastor into view on mobile horizontal scroll
  useEffect(() => {
    if (figuresRef.current[activeIndex] && typeof window !== 'undefined' && window.innerWidth < 768) {
      figuresRef.current[activeIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeIndex]);

  // Imperative handle for parent navigation buttons (< >)
  useImperativeHandle(ref, () => ({
    open: (idx) => {
      if (idx >= 0 && idx < items.length) {
        setActiveIndex(idx);
      }
    },
    next: () => {
      const nextIdx = (activeIndex + 1) % (items.length || 1);
      setActiveIndex(nextIdx);
      onChange?.(nextIdx);
      return nextIdx;
    },
    prev: () => {
      const prevIdx = (activeIndex - 1 + (items.length || 1)) % (items.length || 1);
      setActiveIndex(prevIdx);
      onChange?.(prevIdx);
      return prevIdx;
    }
  }));

  const handleSelect = (idx) => {
    setActiveIndex(idx);
    onChange?.(idx);
    onItemClick?.(items[idx], idx);
  };

  return (
    <div className={`pastoral-group-stage ${className}`} style={style}>
      {/* Group photo baseline shadow */}
      <div className="pastoral-group-stage__floor-shadow" />

      {/* Master Canvas: Proportional group photo stage */}
      <div className="pastoral-group-stage__lineup">
        {items.map((item, idx) => {
          const isSelected = activeIndex === idx;
          const isHovered = hoverIndex === idx;
          
          // Get exact Photoshop position for this pastor tag
          const pos = STAGE_POSITIONS[item.tag] || {
            zIndex: 10,
            leftPct: (idx / (items.length || 1)) * 90,
            widthPct: 10,
            heightPct: 95
          };

          return (
            <div
              key={`pastor-figure-${idx}`}
              ref={(el) => (figuresRef.current[idx] = el)}
              className={`pastoral-group-stage__figure ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''}`}
              style={{
                left: `${pos.leftPct}%`,
                width: `${pos.widthPct}%`,
                height: `${pos.heightPct}%`,
                bottom: 0,
                zIndex: pos.zIndex // Stays strictly in its layer depth (does not jump to front)
              }}
              onClick={() => handleSelect(idx)}
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(-1)}
              role="button"
              tabIndex={0}
              aria-label={item.title || item.name}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(idx)}
            >
              {/* Cutout Silhouette Image */}
              <img
                src={item.src}
                alt={item.title || item.name || 'Pastor'}
                className="pastoral-group-stage__img"
                loading="eager"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ElasticReel;
