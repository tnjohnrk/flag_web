"use client";

import { useTheme } from "./ThemeProvider";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch during SSR
  if (!mounted) {
    return (
      <div className="switch opacity-60 pointer-events-none scale-90 sm:scale-100 origin-center" aria-hidden="true">
        <span className="slider" />
      </div>
    );
  }

  const isDark = theme === "dark";

  const handleToggle = (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    toggleTheme(e);
  };

  return (
    <label
      className="switch scale-90 sm:scale-100 origin-center cursor-pointer"
      role="switch"
      aria-checked={isDark}
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle(e);
        }
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <input
        type="checkbox"
        className="input"
        checked={isDark}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
      />
      <span className="slider">
        <div className="sun">
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" fill="#FFD43B" />
            <line x1="12" y1="1.5" x2="12" y2="4" stroke="#FFD43B" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="12" y1="20" x2="12" y2="22.5" stroke="#FFD43B" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="1.5" y1="12" x2="4" y2="12" stroke="#FFD43B" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="20" y1="12" x2="22.5" y2="12" stroke="#FFD43B" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="4.6" y1="4.6" x2="6.4" y2="6.4" stroke="#FFD43B" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="17.6" y1="17.6" x2="19.4" y2="19.4" stroke="#FFD43B" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="4.6" y1="19.4" x2="6.4" y2="17.6" stroke="#FFD43B" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="17.6" y1="6.4" x2="19.4" y2="4.6" stroke="#FFD43B" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="moon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#73C0FC" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="#73C0FC"
            />
          </svg>
        </div>
      </span>
    </label>
  );
}
