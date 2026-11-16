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
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const isFinishedRef = useRef(false);
  const timelineRef = useRef(null);
  const animFrameRef = useRef(null);

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
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
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

  // Main Water Pouring & Logo Filling Animation Effect
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

    // Canvas Liquid Simulation Setup
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Retina display resolution
    const dpr = window.devicePixelRatio || 1;
    const width = 360;
    const height = 400;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Offscreen Canvas for logo liquid masking
    const logoSize = 270;
    const logoX = (width - logoSize) / 2;
    const logoY = height - logoSize - 16; // Emblem positioned at bottom, top is for water pouring stream

    const offCanvas = document.createElement('canvas');
    offCanvas.width = logoSize;
    offCanvas.height = logoSize;
    const offCtx = offCanvas.getContext('2d');

    const ghostCanvas = document.createElement('canvas');
    ghostCanvas.width = logoSize;
    ghostCanvas.height = logoSize;
    const ghostCtx = ghostCanvas.getContext('2d');

    let imgLoaded = false;
    const emblemImg = new Image();
    emblemImg.crossOrigin = 'anonymous';
    emblemImg.src = EMBLEM_SRC;
    emblemImg.onload = () => {
      imgLoaded = true;
      if (ghostCtx) {
        ghostCtx.filter = 'grayscale(100%) brightness(55%)';
        ghostCtx.drawImage(emblemImg, 0, 0, logoSize, logoSize);
      }
    };

    // Splash Particles and Bubbles Physics
    const particles = [];
    const bubbles = [];

    // GSAP Progress Control (0 to 100% over 2.7 seconds)
    const progressObj = { value: 0 };
    const fillTimeline = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        // Hold for 450ms for completed logo celebration
        gsap.delayedCall(0.5, () => {
          if (!isFinishedRef.current) {
            triggerExitAnimation();
          }
        });
      },
    });

    timelineRef.current = fillTimeline;

    fillTimeline.to(progressObj, {
      value: 100,
      duration: 2.7,
      ease: 'power1.inOut',
      onUpdate: () => {
        setProgress(Math.round(progressObj.value));
      },
    });

    // 60FPS Fluid Physics Render Loop
    let startTime = performance.now();

    const render = (now) => {
      const time = (now - startTime) * 0.001;
      const currentProgress = progressObj.value / 100;
      const streamActive = currentProgress < 0.94; // Stream pours until ~94% then tapers off

      ctx.clearRect(0, 0, width, height);

      if (imgLoaded) {
        // 1. Draw Ghost Silhouette Base (Wireframe/unfilled container)
        ctx.globalAlpha = 0.22;
        ctx.drawImage(ghostCanvas, logoX, logoY, logoSize, logoSize);
        ctx.globalAlpha = 1.0;

        // 2. Liquid Surface Wave Physics
        // Level rises from bottom (logoSize) to top (0)
        const currentWaterY = logoSize * (1 - currentProgress);
        // Amplitude is energetic while stream is pouring, smoothly settles when full
        const waveAmp = (1 - currentProgress * 0.4) * (streamActive ? 6.5 : Math.max(0, (1 - currentProgress) * 6));

        const getWaveY = (lx) => {
          return (
            currentWaterY +
            Math.sin(lx * 0.05 + time * 6) * waveAmp +
            Math.cos(lx * 0.025 - time * 4) * (waveAmp * 0.55)
          );
        };

        // 3. Render Liquid Inside Emblem via Offscreen Buffer
        if (offCtx && currentProgress > 0.01) {
          offCtx.clearRect(0, 0, logoSize, logoSize);
          offCtx.drawImage(emblemImg, 0, 0, logoSize, logoSize);

          // Clip to wavy water polygon
          offCtx.globalCompositeOperation = 'destination-in';
          offCtx.beginPath();
          offCtx.moveTo(0, logoSize);
          offCtx.lineTo(0, getWaveY(0));
          for (let lx = 0; lx <= logoSize; lx += 4) {
            offCtx.lineTo(lx, getWaveY(lx));
          }
          offCtx.lineTo(logoSize, logoSize);
          offCtx.closePath();
          offCtx.fillStyle = '#ffffff';
          offCtx.fill();

          offCtx.globalCompositeOperation = 'source-over';

          // Draw liquid filled emblem on main canvas
          ctx.drawImage(offCanvas, logoX, logoY);

          // 4. Luminous Wave Crest / Liquid Meniscus Glow Line
          if (currentProgress < 0.99) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(logoX, logoY + getWaveY(0));
            for (let lx = 0; lx <= logoSize; lx += 4) {
              ctx.lineTo(logoX + lx, logoY + getWaveY(lx));
            }
            ctx.strokeStyle = 'rgba(217, 163, 26, 0.85)';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#D9A31A';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();
          }
        }

        // 5. Water Pouring Stream (Falling from top into logo)
        const streamX = width / 2;
        const impactY = logoY + getWaveY(logoSize / 2);

        if (streamActive && impactY > 0) {
          // Stream width tapers as it accelerates
          const streamWidth = Math.max(4, 8 * (1 - currentProgress * 0.3));
          const wobble = Math.sin(time * 12) * 1.5;

          ctx.save();
          // Outer liquid glow
          const streamGrad = ctx.createLinearGradient(streamX - streamWidth, 0, streamX + streamWidth, 0);
          streamGrad.addColorStop(0, 'rgba(217, 163, 26, 0.2)');
          streamGrad.addColorStop(0.3, 'rgba(217, 163, 26, 0.8)');
          streamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
          streamGrad.addColorStop(0.7, 'rgba(217, 163, 26, 0.8)');
          streamGrad.addColorStop(1, 'rgba(217, 163, 26, 0.2)');

          ctx.fillStyle = streamGrad;
          ctx.beginPath();
          ctx.moveTo(streamX - streamWidth * 1.4, 0);
          ctx.lineTo(streamX + streamWidth * 1.4, 0);
          ctx.quadraticCurveTo(
            streamX + wobble + streamWidth * 0.8,
            impactY * 0.5,
            streamX + streamWidth * 0.5,
            impactY
          );
          ctx.lineTo(streamX - streamWidth * 0.5, impactY);
          ctx.quadraticCurveTo(
            streamX + wobble - streamWidth * 0.8,
            impactY * 0.5,
            streamX - streamWidth * 1.4,
            0
          );
          ctx.closePath();
          ctx.fill();

          // Stream impact splash ring at contact point
          ctx.beginPath();
          ctx.ellipse(streamX, impactY, streamWidth * 2.2, streamWidth * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(217, 163, 26, 0.9)';
          ctx.shadowColor = '#D9A31A';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();

          // Spawn splash droplets at impact
          if (Math.random() < 0.6) {
            particles.push({
              x: streamX + (Math.random() - 0.5) * 10,
              y: impactY,
              vx: (Math.random() - 0.5) * 3.5,
              vy: -Math.random() * 4 - 1.5,
              r: Math.random() * 1.8 + 1,
              alpha: 0.9,
            });
          }

          // Spawn rising bubbles inside the water
          if (Math.random() < 0.35 && impactY < logoY + logoSize) {
            bubbles.push({
              x: streamX + (Math.random() - 0.5) * 30,
              y: Math.min(logoY + logoSize - 10, impactY + Math.random() * 40 + 10),
              vx: (Math.random() - 0.5) * 0.5,
              vy: -Math.random() * 1.5 - 1,
              r: Math.random() * 2 + 1,
              alpha: 0.7,
            });
          }
        }

        // 6. Update and Draw Splash Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.22; // Gravity
          p.alpha -= 0.04;

          if (p.alpha <= 0 || p.y > height) {
            particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(217, 163, 26, ${p.alpha})`;
          ctx.shadowColor = '#D9A31A';
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        // 7. Update and Draw Rising Bubbles inside Water
        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i];
          b.x += b.vx + Math.sin(time * 4 + i) * 0.3;
          b.y += b.vy;
          b.alpha -= 0.015;

          const localLx = Math.max(0, Math.min(logoSize, b.x - logoX));
          const localSurfaceY = logoY + getWaveY(localLx);

          // Pop when reaching water surface
          if (b.y <= localSurfaceY || b.alpha <= 0) {
            bubbles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${b.alpha * 0.8})`;
          ctx.lineWidth = 1;
          ctx.fillStyle = `rgba(217, 163, 26, ${b.alpha * 0.3})`;
          ctx.fill();
          ctx.stroke();
        }
      }

      if (!isFinishedRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

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
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      unlockBodyScroll();
    };
  }, [completeImmediately, toggleAudio, triggerExitAnimation, unlockBodyScroll]);

  if (preloaderState === 'REMOVED') {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`flag-water-preloader-root ${preloaderState === 'EXITING' ? 'is-exiting' : ''}`}
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

      {/* Central Water Pouring & Logo Fill Stage */}
      <div className="flag-water-stage-wrapper">
        <div className={`flag-water-canvas-container ${isComplete ? 'is-complete' : ''}`}>
          <canvas ref={canvasRef} className="flag-water-canvas" />
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
