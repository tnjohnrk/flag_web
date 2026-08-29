"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./page.css";
import PastorsModal from "../components/PastorsModal";
import pastorsDetails from "../conf/pastors";
import ourChurchDetails from "../conf/ourChurch";
import seniorPastorDetails from "../conf/seniorPastor";

import familyPic from "../assets/Images/familyPic.avif";

const AboutUs = () => {
  const [activePastorIndex, setActivePastorIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pastorsArray = Object.values(pastorsDetails);
  const currentPastor = pastorsArray[activePastorIndex] || pastorsArray[0];

  const handlePrevPastor = () => {
    setActivePastorIndex((prev) => (prev - 1 + pastorsArray.length) % pastorsArray.length);
  };

  const handleNextPastor = () => {
    setActivePastorIndex((prev) => (prev + 1) % pastorsArray.length);
  };

  // Automatic card rotation every 3 seconds for Those Who Lead (pauses when hovered or clicked)
  useEffect(() => {
    if (!pastorsArray || pastorsArray.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      setActivePastorIndex((prev) => (prev + 1) % pastorsArray.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [pastorsArray.length, isPaused]);

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
        <div data-reveal className="text-center mb-10 px-4 pt-4">
          <span className="font-sans-clean text-xs font-bold tracking-[0.25em] uppercase text-[#D9A31A] mb-2 block">
            WHO WE ARE
          </span>
          <h1 className="font-editorial text-5xl md:text-6xl font-bold text-flag-navy dark:text-text-primary tracking-tight">
            ABOUT US
          </h1>
          <div className="w-16 h-0.5 bg-[#D9A31A]/70 mx-auto mt-3 rounded-full" />
        </div>

        {/* 1. SENIOR PASTOR SECTION */}
        <section data-reveal id="senior-pastor" className="relative py-10 md:py-16 px-6 md:px-12 lg:px-16 mx-auto max-w-7xl">
          <div className="relative z-10 space-y-10">
            {/* Header Block */}
            <div data-reveal className="border-b border-black/10 dark:border-white/10 pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-8 h-[2px] bg-[#D9A31A]" />
                <span className="font-sans-clean text-xs font-bold tracking-[0.25em] uppercase text-[#2C3A82] dark:text-blue-400">
                  SENIOR PASTOR & FOUNDER
                </span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-flag-navy dark:text-white leading-[1.1] tracking-tight">
                Rev. N. Johnson
              </h2>
            </div>

            {/* Main Composition */}
            <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Senior Pastor Portrait Photo */}
              <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] max-w-[420px] overflow-hidden rounded-[28px] border border-white/20 dark:border-white/10 shadow-2xl group select-none">
                  <Image
                    src="/images/pastor-1.avif"
                    alt="Rev. N. Johnson — Senior Pastor"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority
                    className="object-cover object-top w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="font-editorial text-xs sm:text-sm text-white/90 italic drop-shadow-md block">
                      Rev. N. Johnson — Senior Pastor, FLAG Church
                    </span>
                  </div>
                </div>
              </div>

              {/* Left Editorial Text Column (Strict Paragraph Width & Line-Height) */}
              <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
                {/* Lead Featured Paragraph */}
                <div className="relative pl-5 border-l-2 border-[#D9A31A] dark:border-[#D9A31A]">
                  <p className="font-sans-clean text-base md:text-lg lg:text-xl text-flag-navy dark:text-gray-100 font-medium leading-[1.75] max-w-[680px]">
                    {seniorPastorDetails[0]}
                  </p>
                </div>

                {/* Continuation Paragraph 1 */}
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px] pt-1">
                  {seniorPastorDetails[1]}
                </p>
              </div>

            </div>

            {/* Bottom Continuation Story Paragraphs */}
            <div data-reveal-stagger className="pt-8 border-t border-black/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                  DIVINE ENCOUNTER & CALL TO MINISTRY
                </span>
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[640px]">
                  {seniorPastorDetails[2]}
                </p>
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[640px]">
                  {seniorPastorDetails[3]}
                </p>
              </div>

              <div className="space-y-4">
                <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                  FAMILY & TODAY’S IMPACT
                </span>
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[640px]">
                  {seniorPastorDetails[4]}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. HISTORY / OUR STORY SECTION */}
        <section data-reveal id="history" className="relative py-10 md:py-16 px-6 md:px-12 lg:px-16 mx-auto max-w-7xl">
          <div className="relative z-10 space-y-10">
            {/* Header Block */}
            <div data-reveal className="border-b border-black/10 dark:border-white/10 pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-8 h-[2px] bg-[#D9A31A]" />
                <span className="font-sans-clean text-xs font-bold tracking-[0.25em] uppercase text-[#2C3A82] dark:text-blue-400">
                  OUR STORY
                </span>
              </div>
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-flag-navy dark:text-white leading-[1.1] tracking-tight">
                History
              </h2>
            </div>

            {/* Main Composition */}
            <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Featured Family Image */}
              <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden rounded-[28px] border border-white/20 dark:border-white/10 shadow-2xl group select-none">
                  <Image
                    src={familyPic}
                    alt="Rev. N. Johnson & Family"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority
                    className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="font-editorial text-xs sm:text-sm text-white/90 italic drop-shadow-md block">
                      Rev. N. Johnson & Family — Pioneering FLAG Ministry
                    </span>
                  </div>
                </div>
              </div>

              {/* Left Editorial Text Column (Strict Paragraph Width & Line-Height) */}
              <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
                {/* Lead Featured Paragraph */}
                <div className="relative pl-5 border-l-2 border-[#D9A31A] dark:border-[#D9A31A]">
                  <p className="font-sans-clean text-base md:text-lg lg:text-xl text-flag-navy dark:text-gray-100 font-medium leading-[1.75] max-w-[680px]">
                    {ourChurchDetails[0]}
                  </p>
                </div>

                {/* Continuation Paragraph 1 */}
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px] pt-1">
                  {ourChurchDetails[1]}
                </p>
              </div>

            </div>

            {/* Bottom Story Continuation Paragraphs */}
            <div data-reveal-stagger className="pt-8 border-t border-black/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-3">
                <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                  FAITHFULNESS IN TRIALS
                </span>
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[640px]">
                  {ourChurchDetails[2]}
                </p>
              </div>

              <div className="space-y-3">
                <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                  GOD’S CONTINUED PROVISION
                </span>
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[640px]">
                  {ourChurchDetails[3]}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PASTORAL TEAM SECTION ("THOSE WHO LEAD") */}
        <section data-reveal id="those-who-lead" className="relative py-8 md:py-12 px-4 md:px-10 lg:px-14 mx-auto max-w-7xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[620px]">
            
            {/* Left Column: Title Area */}
            <div data-reveal className="lg:col-span-4 space-y-3 z-50 mb-8 lg:mb-0 pl-2 lg:pl-0 pt-4">
              <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#2C3A82] dark:text-blue-400 block">
                THOSE WHO LEAD
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-flag-navy dark:text-white leading-[1.1] tracking-tight">
                Leadership <br className="hidden lg:inline" /> With Purpose
              </h2>
              <div className="w-12 h-0.5 bg-[#D9A31A]/80 my-3" />
              <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-xs">
                A dedicated team of servants called to lead, guide and build God’s kingdom.
              </p>

              {/* Prev & Next Navigator Controls */}
              <div 
                className="flex items-center space-x-4 pt-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <button
                  onClick={handlePrevPastor}
                  aria-label="Previous Pastor"
                  className="group flex items-center justify-center w-11 h-11 rounded-full border border-[#D9A31A]/40 bg-black/10 dark:bg-white/10 text-flag-navy dark:text-white opacity-40 hover:opacity-100 hover:bg-[#D9A31A] hover:text-white hover:border-[#D9A31A] dark:hover:bg-[#D9A31A] dark:hover:border-[#D9A31A] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer select-none"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="font-editorial text-sm font-bold tracking-widest text-flag-navy dark:text-white select-none">
                  <span className="text-[#D9A31A]">{String(activePastorIndex + 1).padStart(2, "0")}</span>
                  <span className="opacity-40 mx-1">/</span>
                  <span className="opacity-60">{String(pastorsArray.length).padStart(2, "0")}</span>
                </div>

                <button
                  onClick={handleNextPastor}
                  aria-label="Next Pastor"
                  className="group flex items-center justify-center w-11 h-11 rounded-full border border-[#D9A31A]/40 bg-black/10 dark:bg-white/10 text-flag-navy dark:text-white opacity-40 hover:opacity-100 hover:bg-[#D9A31A] hover:text-white hover:border-[#D9A31A] dark:hover:bg-[#D9A31A] dark:hover:border-[#D9A31A] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer select-none"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Center Column: 3D Overlapping Card Gallery with Overlay Arrow Buttons */}
            <div 
              data-reveal
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="lg:col-span-5 relative w-full h-[450px] sm:h-[560px] lg:h-[610px] flex items-center justify-end perspective-[1200px] lg:pr-4"
            >
              {pastorsArray.map((pastor, idx) => {
                let offset = idx - activePastorIndex;
                if (offset < 0) offset += pastorsArray.length;
                
                const isActive = offset === 0;
                const isVisible = offset < 5;

                if (!isVisible) return null;

                const translateX = isActive ? 0 : -(offset * 32);
                const translateY = isActive ? 0 : (offset * 10);
                const scale = isActive ? 1 : Math.max(1 - (offset * 0.05), 0.75);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isActive) setActivePastorIndex(idx);
                      else {
                        const modalBtn = document.getElementById(`open-pastor-modal-${idx}`);
                        if (modalBtn) modalBtn.click();
                      }
                    }}
                    className={`absolute right-0 w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[370px] h-[440px] sm:h-[540px] lg:h-[590px] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-[24px] lg:rounded-[36px] select-none ${
                      isActive
                        ? "border-[2px] lg:border-[2.5px] border-[#D9A31A]/90 shadow-[0_20px_45px_rgba(16,25,79,0.22)] dark:border-[#E6C687] dark:shadow-[0_0_35px_rgba(230,198,135,0.25)] z-50"
                        : "border border-[#10194F]/10 dark:border-white/10 shadow-lg dark:shadow-xl opacity-95"
                    }`}
                    style={{
                      zIndex: 50 - offset,
                      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                      opacity: 1,
                      transformOrigin: 'center right',
                    }}
                  >
                    <Image
                      src={`/images/pastor-${idx + 1}.avif`}
                      alt={pastor.name}
                      fill
                      sizes="(max-width: 768px) 80vw, 370px"
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      className="object-cover object-top w-full h-full transition-transform duration-700"
                    />
                    
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none transition-opacity duration-500" />
                    )}

                    <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/80 via-black/35 to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />

                    <div className="absolute bottom-6 left-6 z-20">
                      <span className={`font-editorial transition-all duration-300 ${
                        isActive 
                          ? "text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D9A31A] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
                          : "text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                      }`}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Floating Prev / Next Arrow Overlay for Card Stack (10% Default Opacity) */}
              <div className="absolute left-2 z-50 flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPastor();
                  }}
                  aria-label="Previous image"
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center opacity-10 hover:opacity-100 hover:bg-[#D9A31A] hover:border-[#D9A31A] transition-all duration-300 active:scale-95 shadow-lg cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <div className="absolute right-2 z-50 flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPastor();
                  }}
                  aria-label="Next image"
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center opacity-10 hover:opacity-100 hover:bg-[#D9A31A] hover:border-[#D9A31A] transition-all duration-300 active:scale-95 shadow-lg cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column: Active Pastor Bio */}
            <div data-reveal className="lg:col-span-3 flex flex-col justify-center space-y-5 order-3 pt-2">
              <div className="space-y-2">
                <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#2C3A82] dark:text-blue-400 block">
                  {currentPastor.role}
                </span>
                <h3 key={`ref-name-${activePastorIndex}`} className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-flag-navy dark:text-white leading-[1.15] tracking-wide smooth-crossfade">
                  {currentPastor.name}
                </h3>
                <div className="w-12 h-0.5 bg-[#D9A31A]/80 my-2" />
              </div>

              <p key={`ref-desc-${activePastorIndex}`} className="font-sans-clean text-sm text-text-secondary leading-[1.75] line-clamp-6 smooth-crossfade">
                {currentPastor.description}
              </p>
            </div>

          </div>

          {/* Hidden PastorsModal triggers */}
          <div className="hidden">
            {pastorsArray.map((pastor, idx) => (
              <div key={`modal-wrap-${idx}`} id={`open-pastor-modal-${idx}`}>
                <PastorsModal 
                  name={pastor.name} 
                  role={pastor.role} 
                  description={pastor.description} 
                  imageIndex={idx + 1} 
                />
              </div>
            ))}
          </div>
        </section>
      </div>
  );
};

export default AboutUs;