"use client";

import Link from "next/link";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";
import "./Navbar.css";
import { useState, useEffect, useRef, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import PillNav from "./PillNav";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const [activeSection, setActiveSection] = useState(() => {
    const cleanPath = pathname?.replace(/\/$/, "") || "/";
    if (cleanPath.startsWith("/aboutus")) return "about-us";
    if (cleanPath.startsWith("/knowgod")) return "know-god";
    if (cleanPath.startsWith("/donateus")) return "donate-us";
    return "home";
  });

  const [isNavReady, setIsNavReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navContainerRef = useRef(null);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle escape key and click outside to close mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    const handleClickOutside = (e) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Preloader Nav Handoff Coordinator
  useEffect(() => {
    if (document.body.classList.contains("preloader-nav-ready")) {
      setIsNavReady(true);
      return;
    }

    const handleNavReady = () => {
      setIsNavReady(true);
    };

    window.addEventListener("preloader-nav-ready", handleNavReady);

    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("preloader-nav-ready")) {
        setIsNavReady(true);
      }
    });

    observer.observe(document.body, { attributes: true });

    return () => {
      window.removeEventListener("preloader-nav-ready", handleNavReady);
      observer.disconnect();
    };
  }, []);

  // GSAP Entrance Animation when Nav is Ready
  useEffect(() => {
    if (isNavReady && navContainerRef.current && typeof window !== "undefined" && gsap) {
      gsap.fromTo(
        navContainerRef.current,
        { opacity: 0, y: -16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            window.dispatchEvent(new Event("resize"));
          }
        }
      );
    }
  }, [isNavReady]);

  // Track active section and scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // If user recently clicked a nav item and page is animating/smooth scrolling, preserve the selected section
      if (isClickScrollingRef.current) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const footerEl = document.getElementById("footer");
      const isAtBottom = scrollY + viewportHeight >= fullHeight - 120;
      const isFooterInView = isAtBottom || (scrollY > 500 && footerEl && footerEl.getBoundingClientRect().top <= viewportHeight * 0.55);

      const cleanPath = pathname?.replace(/\/$/, "") || "/";

      // 2. Sections on the Home Page
      if (cleanPath === "/") {
        if (isFooterInView) {
          setActiveSection("footer");
          return;
        }

        if (scrollY < 200) {
          setActiveSection("home");
          return;
        }

        const donateEl = document.getElementById("donate-us");
        const sermonsEl = document.getElementById("sermons");

        const getTop = (el) => {
          if (!el) return Infinity;
          return el.getBoundingClientRect().top + scrollY;
        };

        const focalY = scrollY + 220;
        const donateTop = getTop(donateEl);
        const sermonsTop = getTop(sermonsEl);

        if (focalY >= donateTop - 80) {
          setActiveSection("donate-us");
        } else if (focalY >= sermonsTop - 80) {
          setActiveSection("sermons");
        } else {
          setActiveSection("home");
        }
      } else if (cleanPath.startsWith("/aboutus")) {
        setActiveSection(isFooterInView ? "footer" : "about-us");
      } else if (cleanPath.startsWith("/knowgod")) {
        setActiveSection(isFooterInView ? "footer" : "know-god");
      } else if (cleanPath.startsWith("/donateus")) {
        setActiveSection(isFooterInView ? "footer" : "donate-us");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Route change synchronization
  useEffect(() => {
    const cleanPath = pathname?.replace(/\/$/, "") || "/";
    if (cleanPath.startsWith("/aboutus")) {
      setActiveSection("about-us");
    } else if (cleanPath.startsWith("/knowgod")) {
      setActiveSection("know-god");
    } else if (cleanPath.startsWith("/donateus")) {
      setActiveSection("donate-us");
    } else if (cleanPath === "/") {
      const storedTarget = typeof window !== "undefined" ? sessionStorage.getItem("flag-nav-target") : null;
      const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
      const targetId = storedTarget || hash;
      if (targetId && (targetId === "sermons" || targetId === "donate-us" || targetId === "footer")) {
        setActiveSection(targetId);
      } else {
        setActiveSection("home");
      }
    }
  }, [pathname]);

  // Cross-page Hash Navigation Handler (e.g. from /aboutus to /#sermons or /#donate-us)
  useEffect(() => {
    const cleanPath = pathname?.replace(/\/$/, "") || "/";
    if (cleanPath === "/") {
      const storedTarget = typeof window !== "undefined" ? sessionStorage.getItem("flag-nav-target") : null;
      const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
      const targetId = storedTarget || hash;

      if (targetId && (targetId === "sermons" || targetId === "donate-us" || targetId === "footer")) {
        sessionStorage.removeItem("flag-nav-target");
        isClickScrollingRef.current = true;
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 1200);

        setActiveSection(targetId);
        let attempts = 0;
        const maxAttempts = 25;
        const interval = setInterval(() => {
          attempts++;
          const el = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
          if (el) {
            clearInterval(interval);
            setTimeout(() => {
              const top = el.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
              setActiveSection(targetId);
            }, 100);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 100);

        return () => clearInterval(interval);
      }
    }
  }, [pathname]);

  // Global Scroll-Reveal Intersection Observer Engine
  useEffect(() => {
    if (typeof window === "undefined") return;

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
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const targets = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [pathname]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Sermons", href: "/#sermons" },
    { label: "Donate", href: "/#donate-us" },
    { label: "Connect", href: "/#footer" },
    { label: "About Us", href: "/aboutus" },
    { 
      label: "Know God", 
      href: "/knowgod", 
      className: "know-god-shine-pill",
      color: "#E25C5C",
      activeTextColor: "#FFFFFF",
      colors: ["#E25C5C", "#F87171", "#FFAAA6"]
    },
  ];

  const getActiveHref = useCallback(() => {
    // If user scrolled into footer on any page, "Connect" is active
    if (activeSection === "footer") return "/#footer";

    const cleanPath = pathname?.replace(/\/$/, "") || "/";

    if (cleanPath.startsWith("/aboutus")) return "/aboutus";
    if (cleanPath.startsWith("/knowgod")) return "/knowgod";
    if (cleanPath.startsWith("/donateus")) return "/#donate-us";

    if (cleanPath === "/") {
      if (activeSection === "sermons") return "/#sermons";
      if (activeSection === "donate-us") return "/#donate-us";
      return "/";
    }

    return cleanPath;
  }, [activeSection, pathname]);

  const activeNavIndex = navItems.findIndex((item) => item.href === getActiveHref());
  const isKnowGodActive = activeNavIndex === 5;

  const scrollToTarget = (elementId, offset = 80) => {
    const el = document.getElementById(elementId) || document.querySelector(`.${elementId}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      return true;
    }
    return false;
  };

  const handleItemClick = (item, index, event) => {
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);

    const cleanPath = pathname?.replace(/\/$/, "") || "/";

    // 1. Home Link
    if (item.href === "/") {
      if (cleanPath === "/") {
        event?.preventDefault?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setActiveSection("home");
      }
      return;
    }

    // 2. Connect (#footer is present on every page: /, /aboutus, /knowgod)
    if (item.href === "/#footer" || item.href === "#footer") {
      event?.preventDefault?.();
      scrollToTarget("footer", 40);
      window.history.pushState(null, "", "#footer");
      setActiveSection("footer");
      return;
    }

    // 3. Sermons or Donate (embedded sections on Home page)
    if (item.href?.startsWith("/#")) {
      const targetId = item.href.replace("/#", "");
      if (cleanPath === "/") {
        event?.preventDefault?.();
        scrollToTarget(targetId, 80);
        window.history.pushState(null, "", `#${targetId}`);
        setActiveSection(targetId);
      } else {
        // Navigating from another route (e.g. /aboutus) to /#sermons or /#donate-us
        sessionStorage.setItem("flag-nav-target", targetId);
      }
      return;
    }

    // 4. About Us
    if (item.href === "/aboutus") {
      if (cleanPath.startsWith("/aboutus")) {
        event?.preventDefault?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("about-us");
      }
      return;
    }

    // 5. Know God
    if (item.href === "/knowgod") {
      if (cleanPath.startsWith("/knowgod")) {
        event?.preventDefault?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("know-god");
      }
      return;
    }
  };

  return (
    <header id="home-navbar" className="glass-nav-header">
      <div
        ref={navContainerRef}
        className={`glass-nav-container ${
          isNavReady ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-2 sm:gap-4">
          {/* 1. Standalone Left Logo Badge */}
          <Link
            href="/"
            className={`logo navbar-logo glass-badge-btn ${isScrolled ? "is-scrolled" : ""}`}
            aria-label="FLAG Church Home"
            onClick={(e) => {
              const cleanPath = pathname?.replace(/\/$/, "") || "/";
              if (cleanPath === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.pushState(null, "", "/");
                setActiveSection("home");
              }
            }}
          >
            <Image
              alt="FLAG Logo"
              src={getMediaUrl("/images/flag-logo.avif")}
              width={48}
              height={48}
              priority
              className="w-full h-full object-cover rounded-full"
            />
          </Link>

          {/* 2. Centered React Bits <PillNav /> Navigation */}
          <div className="hidden md:flex flex-1 min-w-0 items-center justify-center">
            <PillNav
              items={navItems}
              activeHref={getActiveHref()}
              onItemClick={handleItemClick}
              linkComponent={Link}
              theme={theme === "light" ? "light" : "dark"}
              layout="split"
              itemStyle="plain"
              hoverEffect="glide"
              indicator="pill"
              surface="glass"
              size="md"
              highlightColor={isKnowGodActive ? "#E25C5C" : "#D9A31A"}
              highlightTextColor={isKnowGodActive ? "#FFFFFF" : "#121016"}
              bounce={0.25}
              stretch={0.4}
              collapse="never"
              className={isScrolled ? "is-scrolled" : ""}
            />
          </div>

          {/* 3. Right Theme Toggle Badge + Mobile Menu Button */}
          <div className="flex items-center space-x-2 pointer-events-auto flex-none">
            <ThemeToggle />

            {/* Mobile Toggle Button (Visible strictly on mobile screens < 768px) */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="glass-mobile-btn md:hidden cursor-pointer"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMenuOpen && (
          <div className="glass-mobile-dropdown animate-page-entry md:hidden">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, index) => {
                const isActive = index === activeNavIndex;
                const isKnowGod = item.href === "/knowgod";
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      handleItemClick(item, index, e);
                      setIsMenuOpen(false);
                    }}
                    className={`glass-mobile-link ${isActive ? "is-active" : ""} ${
                      isKnowGod ? "know-god-shine-mobile" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
