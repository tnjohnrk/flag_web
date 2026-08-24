'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import './FlagPreloader.css';

const CLOUDINARY_4K_VIDEO_URL = 'https://res.cloudinary.com/r8qlzh1b/video/upload/w_3840,h_2160,c_limit,q_100,f_auto/FLAG_Cinematic_Website_Prel.mp4';
const CLOUDINARY_2K_VIDEO_URL = 'https://res.cloudinary.com/r8qlzh1b/video/upload/w_2560,h_1440,c_limit,q_100,f_auto/FLAG_Cinematic_Website_Prel.mp4';
const CLOUDINARY_RAW_VIDEO_URL = 'https://res.cloudinary.com/r8qlzh1b/video/upload/FLAG_Cinematic_Website_Prel.mp4';
const SAFETY_TIMEOUT_MS = 8000; // Extended maximum safety threshold so full video completes naturally
const EXIT_ANIMATION_DURATION = 0.25; // 250ms fade transition

export default function FlagPreloader({ onComplete }) {
  // States: 'INITIALIZING' | 'VISIBLE' | 'PLAYING' | 'EXITING' | 'REMOVED'
  const [preloaderState, setPreloaderState] = useState('INITIALIZING');
  const overlayRef = useRef(null);
  const videoRef = useRef(null);
  const isFinishedRef = useRef(false);

  useEffect(() => {
    // 1. Session Storage Guard: Only play once per browser session
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenPreloader || prefersReducedMotion) {
      completeImmediately();
      return;
    }

    setPreloaderState('VISIBLE');

    // 2. Lock underlying website interactions & scrolling
    document.body.style.overflow = 'hidden';

    // 3. Safety Fallback Timeout: Guarantee user never gets stuck
    const safetyTimer = setTimeout(() => {
      if (!isFinishedRef.current) {
        triggerExitAnimation();
      }
    }, SAFETY_TIMEOUT_MS);

    // 4. Attempt Autoplay programmatically for robust mobile/browser support
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.play().catch(() => {
        // Autoplay restricted or failed - trigger immediate graceful fallback
        if (!isFinishedRef.current) {
          triggerExitAnimation();
        }
      });
    }

    return () => {
      clearTimeout(safetyTimer);
      unlockBodyScroll();
    };
  }, []);

  const unlockBodyScroll = () => {
    document.body.style.overflow = '';
  };

  const completeImmediately = () => {
    isFinishedRef.current = true;
    setPreloaderState('REMOVED');
    unlockBodyScroll();

    // Signal navigation & page components that preloader has completed
    document.body.classList.add('preloader-finished', 'preloader-nav-ready');
    window.dispatchEvent(new Event('preloader-nav-ready'));

    if (onComplete) {
      onComplete();
    }
  };

  const triggerExitAnimation = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setPreloaderState('EXITING');

    // Mark preloader seen in session storage
    sessionStorage.setItem('hasSeenPreloader', 'true');

    // Announce finished state to trigger background site animations immediately
    document.body.classList.add('preloader-finished', 'preloader-nav-ready');
    window.dispatchEvent(new Event('preloader-nav-ready'));

    const overlay = overlayRef.current;
    const video = videoRef.current;

    // Use GSAP for high-performance premium 250ms fade + scale-down exit transition
    if (overlay && typeof window !== 'undefined' && gsap) {
      gsap.to(overlay, {
        opacity: 0,
        scale: 0.98,
        duration: EXIT_ANIMATION_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          setPreloaderState('REMOVED');
          unlockBodyScroll();
          if (video) video.pause();
          if (onComplete) onComplete();
        },
      });
    } else {
      // Fallback CSS exit if GSAP is unavailable
      setPreloaderState('REMOVED');
      unlockBodyScroll();
      if (onComplete) onComplete();
    }
  };

  const handleVideoEnded = () => {
    triggerExitAnimation();
  };

  const handleVideoError = () => {
    triggerExitAnimation();
  };

  if (preloaderState === 'REMOVED') {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`flag-cinematic-preloader ${preloaderState === 'EXITING' ? 'is-exiting' : ''}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="flag-video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          onStalled={handleVideoError}
          aria-hidden="true"
          className="flag-cinematic-video"
        >
          <source src={CLOUDINARY_4K_VIDEO_URL} type="video/mp4" />
          <source src={CLOUDINARY_2K_VIDEO_URL} type="video/mp4" />
          <source src={CLOUDINARY_RAW_VIDEO_URL} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}


