'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import './FlagPreloader.css';
import { getMediaUrl } from '@/lib/media';
import { CLOUDINARY_LIBRARY } from '@/lib/cloudinaryLibrary';

const PRELOADER_AUDIO_URL = CLOUDINARY_LIBRARY.preloader.videoRaw;
const ORIGINAL_LOGO_SRC = getMediaUrl('/images/flag-logo.png');

export default function FlagPreloader({ onComplete }) {
  const [preloaderState, setPreloaderState] = useState('INITIALIZING');
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const audioRef = useRef(null);
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

    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
      } catch (_) {}
    }

    const overlay = overlayRef.current;
    if (overlay && typeof window !== 'undefined' && gsap) {
      gsap.to(overlay, {
        opacity: 0,
        scale: 1.04,
        duration: 0.45,
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
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.muted) {
      audio.muted = false;
      audio.volume = 1.0;
      audio.play().catch(() => {});
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, []);

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

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isFinishedRef.current) {
        triggerExitAnimation();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Audio setup
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.muted = true;
      audioEl.volume = 0;
      audioEl.setAttribute('muted', '');
      audioEl.play().catch(() => {});
    }

    // GSAP Percentage Counter Animation from 0 to 100
    const counterObj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        // When counter reaches 100%, hold briefly (250ms) then enter the home page
        gsap.delayedCall(0.25, () => {
          if (!isFinishedRef.current) {
            triggerExitAnimation();
          }
        });
      },
    });

    timelineRef.current = tl;

    // Smooth entrance of preloader card
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.94, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }

    // Count percentage from 0 to 100 over 2.2 seconds
    tl.to(counterObj, {
      val: 100,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        setProgress(Math.round(counterObj.val));
      },
    });

    // Safety timeout (5s fallback)
    const safetyTimer = setTimeout(() => {
      if (!isFinishedRef.current) {
        triggerExitAnimation();
      }
    }, 5000);

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
      tl.kill();
      unlockBodyScroll();
    };
  }, [completeImmediately, toggleAudio, triggerExitAnimation, unlockBodyScroll]);

  if (preloaderState === 'REMOVED') {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`flag-clean-preloader ${preloaderState === 'EXITING' ? 'is-exiting' : ''}`}
      aria-hidden={preloaderState === 'EXITING'}
      role="region"
      aria-label="Site introduction"
    >
      {/* Ambient Depth Glow */}
      <div className="flag-preloader-ambient-glow" aria-hidden="true" />

      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={PRELOADER_AUDIO_URL}
        preload="auto"
        muted={isMuted}
        loop
        playsInline
      />

      {/* Top Controls: Audio On/Off + Skip Button */}
      <div className="flag-preloader-controls">
        <button
          type="button"
          className={`flag-preloader-circle-audio-btn ${!isMuted ? 'is-active' : ''}`}
          onClick={toggleAudio}
          aria-label={isMuted ? 'Sound off. Click to turn sound on' : 'Sound on. Click to mute sound'}
          title={isMuted ? 'Sound off' : 'Sound on'}
        >
          <span className="flag-preloader-freq-symbol" aria-hidden="true">
            <span className="flag-preloader-freq-bar" />
            <span className="flag-preloader-freq-bar" />
            <span className="flag-preloader-freq-bar" />
            <span className="flag-preloader-freq-bar" />
          </span>
        </button>

        <button
          type="button"
          className="flag-preloader-skip-btn"
          onClick={(e) => {
            e.stopPropagation();
            triggerExitAnimation();
          }}
          aria-label="Skip preloader"
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

      {/* Central Content: Original Logo & 0-100% Progress */}
      <div ref={contentRef} className="flag-preloader-center-content">
        {/* Original Logo Card */}
        <div className="flag-preloader-logo-frame">
          <div className="flag-preloader-logo-glow" aria-hidden="true" />
          <Image
            src={ORIGINAL_LOGO_SRC}
            alt="Full Life AG Church Logo"
            width={200}
            height={200}
            priority
            className="flag-preloader-original-logo"
          />
        </div>

        {/* Count Percentage (0 to 100%) */}
        <div className="flag-preloader-counter-wrap" aria-live="polite">
          <span className="flag-preloader-counter-num">{progress}</span>
          <span className="flag-preloader-counter-pct">%</span>
        </div>

        {/* Progress Bar */}
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
