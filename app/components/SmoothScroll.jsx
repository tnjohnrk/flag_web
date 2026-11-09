'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Respect system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.1,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Animation frame loop
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Synchronize Lenis state when overlays, preloader, or modals freeze body scroll
    const checkScrollLock = () => {
      const isLocked =
        document.body.style.overflow === 'hidden' ||
        document.documentElement.style.overflow === 'hidden' ||
        document.documentElement.classList.contains('preloader-active') ||
        document.body.classList.contains('preloader-active');

      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    // Initial check
    checkScrollLock();

    // Observe body & html style / class mutations for scroll locks
    const observer = new MutationObserver(checkScrollLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });

    // Handle hash anchor link clicks smoothly via Lenis
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -60, duration: 1.2 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
