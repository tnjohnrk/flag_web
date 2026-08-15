"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return (
      <button
        className="relative flex items-center justify-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50"
        aria-label="Loading theme toggle"
        disabled
      >
        <span className="w-4 h-4 rounded-full bg-white" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center w-12 h-6 p-1 rounded-full transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-flag-yellow ${
        isDark ? "bg-gray-700" : "bg-gray-300"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun Icon */}
      <span
        className={`absolute left-1 flex items-center justify-center w-4 h-4 transition-all duration-500 ${
          isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-full h-full text-flag-orange"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 21v-2.25m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          />
        </svg>
      </span>

      {/* Moon Icon */}
      <span
        className={`absolute right-1 flex items-center justify-center w-4 h-4 transition-all duration-500 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-full h-full text-flag-yellow"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </span>

      {/* Thumb Indicator */}
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-500 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
