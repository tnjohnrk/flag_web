"use client";

import Link from "next/link";
import Image from "next/image";
import "./Navbar.css";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import gsap from "gsap";

export default function Navbar() {
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
    const sections = [
      { id: "home", selector: ".hero-video-wrapper" },
      { id: "about-us", selector: "#about-us" },
      { id: "sermons", selector: "#sermons" },
      { id: "know-god", selector: "#know-god" },
      { id: "donate-us", selector: "#donate-us" },
      { id: "footer", selector: "#footer" },
    ];

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "HOME", href: "#home", id: "home" },
    { name: "ABOUT US", href: "#about-us", id: "about-us" },
    { name: "SERMONS", href: "#sermons", id: "sermons" },
    { name: "KNOW GOD", href: "#know-god", id: "know-god" },
    { name: "DONATE US", href: "#donate-us", id: "donate-us" },
    { name: "CONTACT US", href: "#footer", id: "footer" },
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
          href="#home"
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

        {/* 2. Centered Floating Glass Navigation Pill (Visible strictly on Desktop lg: 1024px+) */}
        <nav className={`hidden lg:flex glass-central-pill ${isScrolled ? "is-scrolled" : ""}`}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`glass-nav-link ${isActive ? "is-active" : ""}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 3. Single Standalone Right Theme Toggle Badge */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
