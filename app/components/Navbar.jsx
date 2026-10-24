"use client";

import Link from "next/link";
import Image from "next/image";
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import PillNav from "./PillNav";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("home");
  const [isNavReady, setIsNavReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navContainerRef = useRef(null);

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
    { label: "Know God", href: "/knowgod", className: "know-god-shine-pill" },
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

  const handleItemClick = (item, index, event) => {
    if (item.href === "/" && pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setActiveSection("home");
      return;
    }
    if (item.href?.startsWith("/#") && pathname === "/") {
      const targetId = item.href.replace("/#", "");
      const el = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
      if (el) {
        event.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", item.href.replace("/", ""));
        setActiveSection(targetId);
      }
    }
  };

  const logoElement = (
    <Image
      alt="FLAG Logo"
      src="/images/flag-logo.avif"
      width={48}
      height={48}
      priority
      className="w-full h-full object-cover rounded-full"
    />
  );

  return (
    <header id="home-navbar" className="glass-nav-header">
      <div
        ref={navContainerRef}
        className={`glass-nav-container transition-all duration-700 ease-out ${
          isNavReady ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-2 sm:gap-3">
          {/* Desktop Left Spacer to balance ThemeToggle for center alignment */}
          <div className="hidden lg:block w-9 sm:w-10 flex-none pointer-events-none" aria-hidden="true" />

          {/* Centered React Bits <PillNav /> Navigation */}
          <div className="flex-1 min-w-0 flex items-center justify-center">
            <PillNav
              logo={logoElement}
              logoAlt="FLAG Church Logo"
              logoHref="/"
              items={navItems}
              activeHref={getActiveHref()}
              onItemClick={handleItemClick}
              linkComponent={Link}
              theme={theme === "light" ? "light" : "dark"}
              layout="split"
              itemStyle="pill"
              hoverEffect="fill"
              indicator="pill"
              highlightColor="#D9A31A"
              highlightTextColor="#121016"
              size="md"
              className={isScrolled ? "is-scrolled" : ""}
            />
          </div>

          {/* Standalone Right Theme Toggle Badge */}
          <div className="flex-none pointer-events-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
