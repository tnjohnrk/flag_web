'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import './FlagPreloader.css';
import { getMediaUrl } from '@/lib/media';

const ORIGINAL_LOGO_SRC = getMediaUrl('/images/flag-logo.png');

export default function FlagPreloader({ onComplete }) {
  const [preloaderState, setPreloaderState] = useState('INITIALIZING');
  const [progress, setProgress] = useState(0);

  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const isFinishedRef = useRef(false);
  const timelineRef = useRef(null);

  const unlockBodyScroll = useCallback(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-finished', 'preloader-nav-ready');
    }
  }, []);

  const triggerExitAnimation = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setPreloaderState('EXITING');

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('hasSeenPreloader', 'true');
      } catch (_) {}
      unlockBodyScroll();
      window.dispatchEvent(new Event('preloader-nav-ready'));
    }

    const overlay = overlayRef.current;
    if (overlay && typeof window !== 'undefined' && gsap) {
      gsap.to(overlay, {
        opacity: 0,
        scale: 1.02,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          setPreloaderState('REMOVED');
          unlockBodyScroll();
          onComplete?.();
        },
      });
    } else {
      setPreloaderState('REMOVED');
      unlockBodyScroll();
      onComplete?.();
    }
  }, [onComplete, unlockBodyScroll]);

  const completeImmediately = useCallback(() => {
    isFinishedRef.current = true;
    setPreloaderState('REMOVED');
    unlockBodyScroll();

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('hasSeenPreloader', 'true');
      } catch (_) {}
      window.dispatchEvent(new Event('preloader-nav-ready'));
    }

    onComplete?.();
  }, [onComplete, unlockBodyScroll]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenPreloader || prefersReducedMotion) {
      completeImmediately();
      return;
    }

    setPreloaderState('VISIBLE');
    document.documentElement.classList.add('preloader-active');
    document.body.classList.add('preloader-active');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Keyboard shortcut for accessibility
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isFinishedRef.current) {
        triggerExitAnimation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // GSAP Percentage Counter Animation from 0 to 100
    const counterObj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        // When counter reaches 100%, smooth transition to home page
        gsap.delayedCall(0.2, () => {
          if (!isFinishedRef.current) {
            triggerExitAnimation();
          }
        });
      },
    });

    timelineRef.current = tl;

    // Smooth content entrance
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }

    // Bold countdown animation (0% to 100% over 2.0 seconds)
    tl.to(counterObj, {
      val: 100,
      duration: 2.0,
      ease: 'power1.inOut',
      onUpdate: () => {
        setProgress(Math.round(counterObj.val));
      },
    });

    // Safety timeout fallback (4.5s)
    const safetyTimer = setTimeout(() => {
      if (!isFinishedRef.current) {
        triggerExitAnimation();
      }
    }, 4500);

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
      tl.kill();
      unlockBodyScroll();
    };
  }, [completeImmediately, triggerExitAnimation, unlockBodyScroll]);

  if (preloaderState === 'REMOVED') {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`flag-clean-preloader ${preloaderState === 'EXITING' ? 'is-exiting' : ''}`}
      aria-hidden={preloaderState === 'EXITING'}
      role="region"
      aria-label="Site loading preloader"
    >
      {/* Central Content: Original Logo & Bold 0-100% Count */}
      <div ref={contentRef} className="flag-preloader-center-content">
        {/* Original Logo */}
        <div className="flag-preloader-logo-frame">
          <Image
            src={ORIGINAL_LOGO_SRC}
            alt="Full Life AG Church Logo"
            width={190}
            height={190}
            priority
            className="flag-preloader-original-logo"
          />
        </div>

        {/* Bold Countdown with Proper Typography Font */}
        <div className="flag-preloader-counter-wrap" aria-live="polite">
          <span className="flag-preloader-counter-num">{progress}</span>
          <span className="flag-preloader-counter-pct">%</span>
        </div>

        {/* Minimal Progress Bar */}
        <div
          className="flag-preloader-bar-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Site loading progress"
        >
          <div
            className="flag-preloader-bar-indicator"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Church Title & Motto */}
        <div className="flag-preloader-typography">
          <h2 className="flag-preloader-title">Full Life AG Church</h2>
          <p className="flag-preloader-subtitle">Presence &bull; Power &bull; Purpose</p>
        </div>
      </div>
    </div>
  );
}
