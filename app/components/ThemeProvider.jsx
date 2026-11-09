"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";

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

    // Extract click origin coordinates synchronously before any async gap
    let x = typeof window !== "undefined" ? window.innerWidth - 44 : 100;
    let y = 30;

    if (e?.clientX !== undefined && e?.clientY !== undefined && (e.clientX !== 0 || e.clientY !== 0)) {
      x = Math.round(e.clientX);
      y = Math.round(e.clientY);
    } else if (e?.currentTarget?.getBoundingClientRect) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = Math.round(rect.left + rect.width / 2);
      y = Math.round(rect.top + rect.height / 2);
    }

    // Radius to cover the furthest viewport corner from (x, y)
    const endRadius = typeof window !== "undefined"
      ? Math.ceil(
          Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
          )
        )
      : 1500;

    // Set CSS custom properties on documentElement for the wave origin and radius
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--theme-x", `${x}px`);
      document.documentElement.style.setProperty("--theme-y", `${y}px`);
      document.documentElement.style.setProperty("--theme-radius", `${endRadius}px`);
    }

    // Check for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // View Transitions API
    if (!prefersReducedMotion && typeof document !== "undefined" && document.startViewTransition) {
      isTransitioningRef.current = true;
      document.documentElement.classList.add("theme-transitioning");

      try {
        const transition = document.startViewTransition(() => {
          flushSync(() => {
            applyTheme(newTheme);
          });
        });

        await transition.ready;

        // Also run Web Animations API as enhancement for browsers supporting pseudoElement in animate()
        try {
          const anim = document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 850,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          );
          await anim.finished;
        } catch (_) {
          // If WAAPI pseudoElement is unsupported, CSS keyframes theme-circular-wave handles it seamlessly
        }

        await transition.finished;
      } catch (err) {
        applyTheme(newTheme);
      } finally {
        requestAnimationFrame(() => {
          document.documentElement.classList.remove("theme-transitioning");
          isTransitioningRef.current = false;
        });
      }
    } else if (!prefersReducedMotion && typeof document !== "undefined") {
      // Fallback for browsers without View Transitions API:
      // In-to-out circular wave overlay that smoothly reveals the target theme
      isTransitioningRef.current = true;
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 999999;
        pointer-events: none;
        background-color: ${isDark ? "#090B14" : "#F2F0EB"};
        clip-path: circle(0px at ${x}px ${y}px);
      `;
      document.body.appendChild(overlay);

      const anim = overlay.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        ],
        {
          duration: 820,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );

      anim.onfinish = () => {
        applyTheme(newTheme);
        overlay.remove();
        isTransitioningRef.current = false;
      };
    } else {
      // Direct update for reduced motion
      applyTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
