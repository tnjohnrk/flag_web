'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import './FlagPreloader.css';

const CLOUDINARY_MOBILE_VIDEO_URL =
  'https://res.cloudinary.com/hqsoyezk/video/upload/w_1080,c_limit,q_auto,ac_none,f_auto/v1793953957/flagweb/preloader1_4k.mp4';
const CLOUDINARY_2K_VIDEO_URL =
  'https://res.cloudinary.com/hqsoyezk/video/upload/w_1920,h_1080,c_scale,q_auto:best,ac_none,f_auto/v1793953957/flagweb/preloader1_4k.mp4';
const CLOUDINARY_4K_VIDEO_URL =
  'https://res.cloudinary.com/hqsoyezk/video/upload/w_3840,h_2160,c_scale,q_100,ac_none,f_auto/v1793953957/flagweb/preloader1_4k.mp4';

const EXIT_ANIMATION_DURATION = 0.25;

export default function FlagPreloader({ onComplete }) {
  const [preloaderState, setPreloaderState] = useState('INITIALIZING');
  const overlayRef = useRef(null);
  const videoRef = useRef(null);
  const isFinishedRef = useRef(false);

  const unlockBodyScroll = useCallback(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
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
    document.body.style.overflow = 'hidden';

    // Maximum safety timeout: 11.5s (full video is 10s)
    const maxSafetyMs = 11500;
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
          // If browser restricts autoplay (common on iOS/Android), dismiss preloader smoothly
          if (!isFinishedRef.current) {
            triggerExitAnimation();
          }
        });
      }
    } else {
      triggerExitAnimation();
    }

    return () => {
      clearTimeout(safetyTimer);
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
      aria-hidden="true"
      role="presentation"
      onClick={triggerExitAnimation}
    >
      <div className="flag-video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          preload="metadata"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          onEnded={triggerExitAnimation}
          onError={triggerExitAnimation}
          onStalled={triggerExitAnimation}
          onWaiting={() => {
            // If buffering exceeds 1 second, exit immediately to never freeze the user
            setTimeout(() => {
              if (!isFinishedRef.current) triggerExitAnimation();
            }, 1000);
          }}
          aria-hidden="true"
          className="flag-cinematic-video"
        >
          {/* Mobile-first resolution stream */}
          <source src={CLOUDINARY_MOBILE_VIDEO_URL} type="video/mp4" media="(max-width: 767px)" />
          {/* Desktop 2K stream */}
          <source src={CLOUDINARY_2K_VIDEO_URL} type="video/mp4" media="(max-width: 1920px)" />
          {/* 4K Ultra-HD stream */}
          <source src={CLOUDINARY_4K_VIDEO_URL} type="video/mp4" />
          {/* Direct Raw Stream Fallback */}
          <source src="https://res.cloudinary.com/hqsoyezk/video/upload/v1793953957/flagweb/preloader1_4k.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
