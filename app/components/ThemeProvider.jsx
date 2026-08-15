"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, read from local storage or system preference
    const storedTheme = localStorage.getItem("flag-theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = (e) => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // View Transitions API
    if (!prefersReducedMotion && document.startViewTransition) {
      // Calculate origin from the click event if available
      const x = e?.clientX ?? window.innerWidth / 2;
      const y = e?.clientY ?? 20; // fallback near top

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        applyTheme(newTheme);
      });

      transition.ready.then(() => {
        const isDark = newTheme === "dark";
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: isDark
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
          }
        );
      });
    } else {
      // Fallback
      applyTheme(newTheme);
    }
  };

  const applyTheme = (newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("flag-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
