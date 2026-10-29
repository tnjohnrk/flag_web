'use client';

import { useEffect, useRef } from 'react';
import { getMediaUrl } from '@/lib/media';

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

      // Responsive Subtle Card Contraction (aligned with target screenshot size)
      // Desktop: width 100% -> 96.5%, height 100% -> 94.5%, radius 0px -> 22px
      // Tablet:  width 100% -> 97.0%, height 100% -> 95.5%, radius 0px -> 18px
      // Mobile:  width 100% -> 97.5%, height 100% -> 96.5%, radius 0px -> 14px

      const targetWidth = isMobile
        ? (100 - progress * 2.5)
        : isTablet
        ? (100 - progress * 3.0)
        : (100 - progress * 3.5);

      const targetHeight = isMobile
        ? (100 - progress * 3.5)
        : isTablet
        ? (100 - progress * 4.5)
        : (100 - progress * 5.5);

      const targetRadius = isMobile
        ? (progress * 14)
        : isTablet
        ? (progress * 18)
        : (progress * 22);

      const targetScale = 1;

      const shadowOpacity = (progress * 0.25).toFixed(2);
      const shadowY = Math.round(progress * 12);
      const shadowBlur = Math.round(progress * 30);

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
    <section ref={trackRef} className="hero-scroll-track relative w-full h-[115vh] md:h-[120vh]">
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
              poster="https://res.cloudinary.com/hqsoyezk/video/upload/f_auto,q_auto,so_0/v1793183004/flagweb/hero_loop_video.jpg"
              className="hero-video-bg w-full h-full object-cover object-center"
            >
              <source
                src="https://res.cloudinary.com/hqsoyezk/video/upload/f_auto,q_auto/v1793183004/flagweb/hero_loop_video.mp4"
                type="video/mp4"
              />
              <source
                src="https://res.cloudinary.com/hqsoyezk/video/upload/f_auto,q_auto/v1793183004/flagweb/hero_loop_video.webm"
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
