'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], style: 'italic' });

const bibleVerses = [
  {
    verse: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.",
    reference: "Numbers 6:24–25",
  },
  {
    verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
  },
  {
    verse: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures.",
    reference: "Psalm 23:1–2",
  },
  {
    verse: "For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
  },
  {
    verse: "Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid.",
    reference: "John 14:27",
  },
  {
    verse: "Those who hope in the Lord will renew their strength. They will soar on wings like eagles.",
    reference: "Isaiah 40:31",
  },
  {
    verse: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:7",
  },
];

export default function Home() {
  const containerRef = useRef(null);
  const [verseIndex, setVerseIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  // GSAP animation for main Hero heading (Upright text reveal, no rotation)
  useEffect(() => {
    const animateText = () => {
      const words = containerRef.current?.querySelectorAll('.word');
      if (!words || words.length === 0) return;
      gsap.fromTo(
        words,
        { y: '120%', opacity: 0 },
        { 
          y: '0%', 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.08, 
          ease: 'power4.out',
          delay: 0.2
        }
      );
    };

    if (document.body.classList.contains('preloader-finished')) {
      animateText();
    } else {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class' && document.body.classList.contains('preloader-finished')) {
            animateText();
            observer.disconnect();
          }
        });
      });
      observer.observe(document.body, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);

  // Automatic Bible Verse Rotation (Every 6 Seconds with Smooth Fade Transition)
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setVerseIndex((prev) => (prev + 1) % bibleVerses.length);
        setFadeState(true);
      }, 450);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentVerse = bibleVerses[verseIndex];

  const text1 = "Welcome to".split(' ');
  const text2 = "Full Life Centre".split(' ');
  const text3 = "Assembly of God Church".split(' ');

  const renderWords = (words, extraClass = '') => {
    return words.map((word, i) => (
      <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-2 -mb-2 align-bottom">
        <span className={`word inline-block origin-bottom-left opacity-0 ${extraClass}`}>{word}</span>
      </span>
    ));
  };

  return (
    <div className="absolute left-5 sm:left-8 md:left-16 lg:left-20 bottom-20 sm:bottom-16 md:bottom-12 lg:bottom-14 max-w-2xl lg:max-w-3xl z-10 p-2 sm:p-4 pointer-events-none">
      {/* Main Hero Heading (Increased font size and lifted higher on mobile) */}
      <h1 ref={containerRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-white font-bold leading-[1.12] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
        <div className="mb-1 sm:mb-1.5">{renderWords(text1)}</div>
        <div className={`${playfair.className} font-normal text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-1 sm:mb-1.5 pr-2 sm:pr-4`}>
          {renderWords(text2)}
        </div>
        <div>{renderWords(text3)}</div>
      </h1>

      {/* Dynamic Bible Blessing Verse Section (Increased mobile size & high clarity) */}
      <div className="mt-4 sm:mt-5 md:mt-5 max-w-lg pointer-events-auto">
        <div
          className={`transition-all duration-500 ease-out transform ${
            fadeState ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <p className={`${playfair.className} text-sm sm:text-base md:text-base lg:text-lg text-white/95 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-normal italic`}>
            “{currentVerse.verse}”
          </p>
          <p className="mt-1.5 text-xs sm:text-xs md:text-sm font-sans-clean font-bold tracking-widest text-[#D9A31A] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            — {currentVerse.reference}
          </p>
        </div>
      </div>
    </div>
  );
}

