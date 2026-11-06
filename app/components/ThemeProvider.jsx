"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const isTransitioningRef = useRef(false);

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

  const applyTheme = (newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("flag-theme", newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = async (e) => {
    if (isTransitioningRef.current) return;
    const newTheme = theme === "light" ? "dark" : "light";
    const isDark = newTheme === "dark";
    
    // Check for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // View Transitions API
    if (!prefersReducedMotion && typeof document !== "undefined" && document.startViewTransition) {
      isTransitioningRef.current = true;

      // Calculate origin from the click event or button center
      let x = window.innerWidth / 2;
      let y = 20;

      if (e?.clientX !== undefined && e?.clientY !== undefined && (e.clientX !== 0 || e.clientY !== 0)) {
        x = e.clientX;
        y = e.clientY;
      } else if (e?.currentTarget?.getBoundingClientRect) {
        const rect = e.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }

      // Radius to cover the furthest corner of the viewport
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transitionClass = isDark
        ? "theme-transition-to-dark"
        : "theme-transition-to-light";

      // Suppress all child CSS transitions so snapshot captures instant 100% final colors
      document.documentElement.classList.add("theme-transitioning", transitionClass);

      try {
        const transition = document.startViewTransition(() => {
          applyTheme(newTheme);
        });

        await transition.ready;

        const duration = 480;
        const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

        let anim;
        if (isDark) {
          // Light -> Dark: Smooth in-to-out circular expansion from toggle button
          anim = document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration,
              easing,
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        } else {
          // Dark -> Light: Smooth out-to-in circular contraction into toggle button
          anim = document.documentElement.animate(
            {
              clipPath: [
                `circle(${endRadius}px at ${x}px ${y}px)`,
                `circle(0px at ${x}px ${y}px)`,
              ],
            },
            {
              duration,
              easing,
              fill: "forwards",
              pseudoElement: "::view-transition-old(root)",
            }
          );
        }

        if (anim) {
          await anim.finished;
        }
        await transition.finished;
      } catch (err) {
        applyTheme(newTheme);
      } finally {
        // Wait for next animation frame so DOM is completely settled before restoring regular transitions
        requestAnimationFrame(() => {
          document.documentElement.classList.remove("theme-transitioning", transitionClass);
          isTransitioningRef.current = false;
        });
      }
    } else {
      // Fallback
      applyTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
