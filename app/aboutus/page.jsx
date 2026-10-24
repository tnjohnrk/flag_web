"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import "./page.css";
import PastorsModal from "../components/PastorsModal";
import pastorsDetails from "../conf/pastors";
import ourChurchDetails from "../conf/ourChurch";
import seniorPastorDetails from "../conf/seniorPastor";
import dynamic from "next/dynamic";

const ElasticReel = dynamic(() => import("../components/ElasticReel"), {
  ssr: false,
});

import familyPic from "../assets/Images/familyPic.avif";

const AboutUs = () => {
  const [activePastorIndex, setActivePastorIndex] = useState(0);
  const carouselRef = useRef(null);

  const pastorsArray = Object.values(pastorsDetails);
  const currentPastor = pastorsArray[activePastorIndex] || pastorsArray[0];

  const reelItems = useMemo(() => {
    return pastorsArray.map((pastor, idx) => ({
      src: `/images/pastor-cutout-${idx + 1}.webp`,
      fullSrc: `/images/pastor-${idx + 1}.avif`,
      alt: pastor.name,
      title: pastor.name,
      subtitle: pastor.role,
      description: pastor.description,
    }));
  }, [pastorsArray]);

  const handlePrevPastor = () => {
    setActivePastorIndex((prev) => {
      const newIdx = (prev - 1 + pastorsArray.length) % pastorsArray.length;
      carouselRef.current?.open?.(newIdx);
      return newIdx;
    });
  };

  const handleNextPastor = () => {
    setActivePastorIndex((prev) => {
      const newIdx = (prev + 1) % pastorsArray.length;
      carouselRef.current?.open?.(newIdx);
      return newIdx;
    });
  };

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
              
              {/* Senior Pastor Cutout Portrait Photo */}
              <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center justify-center relative">
                {/* Subtle Ambient Halo Glow behind Senior Pastor */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#D9A31A]/20 via-[#2C3A82]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

                <div className="relative w-full max-w-[360px] sm:max-w-[400px] flex flex-col items-center select-none group">
                  <Image
                    src="/images/Pr._Johnson_Magazine.png"
                    alt="Rev. N. Johnson — Senior Pastor"
                    width={700}
                    height={1017}
                    priority
                    className="w-full h-auto object-contain filter drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="font-editorial text-xs sm:text-sm text-text-secondary dark:text-gray-300 italic text-center mt-3 block tracking-wide">
                    Rev. N. Johnson — Senior Pastor, FLAG Church
                  </span>
                </div>
              </div>

              {/* Left Editorial Text Column (Strict Paragraph Width & Line-Height) */}
              <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
                {/* Lead Featured Paragraph */}
                <div className="relative pl-5 border-l-2 border-[#D9A31A] dark:border-[#D9A31A]">
                  <p className="font-sans-clean text-base md:text-lg lg:text-xl text-flag-navy dark:text-gray-100 font-bold leading-[1.75] max-w-[680px]">
                    {seniorPastorDetails[0]}
                  </p>
                </div>

                {/* Continuation Paragraph 1 */}
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px] pt-1">
                  {seniorPastorDetails[1]}
                </p>

                {/* Divine Encounter & Call to Ministry (Moved up to fill empty space) */}
                <div className="pt-4 space-y-4">
                  <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                    DIVINE ENCOUNTER & CALL TO MINISTRY
                  </span>
                  <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px]">
                    {seniorPastorDetails[2]}
                  </p>
                  <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[680px]">
                    {seniorPastorDetails[3]}
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Continuation Story Paragraphs */}
            <div data-reveal-stagger className="pt-8 border-t border-black/10 dark:border-white/10">
              <div className="space-y-4 max-w-4xl">
                <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                  FAMILY & TODAY’S IMPACT
                </span>
                <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75]">
                  {seniorPastorDetails[4]}
                </p>
                {seniorPastorDetails[5] && (
                  <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] mt-3">
                    {seniorPastorDetails[5]}
                  </p>
                )}
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
              <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-flag-navy dark:text-white leading-[1.1] tracking-tight mb-2">
                Our Church History
              </h2>
              <p className="font-sans-clean text-sm sm:text-base text-text-secondary italic">
                From Two People to a Growing Family
              </p>
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
                  <p className="font-sans-clean text-base md:text-lg lg:text-xl text-flag-navy dark:text-gray-100 font-bold leading-[1.75] max-w-[680px]">
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
                {ourChurchDetails[4] && (
                  <p className="font-sans-clean text-sm md:text-base text-text-secondary leading-[1.75] max-w-[640px] mt-2 font-semibold text-[#D9A31A]">
                    {ourChurchDetails[4]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. PASTORAL TEAM SECTION ("THOSE WHO LEAD") - SINGLE FRAME VIEW */}
        <section 
          data-reveal 
          id="those-who-lead" 
          className="relative min-h-[92dvh] lg:min-h-[96dvh] max-h-[960px] pt-16 pb-6 sm:pt-10 sm:pb-8 lg:py-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl flex flex-col justify-between"
        >
          
          {/* Section Header: Title on Top-Left & Navigation on Right */}
          <div data-reveal className="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-3 flex-shrink-0">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-[2px] bg-[#D9A31A]" />
                <span className="font-sans-clean text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#2C3A82] dark:text-blue-400">
                  THOSE WHO LEAD
                </span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-flag-navy dark:text-white leading-tight tracking-tight">
                Leadership With Purpose
              </h2>
              <p className="font-sans-clean text-xs sm:text-sm text-text-secondary line-clamp-1 max-w-lg hidden sm:block">
                A dedicated team of servants called to lead, guide and build God’s kingdom.
              </p>
            </div>

            {/* Prev & Next Navigator Controls on Top-Right */}
            <div className="flex items-center space-x-3 select-none flex-shrink-0">
              <button
                onClick={handlePrevPastor}
                aria-label="Previous Pastor"
                className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D9A31A]/40 bg-black/10 dark:bg-white/10 text-flag-navy dark:text-white opacity-70 hover:opacity-100 hover:bg-[#D9A31A] hover:text-white hover:border-[#D9A31A] dark:hover:bg-[#D9A31A] dark:hover:border-[#D9A31A] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="font-editorial text-sm sm:text-base font-bold tracking-widest text-flag-navy dark:text-white">
                <span className="text-[#D9A31A]">{String(activePastorIndex + 1).padStart(2, "0")}</span>
                <span className="opacity-40 mx-1">/</span>
                <span className="opacity-60">{String(pastorsArray.length).padStart(2, "0")}</span>
              </div>

              <button
                onClick={handleNextPastor}
                aria-label="Next Pastor"
                className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D9A31A]/40 bg-black/10 dark:bg-white/10 text-flag-navy dark:text-white opacity-70 hover:opacity-100 hover:bg-[#D9A31A] hover:text-white hover:border-[#D9A31A] dark:hover:bg-[#D9A31A] dark:hover:border-[#D9A31A] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Elastic Reel Dock: A dock of photo slices that swell open into full images */}
          <div 
            data-reveal
            className="relative w-full max-w-6xl mx-auto flex items-center justify-center select-none my-2 sm:my-4"
          >
            <ElasticReel
              ref={carouselRef}
              items={reelItems}
              autoplay="sweep"
              speed={1.2}
              pauseOnHover={true}
              captions={true}
              labels={true}
              onChange={(index) => {
                setActivePastorIndex(index);
              }}
              onItemClick={(item, index) => {
                setActivePastorIndex(index);
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

            <p key={`ref-desc-${activePastorIndex}`} className="font-sans-clean text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-2 max-w-xl mx-auto smooth-crossfade">
              {currentPastor.description}
            </p>

            <div>
              <button
                onClick={() => {
                  const modalBtn = document.getElementById(`open-pastor-modal-${activePastorIndex}`);
                  if (modalBtn) modalBtn.click();
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-sans-clean font-semibold tracking-wider uppercase text-flag-navy dark:text-white hover:text-[#D9A31A] dark:hover:text-[#D9A31A] transition-colors group cursor-pointer"
              >
                <span>Read Full Bio</span>
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
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