"use client";

import Link from "next/link";
import Image from "next/image";
import { getMediaUrl } from "@/lib/media";
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import GooeyNav from "./GooeyNav";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("home");
  const [isNavReady, setIsNavReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navContainerRef = useRef(null);

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
        { opacity: 0, y: -20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [isNavReady]);

  // Track active section and scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      if (pathname === "/") {
        const sections = [
          { id: "home", selector: ".hero-video-wrapper" },
          { id: "sermons", selector: "#sermons" },
          { id: "donate-us", selector: "#donate-us" },
          { id: "footer", selector: "#footer" },
        ];

        const scrollPos = window.scrollY + 220;
        for (let i = sections.length - 1; i >= 0; i--) {
          const el =
            document.querySelector(sections[i].selector) ||
            document.getElementById(sections[i].id);
          if (el && el.offsetTop <= scrollPos) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    if (pathname === "/aboutus") {
      setActiveSection("about-us");
    } else if (pathname === "/knowgod") {
      setActiveSection("know-god");
    } else if (pathname !== "/") {
      setActiveSection("");
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
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

  const getActiveHref = () => {
    if (pathname === "/aboutus") return "/aboutus";
    if (pathname === "/knowgod") return "/knowgod";
    if (pathname === "/") {
      if (activeSection === "sermons") return "/#sermons";
      if (activeSection === "donate-us") return "/#donate-us";
      if (activeSection === "footer") return "/#footer";
      return "/";
    }
    return pathname;
  };

  const activeNavIndex = navItems.findIndex((item) => item.href === getActiveHref());
  const isKnowGodActive = activeNavIndex === 5;

  const handleItemClick = (item, index, event) => {
    if (item.href === "/" && pathname === "/") {
      event?.preventDefault?.();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setActiveSection("home");
      return;
    }
    if (item.href?.startsWith("/#") && pathname === "/") {
      const targetId = item.href.replace("/#", "");
      const el = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
      if (el) {
        event?.preventDefault?.();
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", item.href.replace("/", ""));
        setActiveSection(targetId);
      }
    }
  };

  return (
    <header id="home-navbar" className="glass-nav-header">
      <div
        ref={navContainerRef}
        className={`glass-nav-container transition-all duration-700 ease-out ${
          isNavReady ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-2 sm:gap-4">
          {/* 1. Standalone Left Logo Badge */}
          <Link
            href="/"
            className={`logo navbar-logo glass-badge-btn ${isScrolled ? "is-scrolled" : ""}`}
            aria-label="FLAG Church Home"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
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

          {/* 2. Centered React Bits <GooeyNav /> Navigation */}
          <div className="hidden md:flex flex-1 min-w-0 items-center justify-center">
            <GooeyNav
              items={navItems}
              activeIndex={activeNavIndex >= 0 ? activeNavIndex : 0}
              onItemClick={handleItemClick}
              linkComponent={Link}
              theme={theme === "light" ? "light" : "dark"}
              color={isKnowGodActive ? "#E25C5C" : "#D9A31A"}
              activeTextColor={isKnowGodActive ? "#FFFFFF" : "#121016"}
              colors={isKnowGodActive ? ["#E25C5C", "#F87171", "#FFAAA6"] : ["#D9A31A", "#F5C75D", "#E5B138"]}
              size="md"
              frame={true}
              particleCount={16}
              spread={56}
              animationTime={600}
              timeVariance={300}
              gooeyness={0.5}
              wobble={0.5}
              hoverEffect={true}
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
