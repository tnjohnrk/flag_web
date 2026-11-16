'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import './FlagPreloader.css';
import { getMediaUrl } from '@/lib/media';
import { CLOUDINARY_LIBRARY } from '@/lib/cloudinaryLibrary';

const PRELOADER_AUDIO_URL = CLOUDINARY_LIBRARY.preloader.videoRaw;
const LOGO_SRC = getMediaUrl('/images/flag-logo.png');

export default function FlagPreloader({ onComplete }) {
  const [preloaderState, setPreloaderState] = useState('INITIALIZING');
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const overlayRef = useRef(null);
  const audioRef = useRef(null);
  const logoStageRef = useRef(null);
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
        scale: 1.05,
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

    // Keyboard shortcuts: Escape to skip, M to toggle sound
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isFinishedRef.current) {
        triggerExitAnimation();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Audio setup (muted by default for browser autoplay compliance)
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.muted = true;
      audioEl.volume = 0;
      audioEl.setAttribute('muted', '');
      audioEl.play().catch(() => {});
    }

    // GSAP liquid color fill animation
    const progressObj = { value: 0 };
    const fillTimeline = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        // Hold for 400ms to let user see 100% complete logo with light sweep
        gsap.delayedCall(0.5, () => {
          if (!isFinishedRef.current) {
            triggerExitAnimation();
          }
        });
      },
    });

    timelineRef.current = fillTimeline;

    // Smooth filling from 0 to 100% over 2.6 seconds
    fillTimeline.to(progressObj, {
      value: 100,
      duration: 2.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        setProgress(Math.round(progressObj.value));
      },
    });

    // Fallback safety timeout (6s)
    const safetyTimer = setTimeout(() => {
      if (!isFinishedRef.current) {
        triggerExitAnimation();
      }
    }, 6000);

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
      fillTimeline.kill();
      unlockBodyScroll();
    };
  }, [completeImmediately, toggleAudio, triggerExitAnimation, unlockBodyScroll]);

  if (preloaderState === 'REMOVED') {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`flag-logo-preloader-root ${preloaderState === 'EXITING' ? 'is-exiting' : ''}`}
      aria-hidden={preloaderState === 'EXITING'}
      role="region"
      aria-label="Site introduction"
    >
      {/* Background Ambient Orbs */}
      <div className="flag-preloader-glow-orb flag-glow-orb-gold" aria-hidden="true" />
      <div className="flag-preloader-glow-orb flag-glow-orb-blue" aria-hidden="true" />

      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        src={PRELOADER_AUDIO_URL}
        preload="auto"
        muted={isMuted}
        loop
        playsInline
      />

      {/* Top Controls: Audio On/Off with Frequency Visualizer + Skip Button */}
      <div className="flag-preloader-controls">
        <button
          type="button"
          className={`flag-preloader-circle-audio-btn ${!isMuted ? 'is-active' : ''}`}
          onClick={toggleAudio}
          aria-label={isMuted ? 'Sound off. Click to turn sound on' : 'Sound on. Click to mute sound'}
          title={isMuted ? 'Sound off' : 'Sound on'}
        >
          {/* 4 Frequency Indicator Bars */}
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

      {/* Center Logo Stage */}
      <div className="flag-logo-stage-wrapper">
        <div
          ref={logoStageRef}
          className={`flag-logo-stage ${isComplete ? 'is-complete' : ''}`}
        >
          {/* Layer 1: Base Ghost Silhouette (Unfilled background shape) */}
          <img
            src={LOGO_SRC}
            alt="Full Life AG Church Logo Silhouette"
            className="flag-logo-ghost"
            width={340}
            height={340}
          />

          {/* Layer 2: Color Fill Reservoir (Rises from bottom 0% to top 100%) */}
          <div
            className="flag-fill-reservoir"
            style={{ height: `${progress}%` }}
            aria-hidden="true"
          >
            <div className="flag-fill-content">
              <img
                src={LOGO_SRC}
                alt="Full Life AG Church Logo Color Fill"
                className="flag-logo-color"
                width={340}
                height={340}
              />
            </div>

            {/* Rising Meniscus Glow Beam with Surface Waves */}
            <div className="flag-fill-meniscus-beam" />
            <div className="flag-wave-container">
              <svg className="flag-wave-svg wave-back" viewBox="0 0 1200 60" preserveAspectRatio="none">
                <path
                  d="M0,20 C150,45 350,-10 500,20 C650,50 850,-10 1000,20 C1100,35 1150,10 1200,20 L1200,60 L0,60 Z"
                  fill="rgba(217, 163, 26, 0.4)"
                />
              </svg>
              <svg className="flag-wave-svg wave-front" viewBox="0 0 1200 60" preserveAspectRatio="none">
                <path
                  d="M0,15 C200,-15 400,35 600,15 C800,-15 1000,35 1200,15 L1200,60 L0,60 Z"
                  fill="rgba(25, 118, 210, 0.4)"
                />
              </svg>
            </div>
          </div>

          {/* Layer 3: Diagonal Light Sweep Flash on 100% completion */}
          <div className="flag-logo-sweep-container" aria-hidden="true">
            <div className="flag-logo-light-sweep" />
          </div>
        </div>

        {/* Progress Counter, Loading Bar & Church Brand Typography */}
        <div className="flag-preloader-meta">
          <div className="flag-preloader-percent" aria-live="polite">
            <span>{progress}</span>
            <span className="flag-preloader-percent-symbol">%</span>
          </div>

          <div
            className="flag-preloader-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading Full Life AG Church"
          >
            <div
              className="flag-preloader-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h2 className="flag-preloader-brand-title">Full Life AG Church</h2>
          <span className="flag-preloader-brand-sub">Presence &bull; Power &bull; Purpose</span>
        </div>
      </div>
    </div>
  );
}
