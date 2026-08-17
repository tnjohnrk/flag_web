'use client';

import { useEffect, useRef } from 'react';

export default function HeroSection({ children }) {
  const trackRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const track = trackRef.current;
    const hero = heroRef.current;
    if (!track || !hero) return;

    let rafId = null;

    const updateShrinkEffect = () => {
      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) {
        rafId = null;
        return;
      }

      // Progress normalized from 0 to 1 as track scrolls through viewport
      const scrollOffset = -rect.top;
      const progress = Math.min(Math.max(scrollOffset / totalScrollableDistance, 0), 1);

      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      // Responsive Shrink Parameters (No rotation, no flipping, upright visual stability)
      // Desktop: width 100% -> 88%, height 100% -> 84%, radius 0px -> 36px, scale 1 -> 0.92
      // Tablet: width 100% -> 91%, height 100% -> 87%, radius 0px -> 28px, scale 1 -> 0.94
      // Mobile: width 100% -> 94%, height 100% -> 90%, radius 0px -> 20px, scale 1 -> 0.96

      const targetWidth = isMobile ? (100 - progress * 6) : isTablet ? (100 - progress * 9) : (100 - progress * 12);
      const targetHeight = isMobile ? (100 - progress * 8) : isTablet ? (100 - progress * 11) : (100 - progress * 16);
      const targetRadius = isMobile ? (progress * 20) : isTablet ? (progress * 28) : (progress * 36);
      const targetScale = isMobile ? (1 - progress * 0.04) : isTablet ? (1 - progress * 0.06) : (1 - progress * 0.08);

      const shadowOpacity = (progress * 0.45).toFixed(2);
      const shadowY = Math.round(progress * 24);
      const shadowBlur = Math.round(progress * 50);

      hero.style.width = `${targetWidth}%`;
      hero.style.height = `${targetHeight}%`;
      hero.style.borderRadius = `${targetRadius}px`;
      hero.style.transform = `scale(${targetScale})`;
      hero.style.boxShadow = progress > 0.01
        ? `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
        : 'none';

      rafId = null;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateShrinkEffect);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial update
    updateShrinkEffect();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={trackRef} className="hero-scroll-track relative w-full h-[160vh] md:h-[165vh]">
      <div className="hero-sticky-stage sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden z-10 bg-background transition-colors duration-750">
        <div
          ref={heroRef}
          className="div hero-container relative w-full h-full overflow-hidden"
          style={{
            transformOrigin: 'center center',
            willChange: 'width, height, border-radius, box-shadow, transform',
          }}
        >
          {/* Cloudinary Hero Video Container */}
          <div className="hero-video-wrapper absolute inset-0 w-full h-full z-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="https://res.cloudinary.com/r8qlzh1b/video/upload/f_auto,q_auto,so_0/hero_session_video.jpg"
              className="hero-video-bg w-full h-full object-cover object-center"
            >
              <source
                src="https://res.cloudinary.com/r8qlzh1b/video/upload/f_auto,q_auto/hero_session_video.mp4"
                type="video/mp4"
              />
              <source
                src="https://res.cloudinary.com/r8qlzh1b/video/upload/f_auto,q_auto/hero_session_video.webm"
                type="video/webm"
              />
            </video>
            <div className="hero-video-overlay absolute inset-0 pointer-events-none" />
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
