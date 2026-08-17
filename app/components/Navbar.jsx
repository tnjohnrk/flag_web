"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../public/Images/flag-logo.png";
import "./Navbar.css";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ThemeToggle from "./ThemeToggle";
import SpecularNavItem from "./SpecularNavItem";

export default function Navbar() {
  const [isClick, setIsClick] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isNavReady, setIsNavReady] = useState(false);

  const toggleNavBar = () => {
    setIsClick(!isClick);
  };

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

  // IntersectionObserver to detect when user leaves or enters the Hero section
  useEffect(() => {
    const heroTarget =
      document.querySelector(".hero-video-wrapper") ||
      document.querySelector(".div") ||
      document.getElementById("home");

    if (!heroTarget) {
      const handleScrollFallback = () => {
        setIsHeroVisible(window.scrollY < 400);
      };
      window.addEventListener("scroll", handleScrollFallback);
      return () => window.removeEventListener("scroll", handleScrollFallback);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(heroTarget);
    return () => observer.disconnect();
  }, []);

  // Track active section for gold accent indicator
  useEffect(() => {
    const sections = [
      { id: "home", selector: ".hero-video-wrapper" },
      { id: "about-us", selector: "#about-us" },
      { id: "sermons", selector: "#sermons" },
      { id: "know-god", selector: "#know-god" },
      { id: "donate-us", selector: "#donate-us" },
      { id: "footer", selector: "#footer" },
    ];

    const handleActiveObserver = () => {
      const scrollPos = window.scrollY + 200;
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

    window.addEventListener("scroll", handleActiveObserver);
    return () => window.removeEventListener("scroll", handleActiveObserver);
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
    <nav
      id="home-navbar"
      className="navbar-item fixed top-0 left-0 w-full z-50 pointer-events-auto transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo on Left (Independent Element - Target for Preloader Fly-In) */}
          <div className="flex items-center shrink-0">
            <Link
              href="#home"
              className={`logo navbar-logo transition-all duration-500 ${
                isNavReady ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
              }`}
            >
              <Image alt="logo" src={logo} priority />
            </Link>
          </div>

          {/* Centered Navigation Items - Individual Floating Elements with NO shared navbar container */}
          <div
            className={`hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-3 transition-all duration-700 ease-out ${
              isNavReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              
              return (
                <SpecularNavItem
                  key={item.name}
                  href={item.href}
                  name={item.name}
                  isActive={isActive}
                  isHeroVisible={isHeroVisible}
                />
              );
            })}
          </div>

          {/* Right Theme Toggle (Independent Element) */}
          <div
            className={`hidden md:flex items-center transition-all duration-700 delay-100 ease-out ${
              isNavReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <ThemeToggle />
          </div>

          {/* Mobile Navigation Toggle */}
          <div
            className={`md:hidden flex items-center space-x-3 transition-all duration-700 ease-out ${
              isNavReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <ThemeToggle />
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-accent focus:outline-none"
              onClick={toggleNavBar}
              aria-label="Toggle mobile menu"
            >
              {isClick ? <CloseIcon /> : <MenuOpenIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out transform overflow-hidden bg-black/90 backdrop-blur-md rounded-2xl shadow-xl mt-2 ${
            isClick ? "translate-y-0 opacity-100 max-h-[500px]" : "-translate-y-4 opacity-0 max-h-0 pointer-events-none"
          }`}
        >
          <div className="px-3 pt-3 pb-4 space-y-2 text-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsClick(false)}
                className="block text-white hover:bg-white/15 hover:text-[#D9A31A] font-bold text-sm tracking-wider rounded-xl p-2.5 transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
