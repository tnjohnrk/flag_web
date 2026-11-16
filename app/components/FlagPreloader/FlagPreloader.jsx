'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import './FlagPreloader.css';
import { getMediaUrl } from '@/lib/media';
import { CLOUDINARY_LIBRARY } from '@/lib/cloudinaryLibrary';

const PRELOADER_AUDIO_URL = CLOUDINARY_LIBRARY.preloader.videoRaw;
const EMBLEM_SRC = getMediaUrl('/images/flag-logo-emblem.png');

export default function FlagPreloader({ onComplete }) {
  const [preloaderState, setPreloaderState] = useState('INITIALIZING');
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const overlayRef = useRef(null);
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
        scale: 1.06,
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

    // Audio setup (muted by default for browser compliance)
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.muted = true;
      audioEl.volume = 0;
      audioEl.setAttribute('muted', '');
      audioEl.play().catch(() => {});
    }

    // Smooth 3D progress timeline (2.4s duration)
    const progressObj = { value: 0 };
    const fillTimeline = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        // Hold for 450ms to let user see 100% complete logo with 3D specular shine
        gsap.delayedCall(0.55, () => {
          if (!isFinishedRef.current) {
            triggerExitAnimation();
          }
        });
      },
    });

    timelineRef.current = fillTimeline;

    fillTimeline.to(progressObj, {
      value: 100,
      duration: 2.4,
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

  // Soft organic feathered color fill mask (no scan line)
  const isFinished = progress >= 100;
  const maskStyle = isFinished
    ? { WebkitMaskImage: 'none', maskImage: 'none' }
    : {
        WebkitMaskImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(0, progress - 10)}%, rgba(0,0,0,0) ${Math.min(100, progress + 10)}%, rgba(0,0,0,0) 100%)`,
        maskImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(0, progress - 10)}%, rgba(0,0,0,0) ${Math.min(100, progress + 10)}%, rgba(0,0,0,0) 100%)`,
      };

  // Subtle 3D dynamic tilt based on progress
  const rotX = Math.round(5 * (1 - progress / 100));
  const rotY = Math.round(-6 * (1 - progress / 100));
  const dynamic3dStyle = {
    transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${0.96 + (progress / 100) * 0.08})`,
  };

  return (
    <div
      ref={overlayRef}
      className={`flag-logo-preloader-root ${preloaderState === 'EXITING' ? 'is-exiting' : ''}`}
      aria-hidden={preloaderState === 'EXITING'}
      role="region"
      aria-label="Site introduction"
    >
      {/* Ambient 3D Depth Glow */}
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

      {/* Top Controls: Audio On/Off with Equalizer Frequency Bars + Skip Button */}
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

      {/* Center 3D Stage */}
      <div className="flag-logo-stage-wrapper">
        <div className="flag-logo-3d-stage">
          <div
            className={`flag-logo-3d-card ${isComplete ? 'is-complete' : ''}`}
            style={dynamic3dStyle}
          >
            {/* Layer 1: Ghost Silhouette Base (Pure emblem, no white disc) */}
            <img
              src={EMBLEM_SRC}
              alt="FLAG Church Emblem Base"
              className="flag-logo-ghost-emblem"
              width={300}
              height={300}
              priority="true"
            />

            {/* Layer 2: Organic Feathered Color Fill Layer (Smooth color bloom, no hard scan) */}
            <div
              className="flag-logo-fill-layer"
              style={maskStyle}
              aria-hidden="true"
            >
              <img
                src={EMBLEM_SRC}
                alt="FLAG Church Emblem Color Fill"
                className="flag-logo-color-emblem"
                width={300}
                height={300}
              />
            </div>

            {/* Layer 3: 3D Gloss Specular Sheen (sweeps across on 100% completion) */}
            <div className="flag-logo-specular" aria-hidden="true" />
          </div>
        </div>

        {/* Single Unified Signature Gold Typography (#D9A31A) */}
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
