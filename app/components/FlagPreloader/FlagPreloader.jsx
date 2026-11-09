'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import './FlagPreloader.css';
import { CLOUDINARY_LIBRARY } from '@/lib/cloudinaryLibrary';

const PRELOADER_MOBILE_URL = CLOUDINARY_LIBRARY.preloader.videoMobile;
const PRELOADER_2K_URL = CLOUDINARY_LIBRARY.preloader.video2k;
const PRELOADER_4K_URL = CLOUDINARY_LIBRARY.preloader.video4k;
const PRELOADER_RAW_URL = CLOUDINARY_LIBRARY.preloader.videoRaw;
const PRELOADER_POSTER_URL = CLOUDINARY_LIBRARY.preloader.poster;

const EXIT_ANIMATION_DURATION = 0.25;

export default function FlagPreloader({ onComplete }) {
  const [preloaderState, setPreloaderState] = useState('INITIALIZING');
  const [isMuted, setIsMuted] = useState(true);
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

  const toggleAudio = useCallback((e) => {
    e?.stopPropagation?.();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // Keyboard listener: Escape triggers skip, M toggles audio
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isFinishedRef.current) {
        triggerExitAnimation();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleAudio();
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
          // If browser restricts autoplay, user can still use controls
        });
      }
    }

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
    };
  }, [completeImmediately, toggleAudio, triggerExitAnimation, unlockBodyScroll]);

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
      {/* Top Controls: Audio On/Off with Frequency Visualizer + Skip Button */}
      <div className="flag-preloader-controls">
        <div className="flag-preloader-audio-wrapper">
          <button
            type="button"
            className={`flag-preloader-circle-audio-btn ${!isMuted ? 'is-active' : ''}`}
            onClick={toggleAudio}
            aria-label={isMuted ? 'Sound off. Click to turn sound on' : 'Sound on. Click to mute sound'}
            title={isMuted ? 'Sound off' : 'Sound on'}
          >
            {/* 4 Frequency Indicator Bars centered in circle */}
            <span className="flag-preloader-freq-symbol" aria-hidden="true">
              <span className="flag-preloader-freq-bar" />
              <span className="flag-preloader-freq-bar" />
              <span className="flag-preloader-freq-bar" />
              <span className="flag-preloader-freq-bar" />
            </span>
          </button>

          {/* Tooltip badge matching user reference design */}
          <div className="flag-preloader-audio-tooltip" aria-hidden="true">
            {isMuted ? 'Sound off' : 'Sound on'}
          </div>
        </div>

        <button
          type="button"
          className="flag-preloader-skip-btn"
          onClick={(e) => {
            e.stopPropagation();
            triggerExitAnimation();
          }}
          aria-label="Skip introduction video"
          title="Skip intro"
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
      </div>

      <div className="flag-video-container">
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          playsInline
          webkit-playsinline="true"
          preload="auto"
          poster={PRELOADER_POSTER_URL}
          disablePictureInPicture
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          onEnded={triggerExitAnimation}
          onError={triggerExitAnimation}
          aria-hidden="true"
          className="flag-cinematic-video"
        >
          {/* Universal high performance responsive streams */}
          <source src={PRELOADER_4K_URL} type="video/mp4" media="(min-width: 1921px)" />
          <source src={PRELOADER_2K_URL} type="video/mp4" media="(min-width: 769px)" />
          <source src={PRELOADER_MOBILE_URL} type="video/mp4" media="(max-width: 768px)" />
          {/* Direct Raw Stream Fallback */}
          <source src={PRELOADER_RAW_URL} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
