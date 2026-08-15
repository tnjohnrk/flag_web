'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import './Preloader.css';

export default function Preloader() {
  const [stage, setStage] = useState('init'); // 'init' | 'popin' | 'linedraw' | 'split' | 'flyin' | 'done' | 'hidden'
  const [transformStyle, setTransformStyle] = useState({});
  const logoWrapperRef = useRef(null);

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenPreloader) {
      setStage('hidden');
      document.body.classList.add('preloader-finished', 'preloader-nav-ready');
      window.dispatchEvent(new Event('preloader-nav-ready'));
      return;
    }

    if (prefersReducedMotion) {
      setStage('popin');
      const exitTimer = setTimeout(() => {
        setStage('hidden');
        document.body.classList.add('preloader-finished', 'preloader-nav-ready');
        window.dispatchEvent(new Event('preloader-nav-ready'));
        sessionStorage.setItem('hasSeenPreloader', 'true');
      }, 800);
      return () => clearTimeout(exitTimer);
    }

    // Lock scroll during preloader
    document.body.style.overflow = 'hidden';

    // Calculate dynamic transform from center to navbar logo
    const calculateFlyTransform = () => {
      const targetLogo = document.querySelector('.navbar-logo') || document.querySelector('.logo');
      if (targetLogo) {
        const rect = targetLogo.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        const currentX = window.innerWidth / 2;
        const currentY = window.innerHeight / 2;
        const deltaX = targetX - currentX;
        const deltaY = targetY - currentY;

        const baseWidth = window.innerWidth < 768 ? 140 : 180;
        const scale = rect.width > 0 ? rect.width / baseWidth : 0.35;

        setTransformStyle({
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`,
        });
      }
    };

    calculateFlyTransform();
    window.addEventListener('resize', calculateFlyTransform);

    // Timeline Sequence (~2.7s):
    // 50ms: Pop-In logo centered
    const popinTimer = setTimeout(() => {
      setStage('popin');
    }, 50);

    // 600ms: Draw diagonal line
    const lineTimer = setTimeout(() => {
      setStage('linedraw');
    }, 600);

    // 1100ms: Split panels reveal site
    const splitTimer = setTimeout(() => {
      setStage('split');
    }, 1100);

    // 1750ms: Logo Fly-In to Navbar
    const flyinTimer = setTimeout(() => {
      calculateFlyTransform();
      setStage('flyin');
    }, 1750);

    // 2500ms: Handoff Done (Reveal Navbar items & logo)
    const doneTimer = setTimeout(() => {
      setStage('done');
      document.body.classList.add('preloader-finished', 'preloader-nav-ready');
      window.dispatchEvent(new Event('preloader-nav-ready'));
    }, 2500);

    // 2700ms: Remove preloader overlay & unlock scroll
    const hideTimer = setTimeout(() => {
      setStage('hidden');
      document.body.style.overflow = '';
      sessionStorage.setItem('hasSeenPreloader', 'true');
    }, 2700);

    return () => {
      clearTimeout(popinTimer);
      clearTimeout(lineTimer);
      clearTimeout(splitTimer);
      clearTimeout(flyinTimer);
      clearTimeout(doneTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('resize', calculateFlyTransform);
      document.body.style.overflow = '';
    };
  }, []);

  if (stage === 'hidden') return null;

  return (
    <div className={`flag-diag-overlay stage-${stage} ${stage === 'flyin' || stage === 'done' ? 'hand-off' : ''}`}>
      {/* 1. Diagonal Split Panels */}
      <div className="diag-panel diag-panel-tl" />
      <div className="diag-panel diag-panel-br" />

      {/* 2. Thin Accent Line */}
      <svg className="diag-line-svg" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="100" y1="0" x2="0" y2="100" className="diag-line-path" />
      </svg>

      {/* 3. Centered Logo Element */}
      <div
        ref={logoWrapperRef}
        className="diag-logo-wrapper"
        style={stage === 'flyin' || stage === 'done' ? transformStyle : undefined}
      >
        <Image
          src="/Images/flag-logo.png"
          alt="FLAG Church Official Logo"
          width={180}
          height={180}
          priority
          className="diag-logo-img"
        />
      </div>
    </div>
  );
}
