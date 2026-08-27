"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch during SSR
  if (!mounted) {
    return (
      <button
        className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 dark:bg-gray-800 cursor-not-allowed opacity-50"
        aria-label="Loading theme toggle"
        disabled
      >
        <span className="w-3 h-3 rounded-full bg-gray-400" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`relative group flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none select-none cursor-pointer active:scale-90 ${
        isDark
          ? "bg-[#0B1120]/80 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:bg-[#0B1120] hover:border-white/20"
          : "bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-white hover:border-gray-300"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Moon Icon (Visible in Dark Mode) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? "opacity-100 scale-100 rotate-0 text-[#F5D061]"
            : "opacity-0 scale-50 -rotate-90 text-amber-500 pointer-events-none"
        }`}
      >
        <Moon className="w-4 h-4 fill-[#F5D061]/20 stroke-[2]" />
      </div>

      {/* Sun Icon (Visible in Light Mode) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? "opacity-0 scale-50 rotate-90 text-amber-400 pointer-events-none"
            : "opacity-100 scale-100 rotate-0 text-amber-500"
        }`}
      >
        <Sun className="w-4 h-4 fill-amber-500/20 stroke-[2]" />
      </div>
    </button>
  );
}




