'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import './FlagPreloader.css';

const CLOUDINARY_MOBILE_VIDEO_URL =
  'https://res.cloudinary.com/hqsoyezk/video/upload/w_1080,c_limit,q_auto,ac_none,f_auto/v1793953957/flagweb/preloader1_4k.mp4';
const CLOUDINARY_2K_VIDEO_URL =
  'https://res.cloudinary.com/hqsoyezk/video/upload/w_1920,h_1080,c_scale,q_auto:best,ac_none,f_auto/v1793953957/flagweb/preloader1_4k.mp4';
const CLOUDINARY_4K_VIDEO_URL =
  'https://res.cloudinary.com/hqsoyezk/video/upload/w_3840,h_2160,c_scale,q_auto:best,ac_none,f_auto/v1793953957/flagweb/preloader1_4k.mp4';

const EXIT_ANIMATION_DURATION = 0.25;

export default function FlagPreloader({ onComplete }) {
  const [preloaderState, setPreloaderState] = useState('INITIALIZING');
  const overlayRef = useRef(null);
  const videoRef = useRef(null);
  const isFinishedRef = useRef(false);

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

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('hasSeenPreloader', 'true');
      } catch (_) {}
      unlockBodyScroll();
      window.dispatchEvent(new Event('preloader-nav-ready'));
    }

    const overlay = overlayRef.current;
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch (_) {}
    }

    if (overlay && typeof window !== 'undefined' && gsap) {
      gsap.to(overlay, {
        opacity: 0,
        scale: 0.98,
        duration: EXIT_ANIMATION_DURATION,
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
    const isMobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // If already seen or user prefers reduced motion, skip immediately
    if (hasSeenPreloader || prefersReducedMotion) {
      completeImmediately();
      return;
    }

    setPreloaderState('VISIBLE');
    document.documentElement.classList.add('preloader-active');
    document.body.classList.add('preloader-active');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Keyboard listener: Escape key triggers skip
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isFinishedRef.current) {
        triggerExitAnimation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Maximum safety timeout: 15s (video duration is ~10s)
    const maxSafetyMs = 15000;
    const safetyTimer = setTimeout(() => {
      if (!isFinishedRef.current) {
        triggerExitAnimation();
      }
    }, maxSafetyMs);

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = true;
      videoEl.volume = 0;
      videoEl.setAttribute('muted', '');
      videoEl.setAttribute('playsinline', '');
      videoEl.setAttribute('webkit-playsinline', '');

      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts autoplay, user can still use the Skip button
        });
      }
    }

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
    };
  }, [completeImmediately, triggerExitAnimation, unlockBodyScroll]);

  if (preloaderState === 'REMOVED') {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`flag-cinematic-preloader ${preloaderState === 'EXITING' ? 'is-exiting' : ''}`}
      aria-hidden={preloaderState === 'EXITING'}
      role="region"
      aria-label="Site introduction"
    >
      {/* Top-Right Corner Skip Button */}
      <button
        type="button"
        className="flag-preloader-skip-btn"
        onClick={(e) => {
          e.stopPropagation();
          triggerExitAnimation();
        }}
        aria-label="Skip introduction video"
      >
        <span>Skip</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flag-preloader-skip-icon"
          aria-hidden="true"
        >
          <polygon points="5 4 15 12 5 20 5 4" />
          <line x1="19" y1="5" x2="19" y2="19" strokeWidth="2.5" />
        </svg>
      </button>

      <div className="flag-video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          poster="https://res.cloudinary.com/hqsoyezk/video/upload/so_0,w_1920,f_auto,q_auto/v1793953957/flagweb/preloader1_4k.jpg"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          onEnded={triggerExitAnimation}
          onError={triggerExitAnimation}
          aria-hidden="true"
          className="flag-cinematic-video"
        >
          {/* Universal high performance responsive streams */}
          <source src={CLOUDINARY_2K_VIDEO_URL} type="video/mp4" media="(max-width: 2560px)" />
          <source src={CLOUDINARY_MOBILE_VIDEO_URL} type="video/mp4" media="(max-width: 768px)" />
          <source src={CLOUDINARY_4K_VIDEO_URL} type="video/mp4" />
          {/* Direct Raw Stream Fallback */}
          <source src="https://res.cloudinary.com/hqsoyezk/video/upload/v1793953957/flagweb/preloader1_4k.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
