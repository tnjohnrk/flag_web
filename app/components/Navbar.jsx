"use client";

import Link from "next/link";
import Image from "next/image";
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("home");
  const [isNavReady, setIsNavReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navContainerRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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

    // Accessibility: Reduced Motion Preference
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
    { name: "HOME", href: "/", id: "home" },
    { name: "SERMONS", href: "/#sermons", id: "sermons" },
    { name: "DONATE US", href: "/#donate-us", id: "donate-us" },
    { name: "CONNECT WITH US", href: "/#footer", id: "footer" },
    { name: "ABOUT US", href: "/aboutus", id: "about-us" },
    { name: "KNOW GOD", href: "/knowgod", id: "know-god" },
  ];

  return (
    <header id="home-navbar" className="glass-nav-header">
      <div
        ref={navContainerRef}
        className={`glass-nav-container transition-all duration-700 ease-out ${
          isNavReady ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* 1. Standalone Left Logo Badge */}
        <Link
          href="/"
          className={`logo navbar-logo glass-badge-btn ${isScrolled ? "is-scrolled" : ""}`}
          aria-label="FLAG Church Home"
        >
          <Image
            alt="FLAG Logo"
            src="/images/flag-logo.avif"
            width={52}
            height={52}
            priority
            className="w-full h-full object-cover rounded-full"
          />
        </Link>

        {/* 2. Centered Floating Glass Navigation Pill */}
        <nav className={`glass-central-pill ${isScrolled ? "is-scrolled" : ""}`}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isKnowGod = item.id === "know-god";
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`glass-nav-link ${isActive ? "is-active" : ""} ${isKnowGod ? "know-god-shine" : ""}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 3. Single Standalone Right Theme Toggle Badge + Mobile Menu Button */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <ThemeToggle />
          
          {/* Mobile Toggle Button (Visible strictly on mobile/tablet widths) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="glass-mobile-btn cursor-pointer"
            aria-label="Toggle Menu"
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
        <div className="glass-mobile-dropdown animate-page-entry">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const isKnowGod = item.id === "know-god";
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`glass-mobile-link ${isActive ? "is-active" : ""} ${isKnowGod ? "know-god-shine-mobile" : ""}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
