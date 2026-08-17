'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

export default function SpecularNavItem({ href, name, isActive, isHeroVisible, onClick, className = '' }) {
  const itemRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Disable hover proximity logic on touch/coarse devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const el = itemRef.current;
    if (!el) return;

    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Proximity calculation from center of nav item
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        const maxDist = 140; // Proximity radius in px
        let targetOpacity = 0;

        if (dist < maxDist) {
          // Smooth falloff curve
          targetOpacity = Math.max(0, (1 - dist / maxDist) ** 1.3);
        }

        setPos({ x: Math.round(x), y: Math.round(y) });
        setOpacity(Number(targetOpacity.toFixed(3)));

        rafId = null;
      });
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (el) el.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Link
      ref={itemRef}
      href={href}
      onClick={onClick}
      className={`nav-indiv-item group relative font-sans-clean font-bold text-xs lg:text-sm tracking-wider px-3.5 py-2 transition-all duration-300 ease-out transform select-none overflow-hidden ${
        isHeroVisible
          ? `bg-transparent ${isActive ? "text-[#D9A31A]" : "text-white"} hover:text-[#D9A31A] hover:bg-white/10 hover:scale-105 rounded-lg border-none shadow-none`
          : `bg-black/90 ${isActive ? "text-[#D9A31A]" : "text-white"} hover:text-[#D9A31A] hover:bg-black hover:scale-105 rounded-xl shadow-md border border-white/10`
      } ${className}`}
    >
      {/* 1. Specular 1px Edge Border Highlight (Follows cursor position around perimeter) */}
      <span
        className="specular-edge-border absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: opacity,
          padding: '1px',
          background: `radial-gradient(110px circle at ${pos.x}px ${pos.y}px, rgba(217, 163, 26, 0.95) 0%, rgba(255, 223, 128, 0.65) 40%, rgba(255, 255, 255, 0.25) 65%, transparent 85%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* 2. Inner Specular Glare/Reflection Layer */}
      <span
        className="specular-glare-bg absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: opacity * 0.22,
          background: `radial-gradient(75px circle at ${pos.x}px ${pos.y}px, rgba(217, 163, 26, 0.3) 0%, transparent 80%)`,
        }}
      />

      {/* Item Label */}
      <span className="relative z-10">{name}</span>

      {/* Active Indicator Accent Line */}
      {isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#D9A31A] rounded-full transition-all duration-300 z-10" />
      )}
    </Link>
  );
}
