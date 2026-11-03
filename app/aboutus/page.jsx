"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";
import "./page.css";
import pastorsDetails from "../conf/pastors";
import ourChurchDetails, { churchHistoryItems } from "../conf/ourChurch";
import seniorPastorDetails from "../conf/seniorPastor";
import ElasticReel from "../components/ElasticReel";
import AlbumRail from "../components/AlbumRail";
import PillButton from "../components/PillButton";
import CardSwap from "../components/CardSwap";

const AboutUs = () => {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateTheme = () => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  const pastorsArray = useMemo(() => Object.values(pastorsDetails), []);
  const defaultCenterIdx = useMemo(() => {
    const dadIdx = pastorsArray.findIndex((p) => p.tag === "01");
    return dadIdx >= 0 ? dadIdx : 0;
  }, [pastorsArray]);

  const [activePastorIndex, setActivePastorIndex] = useState(defaultCenterIdx);
  const carouselRef = useRef(null);
  const mobileRailRef = useRef(null);

  // Autoplay Ping-Pong / Sweep:
  // Starts at Center (Pr. Johnson & Pr. Jemimah), moves Right to Sis. Machtalin,
  // then reverses Left to the beginning, and bounces back Right.
  const [direction, setDirection] = useState(1); // +1 = moving right, -1 = moving left
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const pauseTimerRef = useRef(null);

  const pauseAutoPlayTemporarily = useCallback(() => {
    setIsAutoPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsAutoPaused(false);
    }, 5000); // Resume auto-scrolling 5 seconds after user stops interacting
  }, []);

  const currentPastor = pastorsArray[activePastorIndex] || pastorsArray[0];

  const reelItems = useMemo(() => {
    return pastorsArray.map((pastor) => ({
      src: pastor.image,
      fullSrc: pastor.image,
      alt: pastor.name,
      title: pastor.name,
      subtitle: pastor.role,
      description: pastor.description,
      tag: pastor.tag,
      layerNum: pastor.layerNum,
      baseZIndex: 100 - pastor.layerNum,
    }));
  }, [pastorsArray]);

  const handlePrevPastor = () => {
    pauseAutoPlayTemporarily();
    setDirection(-1);
    const newIdx = (activePastorIndex - 1 + pastorsArray.length) % pastorsArray.length;
    setActivePastorIndex(newIdx);
    carouselRef.current?.open?.(newIdx);
    mobileRailRef.current?.open?.(newIdx);
  };

  const handleNextPastor = () => {
    pauseAutoPlayTemporarily();
    setDirection(1);
    const newIdx = (activePastorIndex + 1) % pastorsArray.length;
    setActivePastorIndex(newIdx);
    carouselRef.current?.open?.(newIdx);
    mobileRailRef.current?.open?.(newIdx);
  };

  // Automatic Ping-Pong / Sweep Scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (isAutoPaused) return;

    const timer = setInterval(() => {
      setActivePastorIndex((prevIdx) => {
        let currentDir = direction;
        let nextIdx = prevIdx + currentDir;

        // Reached the right-most end card (Sis. Machtalin) -> reverse left
        if (nextIdx >= pastorsArray.length - 1) {
          nextIdx = pastorsArray.length - 1;
          setDirection(-1);
        }
        // Reached the left-most end card (Pr. Johnson & Pr. Christina) -> reverse right
        else if (nextIdx <= 0) {
          nextIdx = 0;
          setDirection(1);
        }

        carouselRef.current?.open?.(nextIdx);
        mobileRailRef.current?.open?.(nextIdx);
        return nextIdx;
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [direction, isAutoPaused, pastorsArray.length]);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Scroll-Reveal Intersection Observer Engine
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Accessibility: Reduced Motion Preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal], [data-reveal-stagger]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const targets = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
      <div id="about-us" className="pt-24 md:pt-36 space-y-16 lg:space-y-24 overflow-hidden animate-page-entry">
        {/* Main Title Header */}
        <div data-reveal className="text-center mb-8 sm:mb-10 px-4 pt-4">
          <span className="font-sans-clean text-xs font-bold tracking-[0.25em] uppercase text-[#D9A31A] mb-2 block">
            WHO WE ARE
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-flag-navy dark:text-text-primary tracking-tight">
            ABOUT US
          </h1>
          <div className="w-16 h-0.5 bg-[#D9A31A]/70 mx-auto mt-3 rounded-full" />
        </div>

        {/* 1. SENIOR PASTOR SECTION */}
        <section data-reveal id="senior-pastor" className="relative py-8 sm:py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 mx-auto max-w-7xl">
          <div className="relative z-10 space-y-8 sm:space-y-10">
            {/* Header Block */}
            <div data-reveal className="border-b border-black/10 dark:border-white/10 pb-5 sm:pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-8 h-[2px] bg-[#D9A31A]" />
                <span className="font-sans-clean text-xs font-bold tracking-[0.25em] uppercase text-[#2C3A82] dark:text-blue-400">
                  SENIOR PASTOR & FOUNDER
                </span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold text-flag-navy dark:text-white leading-[1.1] tracking-tight">
                Rev. N. Johnson
              </h2>
            </div>

            {/* Main Composition */}
            <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Senior Pastor Cutout Portrait Photo (Left Column) */}
              <div className="lg:col-span-5 order-1 lg:order-1 flex flex-col items-center justify-center relative -mt-2 sm:-mt-3 lg:-mt-4 lg:sticky lg:top-28">
                <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[400px] flex flex-col items-center select-none group">
                  <Image
                    src={getMediaUrl("/images/Pr._Johnson_Magazine.png")}
                    alt="Rev. N. Johnson — Senior Pastor"
                    width={700}
                    height={1017}
                    priority
                    className="w-full h-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_6px_16px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <span className="font-editorial text-xs sm:text-sm text-text-secondary dark:text-gray-300 italic text-center mt-3 block tracking-wide">
                    Rev. N. Johnson — Senior Pastor, FLAG Church
                  </span>
                </div>
              </div>

              {/* Right Editorial Text Column (All story content consolidated beside the image) */}
              <div className="lg:col-span-7 order-2 lg:order-2 space-y-6">
                {/* Lead Featured Paragraph */}
                <div className="relative pl-5 border-l-2 border-[#D9A31A] dark:border-[#D9A31A]">
                  <p className="font-sans-clean text-base md:text-lg lg:text-xl text-flag-navy dark:text-gray-100 font-bold leading-[1.75] max-w-[680px]">
                    {seniorPastorDetails[0]}
                  </p>
                </div>

                {/* Continuation Paragraph 1 - Early Life */}
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px] pt-1">
                  {seniorPastorDetails[1]}
                </p>

                {/* Divine Encounter & Call to Ministry */}
                <div className="pt-2 space-y-4">
                  <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                    DIVINE ENCOUNTER &amp; CALL TO MINISTRY
                  </span>
                  <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px]">
                    {seniorPastorDetails[2]}
                  </p>
                  <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px]">
                    {seniorPastorDetails[3]}
                  </p>
                </div>

                {/* Family & Today's Impact */}
                <div className="pt-2 space-y-4">
                  <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                    FAMILY &amp; TODAY’S IMPACT
                  </span>
                  <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px]">
                    {seniorPastorDetails[4]}
                  </p>
                  {seniorPastorDetails[5] && (
                    <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px]">
                      {seniorPastorDetails[5]}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. HISTORY / OUR STORY SECTION */}
        <section data-reveal id="history" className="relative py-8 sm:py-10 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 mx-auto max-w-7xl">
          <div className="relative z-10 space-y-8 sm:space-y-10">
            {/* Header Block */}
            <div data-reveal className="border-b border-black/10 dark:border-white/10 pb-5 sm:pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-8 h-[2px] bg-[#D9A31A]" />
                <span className="font-sans-clean text-xs font-bold tracking-[0.25em] uppercase text-[#2C3A82] dark:text-blue-400">
                  OUR STORY
                </span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold text-flag-navy dark:text-white leading-[1.1] tracking-tight">
                Our Church History
              </h2>
            </div>

            {/* Main Composition: All text under one sub-topic alongside interactive CardSwap stack */}
            <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Featured Church History Interactive CardStack */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center lg:sticky lg:top-28">
                <div className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] lg:h-[640px] flex items-center justify-center select-none overflow-visible">
                  <CardSwap
                    items={churchHistoryItems}
                    width={540}
                    height={390}
                    delay={4000}
                    cardDistance={2}
                    verticalDistance={56}
                    depth={100}
                    skewAmount={0}
                    bounce={0.5}
                    parallax={0.4}
                    theme={theme}
                  />
                </div>
                <span className="font-editorial text-xs sm:text-sm text-text-secondary dark:text-gray-300 italic text-center mt-2 block tracking-wide">
                  Drag or click cards to explore our church journey
                </span>
              </div>

              {/* Text Column with ONE Sub-topic and all paragraphs flowing continuously */}
              <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
                {/* Single Sub Topic */}
                <h3 className="font-sans-clean text-xl sm:text-2xl md:text-3xl font-bold text-[#D9A31A] tracking-tight">
                  From Two People to thousands
                </h3>

                {/* Paragraphs in exact sequence without separation */}
                <div className="space-y-5 text-text-secondary dark:text-gray-300 font-sans-clean text-sm sm:text-base leading-[1.8]">
                  <p>
                    {ourChurchDetails[0]}
                  </p>
                  <p>
                    {ourChurchDetails[1]}
                  </p>
                  <p>
                    {ourChurchDetails[2]}
                  </p>
                  <p>
                    {ourChurchDetails[3]}
                  </p>
                  <p className="pt-1">
                    {ourChurchDetails[4]}
                  </p>
                  <p className="font-sans-clean text-xl sm:text-2xl md:text-3xl font-bold text-[#D9A31A] pt-1">
                    {ourChurchDetails[5]}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. PASTORAL TEAM SECTION ("THOSE WHO LEAD") - SINGLE FRAME VIEW */}
        <section 
          data-reveal 
          id="those-who-lead" 
          className="relative min-h-[92dvh] lg:min-h-[96dvh] max-h-[1020px] pt-16 pb-6 sm:pt-10 sm:pb-8 lg:py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl flex flex-col justify-between"
          onMouseEnter={() => setIsAutoPaused(true)}
          onMouseLeave={() => setIsAutoPaused(false)}
          onTouchStart={pauseAutoPlayTemporarily}
        >
          
          {/* Section Header: Title on Top-Left & Navigation on Right */}
          <div data-reveal className="flex items-center justify-between gap-2 sm:gap-4 border-b border-black/10 dark:border-white/10 pb-3 flex-shrink-0">
            <div className="space-y-0.5 sm:space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="w-5 sm:w-6 h-[2px] bg-[#D9A31A]" />
                <span className="font-sans-clean text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#2C3A82] dark:text-blue-400">
                  THOSE WHO LEAD
                </span>
              </div>
              <h2 className="font-editorial text-xl sm:text-3xl lg:text-4xl font-bold text-flag-navy dark:text-white leading-tight tracking-tight">
                Leadership With Purpose
              </h2>
              <p className="font-sans-clean text-xs sm:text-sm text-text-secondary line-clamp-1 max-w-lg hidden sm:block">
                A dedicated team of servants called to lead, guide and build God’s kingdom.
              </p>
            </div>

            {/* Prev & Next Navigator Controls on Top-Right with Pill Animation */}
            <div className="hidden md:flex items-center space-x-3 select-none flex-shrink-0">
              <PillButton
                onClick={handlePrevPastor}
                aria-label="Previous Pastor"
                variant="gold-dark"
                size="sm"
                className="!w-10 !h-10 !min-h-0 !p-0 !rounded-full"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </PillButton>

              <div className="font-editorial text-sm sm:text-base font-bold tracking-widest text-flag-navy dark:text-white">
                <span className="text-[#D9A31A]">{String(activePastorIndex + 1).padStart(2, "0")}</span>
                <span className="opacity-40 mx-1">/</span>
                <span className="opacity-60">{String(pastorsArray.length).padStart(2, "0")}</span>
              </div>

              <PillButton
                onClick={handleNextPastor}
                aria-label="Next Pastor"
                variant="gold-dark"
                size="sm"
                className="!w-10 !h-10 !min-h-0 !p-0 !rounded-full"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </PillButton>
            </div>
          </div>

          {/* Main Pastoral Team Showcase */}
          {/* Desktop & Tablet: Master Group Photo Lineup */}
          <div 
            data-reveal
            className="hidden md:flex relative w-full max-w-7xl mx-auto items-center justify-center select-none my-2 sm:my-4"
          >
            <ElasticReel
              ref={carouselRef}
              items={reelItems}
              selectedIndex={activePastorIndex}
              onChange={(index) => {
                setActivePastorIndex(index);
                mobileRailRef.current?.open?.(index);
                pauseAutoPlayTemporarily();
              }}
              onItemClick={(item, index) => {
                setActivePastorIndex(index);
                mobileRailRef.current?.open?.(index);
                pauseAutoPlayTemporarily();
              }}
            />
          </div>

          {/* Mobile Only: React Bits Pro Card Rail (Fan of Profile Cards) */}
          <div
            data-reveal
            className="block md:hidden relative w-full mx-auto select-none my-1"
          >
            <AlbumRail
              ref={mobileRailRef}
              items={reelItems}
              startIndex={activePastorIndex}
              coverHeight={210}
              aspectRatio={0.72}
              neighborSpacing={0.22}
              compactness={0.58}
              showRuler={true}
              onIndexChange={(index) => {
                setActivePastorIndex(index);
                carouselRef.current?.open?.(index);
                pauseAutoPlayTemporarily();
              }}
              onSelect={(item, index) => {
                setActivePastorIndex(index);
                carouselRef.current?.open?.(index);
                pauseAutoPlayTemporarily();
              }}
            />
          </div>

          {/* Selected Pastor Details: Fitted Directly Below the Center Card */}
          <div data-reveal className="max-w-2xl mx-auto text-center px-4 space-y-2 flex-shrink-0 pt-1 pb-2">
            <span key={`ref-role-${activePastorIndex}`} className="inline-block font-sans-clean text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] bg-[#D9A31A]/10 dark:bg-[#D9A31A]/20 px-3 py-1 rounded-full border border-[#D9A31A]/30 smooth-crossfade">
              {currentPastor.role}
            </span>

            <h3 key={`ref-name-${activePastorIndex}`} className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-flag-navy dark:text-white leading-tight tracking-wide smooth-crossfade">
              {currentPastor.name}
            </h3>

            <p key={`ref-desc-${activePastorIndex}`} className="font-sans-clean text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl mx-auto smooth-crossfade">
              {currentPastor.description}
            </p>
          </div>
        </section>
      </div>
  );
};

export default AboutUs;