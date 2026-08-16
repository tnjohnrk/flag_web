"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch during SSR
  if (!mounted) {
    return (
      <button
        className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-300 dark:bg-gray-800 cursor-not-allowed opacity-50"
        aria-label="Loading theme toggle"
        disabled
      >
        <span className="w-4 h-4 rounded-full bg-gray-400" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D9A31A] select-none cursor-pointer active:scale-95 ${
        isDark
          ? "bg-[#0B1120] border-2 border-[#D9A31A] shadow-[0_0_14px_rgba(217,163,26,0.35)] hover:shadow-[0_0_20px_rgba(217,163,26,0.6)]"
          : "bg-[#FFFFFF] border-2 border-[#D9A31A] shadow-[0_2px_10px_rgba(0,0,0,0.12)] hover:shadow-[0_0_18px_rgba(217,163,26,0.45)]"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Glow Aura Ring on Hover */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none ${
          isDark
            ? "bg-[#D9A31A]/10 opacity-0 group-hover:opacity-100"
            : "bg-[#D9A31A]/15 opacity-0 group-hover:opacity-100"
        }`}
      />

      {/* Dark Mode Icon: Stick-man Carrying the Cross */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)] ${
          isDark
            ? "opacity-100 scale-100 rotate-0 text-[#EAD068]"
            : "opacity-0 scale-50 -rotate-45 text-[#10194F] pointer-events-none"
        }`}
      >
        {/* Diagonal Cross (Single Cross) */}
        <g transform="rotate(-35 12 12)">
          <rect x="11.1" y="2.5" width="2.2" height="19" rx="0.5" fill="currentColor" />
          <rect x="5.5" y="7.5" width="13" height="2.2" rx="0.5" fill="currentColor" />
        </g>

        {/* Stick Figure Leaning Forward Carrying Cross */}
        <circle cx="14.5" cy="8.2" r="1.7" fill="currentColor" />
        <path d="M 13.8 9.6 L 9.8 14.5 L 6 17 L 9 14.2 Z" fill="currentColor" />
        <path d="M 9.8 14.5 L 12.2 18 L 14 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 9.8 14.5 L 6.8 17.5 L 4.8 19.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
        <path d="M 13.5 10.5 L 15.2 9.5 L 16 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {/* Light Mode Icon: Stick-man Kneeling at Upright Cross */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.34,1.25,0.64,1)] ${
          isDark
            ? "opacity-0 scale-50 rotate-45 text-[#EAD068] pointer-events-none"
            : "opacity-100 scale-100 rotate-0 text-[#10194F]"
        }`}
      >
        {/* Single Upright Cross on Right Side */}
        <rect x="16.2" y="4" width="2.2" height="16.5" rx="0.5" fill="currentColor" />
        <rect x="11.8" y="8" width="11" height="2.2" rx="0.5" fill="currentColor" />

        {/* Kneeling Figure on Left Side */}
        <circle cx="7.8" cy="9.2" r="1.7" fill="currentColor" />
        <path d="M 7.6 10.8 C 8 13 7.8 14.8 6.6 17" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        <path d="M 8 12.4 L 10 11.8 L 10.8 13.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 6.6 17 L 4.3 18.7 L 4.6 20.3 L 10.8 20.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </button>
  );
}


