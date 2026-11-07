"use client";
import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/media';
import { 
  Check, 
  Loader2, 
  AlertCircle, 
  MapPin, 
  Map, 
  Sparkles, 
  Heart, 
  Cross, 
  BookOpen, 
  Users, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';
import PillButton from '../components/PillButton';
import './knowgod.css';

export default function KnowGod() {
  // Form State
  const [formStatus, setFormStatus] = useState("idle"); // "idle" | "submitting" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [showMap, setShowMap] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Interactive Chapter State
  const [activeChapter, setActiveChapter] = useState("who-is-jesus");
  const [activePerspective, setActivePerspective] = useState("savior"); // "savior" | "teacher" | "miracles"
  const [expandedTruthId, setExpandedTruthId] = useState(1); // 1 | 2 | 3 | 4 | null
  const [activeStep, setActiveStep] = useState(1); // 1 to 5
  const [hasPrayed, setHasPrayed] = useState(false);
  const [activeGrowthTab, setActiveGrowthTab] = useState("bible"); // "bible" | "prayer" | "community" | "worship"

  // Smooth scroll helper with sticky nav offset
  const scrollToChapter = (id) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (!element) return;
    const yOffset = -120; // Offset for fixed navbar + chapter pill bar
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Chapter spy observer
  useEffect(() => {
    if (typeof window === "undefined") return;

    const chapterIds = ["who-is-jesus", "four-truths", "receive-jesus", "connect-form", "next-steps"];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (let i = chapterIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapterIds[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveChapter(chapterIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load Leaflet resources dynamically when map is opened
  useEffect(() => {
    if (!showMap) return;

    let mapInstance = null;

    const initMap = () => {
      if (typeof window === "undefined" || !window.L) return;

      const L = window.L;
      const defaultLat = 13.0783;
      const defaultLng = 80.1185;

      const initialLat = markerRef.current ? markerRef.current.getLatLng().lat : defaultLat;
      const initialLng = markerRef.current ? markerRef.current.getLatLng().lng : defaultLng;

      mapInstance = L.map("leaflet-map").setView([initialLat, initialLng], 13);
      mapRef.current = mapInstance;

      L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>'
      }).addTo(mapInstance);

      const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(mapInstance);
      markerRef.current = marker;

      const updateMarkerLocation = async (lat, lng) => {
        setMapLink(`https://www.google.com/maps?q=${lat},${lng}`);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              setAddressText(data.display_name);
            }
          }
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          setAddressText((prev) => prev || `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`);
        }
      };

      marker.on("dragend", () => {
        const position = marker.getLatLng();
        updateMarkerLocation(position.lat, position.lng);
      });

      mapInstance.on("click", (e) => {
        marker.setLatLng(e.latlng);
        updateMarkerLocation(e.latlng.lat, e.latlng.lng);
      });

      // Load default location first
      updateMarkerLocation(defaultLat, defaultLng);
    };

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      setTimeout(initMap, 100);
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [showMap]);

  const handleMapSearch = async (e) => {
    e.preventDefault();
    if (!mapSearchQuery.trim()) return;

    setIsSearchingMap(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lon);

          setAddressText(display_name);
          setMapLink(`https://www.google.com/maps?q=${latitude},${longitude}`);

          if (mapRef.current && markerRef.current) {
            const pos = [latitude, longitude];
            mapRef.current.setView(pos, 16);
            markerRef.current.setLatLng(pos);
          }
        } else {
          alert("Location not found. Please try another search.");
        }
      }
    } catch (err) {
      console.error("Map search failed:", err);
    } finally {
      setIsSearchingMap(false);
    }
  };

  const handleTriggerGPS = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapLink(`https://www.google.com/maps?q=${latitude},${longitude}`);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              setAddressText(data.display_name);
            }
          } else {
            setAddressText(`Latitude: ${latitude.toFixed(5)}, Longitude: ${longitude.toFixed(5)}`);
          }
        } catch (err) {
          setAddressText(`Latitude: ${latitude.toFixed(5)}, Longitude: ${longitude.toFixed(5)}`);
        }

        if (mapRef.current && markerRef.current) {
          const pos = [latitude, longitude];
          mapRef.current.setView(pos, 16);
          markerRef.current.setLatLng(pos);
        }
      },
      (error) => {
        console.error("GPS Location error:", error);
        alert(`Could not retrieve GPS location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    const form = e.target;
    const formData = new FormData(form);

    const rawMobile = mobileNumber || formData.get("mobile") || "";
    const cleanDigits = String(rawMobile).replace(/\D/g, "");

    if (cleanDigits.length !== 10) {
      setFormStatus("error");
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const formattedMobile = `+91 ${cleanDigits}`;

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      mobile: formattedMobile,
      email: formData.get("email") || "",
      address: addressText,
      mapLink: formData.get("mapLink"),
      houseVisit: formData.get("houseVisit"),
      canContact: formData.get("canContact"),
      communicationConsent: formData.get("communicationConsent") === "on",
    };

    try {
      const response = await fetch("/api/knowgod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error("Failed to parse response JSON", jsonErr);
      }

      if (response.ok && data.success) {
        setFormStatus("success");
        form.reset();
        setMobileNumber("");
        setAddressText("");
        setMapLink("");
        setShowMap(false);
      } else {
        setFormStatus("error");
        setErrorMessage(data.error || `Submission failed (${response.status}: ${response.statusText || 'Server Error'}). Please try again.`);
      }
    } catch (err) {
      setFormStatus("error");
      setErrorMessage("We couldn't submit your response. Please try again.");
    }
  };

  // Intersection Observer for Scroll-Driven Reveal Engine
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
        threshold: 0.1,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    const targets = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  // Stepper content data
  const stepperData = [
    {
      step: 1,
      title: "Admit You Need a Savior",
      summary: "Recognize that we have all sinned and fallen short of God’s glory.",
      scripture: "“For all have sinned and fall short of the glory of God.” — Romans 3:23",
      action: "Take a quiet breath and acknowledge your need for God's forgiveness and mercy.",
    },
    {
      step: 2,
      title: "Turn from Your Sins (Repentance)",
      summary: "Make a sincere heart decision to turn away from past brokenness toward God.",
      scripture: "“Repent, then, and turn to God, so that your sins may be wiped out.” — Acts 3:19",
      action: "Repentance isn't self-condemnation—it is stepping out of darkness and running into the arms of grace.",
    },
    {
      step: 3,
      title: "Believe in Jesus Christ",
      summary: "Trust that Jesus died for your sins upon the cross and rose bodily from the dead.",
      scripture: "“Believe in the Lord Jesus, and you will be saved—you and your household.” — Acts 16:31",
      action: "Put your confidence not in personal goodness, but in Christ's finished work of love.",
    },
    {
      step: 4,
      title: "Invite Jesus into Your Heart & Life",
      summary: "Surrender your heart to Him and receive the Holy Spirit as your constant Comforter.",
      scripture: "“Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in.” — Revelation 3:20",
      action: "Open the door of your heart. Jesus honors your invitation with an everlasting presence.",
    },
    {
      step: 5,
      title: "Pray and Receive Him Today",
      summary: "Seal this spiritual decision with a sincere prayer of faith.",
      scripture: "“Everyone who calls on the name of the Lord will be saved.” — Romans 10:13",
      action: "Read the Prayer of Salvation below aloud with an open heart. Heaven is listening!",
    },
  ];

  return (
    <div id="know-god" className="w-full bg-background text-text-primary transition-colors duration-500 overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 animate-page-entry relative">
      {/* Radiant Ambient Background Aura */}
      <div className="knowgod-hero-glow" />

      {/* ===================================================================
          FLOATING STICKY CHAPTER NAVIGATION PILL BAR
          =================================================================== */}
      <aside aria-label="Chapter Navigation" className="knowgod-chapter-nav">
        <div className="knowgod-chapter-pillbar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeChapter === "who-is-jesus"}
            onClick={() => scrollToChapter("who-is-jesus")}
            className={`knowgod-nav-btn ${activeChapter === "who-is-jesus" ? "is-active" : ""}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Who is Jesus?</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeChapter === "four-truths"}
            onClick={() => scrollToChapter("four-truths")}
            className={`knowgod-nav-btn ${activeChapter === "four-truths" ? "is-active" : ""}`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>4 Truths</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeChapter === "receive-jesus"}
            onClick={() => scrollToChapter("receive-jesus")}
            className={`knowgod-nav-btn ${activeChapter === "receive-jesus" ? "is-active" : ""}`}
          >
            <Cross className="w-3.5 h-3.5" />
            <span>Receive Jesus</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeChapter === "connect-form"}
            onClick={() => scrollToChapter("connect-form")}
            className={`knowgod-nav-btn ${activeChapter === "connect-form" ? "is-active" : ""}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Connect</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeChapter === "next-steps"}
            onClick={() => scrollToChapter("next-steps")}
            className={`knowgod-nav-btn ${activeChapter === "next-steps" ? "is-active" : ""}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Next Steps</span>
          </button>
        </div>
      </aside>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32">

        {/* ===================================================================
            HERO INTRO & CHAPTER 1: WHO IS JESUS?
            =================================================================== */}
        <section data-reveal id="who-is-jesus" className="relative pt-4 sm:pt-8 text-center scroll-mt-36">
          <div className="relative z-10 space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A31A]/10 border border-[#D9A31A]/30 text-[#D9A31A] text-xs font-bold tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE JOURNEY OF FAITH</span>
            </div>

            <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-bold text-flag-navy dark:text-white tracking-tight leading-[1.08]">
              Know God
            </h1>

            <div className="w-20 h-0.5 bg-[#D9A31A] mx-auto rounded-full" />

            <p className="font-editorial italic text-lg sm:text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
              A transformative journey of grace, truth, and eternal life. Discover the boundless love of God through Jesus Christ.
            </p>

            {/* Quick Hero CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <PillButton
                onClick={() => scrollToChapter("receive-jesus")}
                variant="gold"
                size="md"
                className="font-bold shadow-md"
              >
                <span>Receive Jesus Today</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </PillButton>

              <PillButton
                onClick={() => scrollToChapter("four-truths")}
                variant="gold-dark"
                size="md"
                className="font-bold"
              >
                <span>Explore The 4 Truths</span>
              </PillButton>
            </div>
          </div>

          {/* Interactive Hero Grid: Visual + Interactive Perspectives */}
          <div data-reveal-stagger className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center text-left">
            {/* Visual Portrait */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative overflow-hidden rounded-[28px] border border-border shadow-2xl group">
                <Image
                  src={getMediaUrl("/images/WhoIsJesus.avif")}
                  alt="Who Is Jesus? The Savior of the world"
                  width={600}
                  height={520}
                  priority
                  className="object-cover w-full h-[360px] sm:h-[420px] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-6 right-6 z-10 space-y-1">
                  <span className="text-xs uppercase font-sans-clean tracking-widest text-[#D9A31A] font-bold block">
                    THE SON OF GOD
                  </span>
                  <span className="font-editorial text-2xl text-white font-bold drop-shadow-md block">
                    Who Is Jesus?
                  </span>
                  <p className="text-xs text-white/80 font-sans-clean">
                    His life marks history, dividing time into B.C. and A.D.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Perspective Switcher */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-xl space-y-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-flag-navy dark:text-white leading-tight">
                    <span className="text-[#D9A31A]">Jesus</span> is More Than a Teacher
                  </h2>
                  <p className="font-sans-clean text-xs sm:text-sm text-text-secondary mt-1">
                    Select a perspective to uncover who Jesus truly is to the world and to you:
                  </p>
                </div>

                {/* Perspective Selection Tabs */}
                <div className="flex flex-wrap gap-2 pt-1" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activePerspective === "savior"}
                    onClick={() => setActivePerspective("savior")}
                    className={`perspective-tab-btn ${activePerspective === "savior" ? "is-active" : ""}`}
                  >
                    <Cross className="w-4 h-4 text-[#D9A31A]" />
                    <span>The Savior</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activePerspective === "teacher"}
                    onClick={() => setActivePerspective("teacher")}
                    className={`perspective-tab-btn ${activePerspective === "teacher" ? "is-active" : ""}`}
                  >
                    <BookOpen className="w-4 h-4 text-[#D9A31A]" />
                    <span>The Way & Truth</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={activePerspective === "miracles"}
                    onClick={() => setActivePerspective("miracles")}
                    className={`perspective-tab-btn ${activePerspective === "miracles" ? "is-active" : ""}`}
                  >
                    <Flame className="w-4 h-4 text-[#D9A31A]" />
                    <span>Miracles & Power</span>
                  </button>
                </div>

                {/* Perspective Card Dynamic Content */}
                <div className="pt-2 transition-all duration-300">
                  {activePerspective === "savior" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A31A] block mb-1">
                          Luke 19:10
                        </span>
                        <p className="font-editorial italic text-base sm:text-lg text-text-primary">
                          “For the Son of Man came to seek and to save the lost.”
                        </p>
                      </div>
                      <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-relaxed">
                        Jesus did not arrive on earth as an untouchable judge. He stepped straight into our hurt, took our sins upon Himself at Calvary, and purchased our freedom. Through His sacrifice, forgiveness is no longer something we labor to earn—it is a free gift received by faith.
                      </p>
                    </div>
                  )}

                  {activePerspective === "teacher" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A31A] block mb-1">
                          John 14:6
                        </span>
                        <p className="font-editorial italic text-base sm:text-lg text-text-primary">
                          “I am the Way, the Truth, and the Life. No one comes to the Father except through Me.”
                        </p>
                      </div>
                      <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-relaxed">
                        Many respected leaders throughout world history gave advice on how to seek truth. But Jesus did what no philosopher ever dared to do: He declared that He <em>is</em> Truth incarnate. His words continue to heal broken minds, mend families, and instill hope in millions across generations.
                      </p>
                    </div>
                  )}

                  {activePerspective === "miracles" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-border">
                        <span className="text-xs uppercase tracking-widest font-bold text-[#D9A31A] block mb-1">
                          Hebrews 13:8
                        </span>
                        <p className="font-editorial italic text-base sm:text-lg text-text-primary">
                          “Jesus Christ is the same yesterday, today, and forever.”
                        </p>
                      </div>
                      <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-relaxed">
                        He walked on waves, opened blind eyes, broke lifelong chains of depression, and walked out of the sealed tomb on the third day. That same resurrection power is not trapped in an ancient manuscript—it is alive today and ready to meet you right where you are.
                      </p>
                    </div>
                  )}
                </div>

                {/* C.S. Lewis Quote Footer */}
                <div className="pt-4 border-t border-border mt-2">
                  <p className="font-editorial italic text-sm sm:text-base text-text-primary">
                    “A man who was merely a man and said the sort of things Jesus said would not be a great moral teacher. Either He was, and is, the Son of God, or else a madman or something worse.”
                  </p>
                  <span className="font-sans-clean text-xs font-bold text-[#D9A31A] block mt-1">
                    — C.S. Lewis, Mere Christianity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ===================================================================
            CHAPTER 2: THE 4 DIVINE TRUTHS (INTERACTIVE ACCORDION CARDS)
            =================================================================== */}
        <section data-reveal id="four-truths" className="space-y-12 scroll-mt-36">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
              FOUNDATIONS OF ETERNAL LIFE
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-flag-navy dark:text-white tracking-tight">
              The 4 Divine Truths
            </h2>
            <div className="w-16 h-0.5 bg-[#D9A31A] mx-auto rounded-full" />
            <p className="font-sans-clean text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
              Four timeless spiritual pillars that illuminate God’s eternal design and His personal invitation to your heart. Click any card to explore the scripture deep dive:
            </p>
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* TRUTH 1 */}
            <div 
              className={`truth-card cursor-pointer ${expandedTruthId === 1 ? "is-expanded" : ""}`}
              onClick={() => setExpandedTruthId(expandedTruthId === 1 ? null : 1)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D9A31A]/10 text-[#D9A31A] border border-[#D9A31A]/30">
                    TRUTH #1 • GOD’S LOVE
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary">
                    {expandedTruthId === 1 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-flag-navy dark:text-white">
                  God Loves You and Has a Purpose for Your Life
                </h3>

                <p className="font-sans-clean text-sm text-text-secondary leading-relaxed">
                  You are neither an accident nor an afterthought. The Creator of the galaxies designed you with infinite care, unique gifts, and an eternal hope.
                </p>

                {expandedTruthId === 1 && (
                  <div className="pt-4 border-t border-border space-y-3 animate-fadeIn">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border text-xs font-editorial italic text-text-primary">
                      “For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.” — Jeremiah 29:11
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      God’s love is not based on your performance, status, or perfection. His unconditional grace seeks your deepest joy and authentic peace.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-[#D9A31A]">
                <span>{expandedTruthId === 1 ? "Click to collapse" : "Click to read scripture deep dive"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* TRUTH 2 */}
            <div 
              className={`truth-card cursor-pointer ${expandedTruthId === 2 ? "is-expanded" : ""}`}
              onClick={() => setExpandedTruthId(expandedTruthId === 2 ? null : 2)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D9A31A]/10 text-[#D9A31A] border border-[#D9A31A]/30">
                    TRUTH #2 • THE SEPARATION
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary">
                    {expandedTruthId === 2 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-flag-navy dark:text-white">
                  Humanity Was Separated from God by Sin
                </h3>

                <p className="font-sans-clean text-sm text-text-secondary leading-relaxed">
                  Every human being has missed the mark. Our pride, selfishness, and mistakes built an unbridgeable spiritual canyon between humanity and a holy God.
                </p>

                {expandedTruthId === 2 && (
                  <div className="pt-4 border-t border-border space-y-3 animate-fadeIn">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border text-xs font-editorial italic text-text-primary">
                      “For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.” — Romans 6:23
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Good works, philanthropy, and human rituals cannot bridge this spiritual chasm on our own. We needed divine rescue.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-[#D9A31A]">
                <span>{expandedTruthId === 2 ? "Click to collapse" : "Click to read scripture deep dive"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* TRUTH 3 */}
            <div 
              className={`truth-card cursor-pointer ${expandedTruthId === 3 ? "is-expanded" : ""}`}
              onClick={() => setExpandedTruthId(expandedTruthId === 3 ? null : 3)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D9A31A]/10 text-[#D9A31A] border border-[#D9A31A]/30">
                    TRUTH #3 • THE BRIDGE
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary">
                    {expandedTruthId === 3 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-flag-navy dark:text-white">
                  Jesus Crossed the Divide on the Cross
                </h3>

                <p className="font-sans-clean text-sm text-text-secondary leading-relaxed">
                  God proved His devotion: Jesus willingly took our guilt upon Himself at Calvary, conquered the grave, and built the bridge home.
                </p>

                {expandedTruthId === 3 && (
                  <div className="pt-4 border-t border-border space-y-3 animate-fadeIn">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border text-xs font-editorial italic text-text-primary">
                      “God demonstrates His own love for us in this: While we were still sinners, Christ died for us.” — Romans 5:8
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      His blood shed on the cross washed away the stain of sin, making reconciliation with God fully possible for anyone who believes.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-[#D9A31A]">
                <span>{expandedTruthId === 3 ? "Click to collapse" : "Click to read scripture deep dive"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* TRUTH 4 */}
            <div 
              className={`truth-card cursor-pointer ${expandedTruthId === 4 ? "is-expanded" : ""}`}
              onClick={() => setExpandedTruthId(expandedTruthId === 4 ? null : 4)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D9A31A]/10 text-[#D9A31A] border border-[#D9A31A]/30">
                    TRUTH #4 • THE FREE GIFT
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary">
                    {expandedTruthId === 4 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-flag-navy dark:text-white">
                  You Can Receive His Gift of Eternal Life Today
                </h3>

                <p className="font-sans-clean text-sm text-text-secondary leading-relaxed">
                  Salvation isn’t a salary you negotiate; it is a gift you unwrap. By simple, childlike trust in Jesus Christ, you step into eternal life.
                </p>

                {expandedTruthId === 4 && (
                  <div className="pt-4 border-t border-border space-y-3 animate-fadeIn">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-border text-xs font-editorial italic text-text-primary">
                      “For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.” — Ephesians 2:8
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      The moment you open your heart to Him, you become a child of the Living God, forever written into the Book of Life.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-[#D9A31A]">
                <span>{expandedTruthId === 4 ? "Click to collapse" : "Click to read scripture deep dive"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>


        {/* ===================================================================
            CHAPTER 3: INTERACTIVE 5-STEP STEPPER & SALVATION PRAYER
            =================================================================== */}
        <section data-reveal id="receive-jesus" className="space-y-16 scroll-mt-36">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
              A NEW BEGINNING
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-flag-navy dark:text-white tracking-tight">
              How Do I Receive Jesus?
            </h2>
            <div className="w-16 h-0.5 bg-[#D9A31A] mx-auto rounded-full" />
            <p className="font-sans-clean text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
              Follow this 5-step guided path to invite Jesus into your life. Click each step or use the controls below to walk through each milestone:
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="stepper-progress-track">
            <div className="stepper-progress-line">
              <div 
                className="stepper-progress-fill" 
                style={{ width: `${((activeStep - 1) / (stepperData.length - 1)) * 100}%` }}
              />
            </div>

            {stepperData.map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(item.step)}
                aria-label={`Go to step ${item.step}: ${item.title}`}
                className={`stepper-node-btn ${activeStep === item.step ? "is-active" : activeStep > item.step ? "is-completed" : ""}`}
              >
                {activeStep > item.step ? <Check size={18} /> : item.step}
              </button>
            ))}
          </div>

          {/* Active Step Spotlight Card */}
          <div className="max-w-2xl mx-auto p-6 sm:p-10 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-xl space-y-6 text-center">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D9A31A]">
                STEP {activeStep} OF 5
              </span>
              <span className="text-xs font-sans-clean text-text-secondary">
                {activeStep === 5 ? "Final Step" : "Interactive Guide"}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-flag-navy dark:text-white">
                {stepperData[activeStep - 1].title}
              </h3>
              <p className="font-sans-clean text-base text-text-primary font-medium leading-relaxed">
                {stepperData[activeStep - 1].summary}
              </p>

              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-border text-sm font-editorial italic text-text-secondary">
                {stepperData[activeStep - 1].scripture}
              </div>

              <div className="p-4 bg-[#D9A31A]/10 border border-[#D9A31A]/30 rounded-2xl text-xs sm:text-sm text-text-primary leading-relaxed text-left flex items-start gap-3">
                <Sun className="w-5 h-5 text-[#D9A31A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#D9A31A] block font-sans-clean">Heart Reflection:</strong>
                  {stepperData[activeStep - 1].action}
                </div>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <PillButton
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
                variant="gold-dark"
                size="sm"
                className="font-bold text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Previous</span>
              </PillButton>

              <span className="text-xs font-bold text-text-secondary">
                {activeStep} / 5
              </span>

              {activeStep < 5 ? (
                <PillButton
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                  variant="gold"
                  size="sm"
                  className="font-bold text-xs"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </PillButton>
              ) : (
                <PillButton
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("prayer-moment");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  variant="gold"
                  size="sm"
                  className="font-bold text-xs animate-bounce"
                >
                  <span>Go to Prayer ↓</span>
                </PillButton>
              )}
            </div>
          </div>

          {/* ===================================================================
              INTERACTIVE SALVATION PRAYER MOMENT & CELEBRATION FEEDBACK
              =================================================================== */}
          <div 
            id="prayer-moment"
            data-reveal 
            className="relative p-8 sm:p-12 bg-gradient-to-b from-surface via-surface-elevated to-surface dark:from-surface-elevated dark:via-surface dark:to-surface-elevated rounded-3xl border-2 border-[#D9A31A]/70 shadow-2xl text-center max-w-3xl mx-auto space-y-6 overflow-hidden"
          >
            {/* Ambient Aura */}
            <div className="absolute inset-0 pointer-events-none prayer-card-celebration" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#D9A31A] text-white font-sans-clean text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                <Cross size={14} />
                <span>Prayer of Salvation</span>
              </div>

              <p className="font-sans-clean text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
                Read this prayer from your heart to God. He hears every whisper of faith:
              </p>
              
              <blockquote className="font-editorial italic text-xl sm:text-2xl md:text-3xl text-text-primary leading-relaxed p-6 bg-black/5 dark:bg-white/5 rounded-2xl border border-border shadow-inner">
                “Father in Heaven, I believe Jesus died for my sins and rose again. I confess my need for Your forgiveness and grace. I invite Jesus into my heart as my Lord and Savior. Lead me, fill me with Your Holy Spirit, and give me eternal life. In Jesus’ precious name, Amen.”
              </blockquote>

              {/* Interactive "I Prayed This Prayer Today" Button */}
              <div className="pt-2">
                {!hasPrayed ? (
                  <PillButton
                    type="button"
                    onClick={() => {
                      setHasPrayed(true);
                      // Smooth scroll to connect form after a brief joyful pause
                      setTimeout(() => {
                        scrollToChapter("connect-form");
                      }, 2500);
                    }}
                    variant="gold"
                    size="lg"
                    className="font-bold text-sm sm:text-base px-8 py-3 shadow-xl transform transition-transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    <span>I Prayed This Prayer Today 🙏</span>
                  </PillButton>
                ) : (
                  <div className="p-6 bg-green-500/10 border-2 border-green-500/50 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold text-xl sm:text-2xl font-editorial">
                      <span>🎉 Heaven Rejoices With You Today!</span>
                    </div>
                    <p className="font-sans-clean text-sm sm:text-base text-text-primary max-w-md mx-auto leading-relaxed">
                      Welcome into the family of God! Your name is recorded in Heaven. We would love to walk beside you, pray for you, and celebrate your new life.
                    </p>
                    <PillButton
                      type="button"
                      onClick={() => scrollToChapter("connect-form")}
                      variant="gold-dark"
                      size="sm"
                      className="font-bold text-xs"
                    >
                      <span>Share your decision with us below ↓</span>
                    </PillButton>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#D9A31A]">
                  Welcome to God’s Family!
                </h3>
                <p className="font-sans-clean text-xs sm:text-sm text-text-secondary mt-1 max-w-lg mx-auto">
                  If you made this decision, you have embarked on the greatest journey of your life. Please connect with our church pastoral family below so we can support you.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================================
              CONNECT WITH US FORM
              =================================================================== */}
          <form 
            id="connect-form" 
            onSubmit={handleFormSubmit} 
            data-reveal 
            className="max-w-2xl mx-auto p-6 sm:p-10 bg-surface dark:bg-surface-elevated shadow-2xl rounded-3xl border border-border space-y-5 scroll-mt-36"
          >
            <div className="text-center space-y-2 mb-6">
              <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                WE’D LOVE TO PRAY WITH YOU
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-flag-navy dark:text-white">
                Connect With Us
              </h3>
              <p className="font-sans-clean text-xs sm:text-sm text-text-secondary">
                Let us know about your prayer request or spiritual decision so we can stand in faith with you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">First Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="firstName" 
                  className="w-full border border-border bg-background text-text-primary rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#D9A31A] focus:outline-none transition-all" 
                  required 
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">Last Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="lastName" 
                  className="w-full border border-border bg-background text-text-primary rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#D9A31A] focus:outline-none transition-all" 
                  required 
                  placeholder="e.g. Doe"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className="px-3.5 py-3 border border-border rounded-xl bg-background text-text-secondary text-sm font-semibold select-none">
                  +91
                </span>
                <input
                  type="tel"
                  name="mobile"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobileNumber(digits);
                  }}
                  onKeyDown={(e) => {
                    if (
                      ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key) ||
                      (e.ctrlKey || e.metaKey)
                    ) {
                      return;
                    }
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="10-digit mobile number"
                  className="w-full border border-border bg-background text-text-primary rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#D9A31A] focus:outline-none transition-all"
                  required
                />
              </div>
              <span className="text-[11px] text-text-secondary mt-1 block">
                Only 10-digit numbers allowed (e.g. 9876543210)
              </span>
            </div>

            <div>
              <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">
                Email Address <span className="text-text-secondary font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com (optional)"
                className="w-full border border-border bg-background text-text-primary rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#D9A31A] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">
                Address of your residency <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                className="w-full border border-border bg-background text-text-primary rounded-xl p-3 text-sm h-24 focus:ring-2 focus:ring-[#D9A31A] focus:outline-none transition-all"
                placeholder="Type your address manually or select on the map below..."
                required
              />
              
              <div className="mt-2.5">
                <PillButton
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  variant="gold-dark"
                  size="sm"
                  className="text-xs font-bold"
                >
                  <Map className="w-3.5 h-3.5 mr-1" />
                  <span>{showMap ? "Hide Interactive Map" : "Select on Interactive Map"}</span>
                </PillButton>
              </div>

              {/* Collapsible Leaflet Map Area */}
              {showMap && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-border shadow-inner relative animate-fadeIn space-y-2 bg-background p-3">
                  {/* Search Bar */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search address or area on map..."
                      value={mapSearchQuery}
                      onChange={(e) => setMapSearchQuery(e.target.value)}
                      className="flex-1 border border-border bg-surface text-text-primary rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#D9A31A]"
                    />
                    <PillButton
                      type="button"
                      onClick={handleMapSearch}
                      disabled={isSearchingMap}
                      variant="gold"
                      size="sm"
                      className="!text-xs font-bold"
                    >
                      {isSearchingMap ? "Searching..." : "Search"}
                    </PillButton>
                  </div>

                  {/* Leaflet Map Frame */}
                  <div id="leaflet-map" className="w-full h-64 rounded-xl z-0" />
                  
                  {/* Map Footer Info and Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border">
                    <div className="text-text-secondary text-[11px] max-w-full sm:max-w-[55%]">
                      Drag the red pin or search above. The address will automatically sync with your form.
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <PillButton
                        type="button"
                        onClick={handleTriggerGPS}
                        variant="gold-dark"
                        size="sm"
                        className="!text-xs font-bold"
                      >
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>My GPS</span>
                      </PillButton>
                      <PillButton
                        type="button"
                        onClick={() => setShowMap(false)}
                        variant="success"
                        size="sm"
                        className="!text-xs font-bold"
                      >
                        <span>✓ Done</span>
                      </PillButton>
                    </div>
                  </div>
                </div>
              )}

              {mapLink && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1.5">
                  <Check size={14} />
                  <span>Location confirmed:</span>
                  <a href={mapLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-700 dark:hover:text-green-300">
                    View on Google Maps
                  </a>
                </div>
              )}
              <input type="hidden" name="mapLink" value={mapLink} />
            </div>

            <div>
              <label className="block font-sans-clean text-xs font-bold mb-2 text-text-primary">
                Can we visit your house? <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-sm font-sans-clean text-text-secondary cursor-pointer">
                  <input type="radio" name="houseVisit" value="Yes" required defaultChecked className="w-4 h-4 text-flag-navy border-border" />
                  <span>Yes, I welcome a pastoral visit</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-sans-clean text-text-secondary cursor-pointer">
                  <input type="radio" name="houseVisit" value="No" className="w-4 h-4 text-flag-navy border-border" />
                  <span>No, phone/message only</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-sans-clean text-xs font-bold mb-2 text-text-primary">
                Can we contact you? <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-sm font-sans-clean text-text-secondary cursor-pointer">
                  <input type="radio" name="canContact" value="Yes" required defaultChecked className="w-4 h-4 text-flag-navy border-border" />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-sans-clean text-text-secondary cursor-pointer">
                  <input type="radio" name="canContact" value="No" className="w-4 h-4 text-flag-navy border-border" />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-text-primary pt-2">
              <input type="checkbox" name="communicationConsent" id="consent-check" className="mt-1 w-4 h-4 rounded" required />
              <label htmlFor="consent-check" className="font-sans-clean text-xs leading-relaxed text-text-secondary cursor-pointer">
                Yes, I give my consent to be contacted regarding prayers, church activities, and spiritual support (via SMS or WhatsApp).
              </label>
            </div>

            {/* Status Notifications */}
            {formStatus === "success" && (
              <div className="p-4 bg-green-500/10 border border-green-500/40 rounded-2xl text-center space-y-1 animate-fadeIn">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
                  <Check size={18} />
                  <span>Thank you! Your response has been submitted successfully. Our prayer team will be in touch with you.</span>
                </div>
              </div>
            )}

            {formStatus === "error" && (
              <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-2xl text-center space-y-1 animate-fadeIn">
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                  <AlertCircle size={18} />
                  <span>{errorMessage || "We couldn't submit your response. Please try again."}</span>
                </div>
              </div>
            )}

            <div className="text-center pt-3">
              <PillButton
                type="submit"
                disabled={formStatus === "submitting"}
                variant={
                  formStatus === "success"
                    ? "success"
                    : formStatus === "error"
                    ? "danger"
                    : "gold"
                }
                size="lg"
                className="w-full sm:w-auto font-sans-clean text-sm font-bold px-10 shadow-xl"
              >
                {formStatus === "submitting" && <Loader2 size={18} className="animate-spin mr-2" />}
                {formStatus === "submitting" && <span>Submitting...</span>}
                {formStatus === "success" && <span>Submitted Successfully ✓</span>}
                {formStatus === "error" && <span>Try Again</span>}
                {formStatus === "idle" && <span>Submit Prayer Request</span>}
              </PillButton>
            </div>
          </form>
        </section>


        {/* ===================================================================
            CHAPTER 4: FAITH GROWTH HUB (INTERACTIVE NEXT STEPS)
            =================================================================== */}
        <section data-reveal id="next-steps" className="space-y-12 scroll-mt-36">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
              CONTINUE THE JOURNEY
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-flag-navy dark:text-white tracking-tight">
              Next Steps
            </h2>
            <div className="w-16 h-0.5 bg-[#D9A31A] mx-auto rounded-full" />
            <p className="font-sans-clean text-sm sm:text-base text-text-secondary max-w-xl mx-auto">
              Your walk with God begins today. Explore these vital spiritual habits to deepen your relationship with Christ:
            </p>
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[400px] aspect-square rounded-[32px] overflow-hidden border border-border shadow-2xl group">
                <Image
                  src={getMediaUrl("/images/NextStepimage.avif")}
                  alt="Next Steps with Jesus"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-6 right-6 z-10 space-y-1">
                  <span className="text-xs uppercase font-sans-clean tracking-widest text-[#D9A31A] font-bold block">
                    DAILY WALK
                  </span>
                  <span className="font-editorial text-2xl text-white font-bold block">
                    Walking with Christ Daily
                  </span>
                  <p className="text-xs text-white/80 font-sans-clean">
                    Grow in grace, knowledge, and community every single day.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Category Tabs & Insights */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeGrowthTab === "bible"}
                  onClick={() => setActiveGrowthTab("bible")}
                  className={`perspective-tab-btn ${activeGrowthTab === "bible" ? "is-active" : ""}`}
                >
                  <BookOpen className="w-4 h-4 text-[#D9A31A]" />
                  <span>The Word of God</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeGrowthTab === "prayer"}
                  onClick={() => setActiveGrowthTab("prayer")}
                  className={`perspective-tab-btn ${activeGrowthTab === "prayer" ? "is-active" : ""}`}
                >
                  <Sun className="w-4 h-4 text-[#D9A31A]" />
                  <span>Daily Prayer</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeGrowthTab === "community"}
                  onClick={() => setActiveGrowthTab("community")}
                  className={`perspective-tab-btn ${activeGrowthTab === "community" ? "is-active" : ""}`}
                >
                  <Users className="w-4 h-4 text-[#D9A31A]" />
                  <span>Fellowship Groups</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeGrowthTab === "worship"}
                  onClick={() => setActiveGrowthTab("worship")}
                  className={`perspective-tab-btn ${activeGrowthTab === "worship" ? "is-active" : ""}`}
                >
                  <Clock className="w-4 h-4 text-[#D9A31A]" />
                  <span>Sunday Services</span>
                </button>
              </div>

              {/* Dynamic Content Pane */}
              <div className="p-6 sm:p-8 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-xl space-y-4">
                {activeGrowthTab === "bible" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-[#D9A31A]/10 text-[#D9A31A] flex items-center justify-center font-bold">
                        1
                      </span>
                      <div>
                        <h4 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
                          Immerse Yourself in God’s Word
                        </h4>
                        <span className="text-xs text-[#D9A31A] font-bold">Matthew 28:18-20</span>
                      </div>
                    </div>
                    <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-relaxed">
                      The Bible is God’s personal letter to you. We recommend starting with the <strong>Gospel of John</strong> in the New Testament to experience the miracles, teachings, and compassion of Jesus firsthand.
                    </p>
                    <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-border text-xs sm:text-sm text-text-primary">
                      💡 <strong>Practical Tip:</strong> Set aside 10 quiet minutes every morning to read one chapter and ask: <em>“Lord, what are You speaking to my heart today?”</em>
                    </div>
                  </div>
                )}

                {activeGrowthTab === "prayer" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-[#D9A31A]/10 text-[#D9A31A] flex items-center justify-center font-bold">
                        2
                      </span>
                      <div>
                        <h4 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
                          Spend Time in Daily Prayer
                        </h4>
                        <span className="text-xs text-[#D9A31A] font-bold">Philippians 4:6-7</span>
                      </div>
                    </div>
                    <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-relaxed">
                      Prayer is not a rigid formula; it is an open, honest conversation with a loving Father. Talk to God as you would with your closest friend about your gratitude, anxieties, dreams, and family.
                    </p>
                    <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-border text-xs sm:text-sm text-text-primary">
                      🕊️ <strong>The A.C.T.S. Method:</strong> Adoration (Praising God), Confession (Sharing weaknesses), Thanksgiving (Gratitude), and Supplication (Asking for your needs).
                    </div>
                  </div>
                )}

                {activeGrowthTab === "community" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-[#D9A31A]/10 text-[#D9A31A] flex items-center justify-center font-bold">
                        3
                      </span>
                      <div>
                        <h4 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
                          Stay Connected with Believers
                        </h4>
                        <span className="text-xs text-[#D9A31A] font-bold">Hebrews 10:24-25</span>
                      </div>
                    </div>
                    <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-relaxed">
                      Faith was never meant to be lived in isolation. Gathering with fellow believers provides encouragement, accountability, and lifelong friendships.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="bg-background border border-border p-3.5 rounded-2xl text-xs font-semibold text-text-primary text-center shadow-sm">
                        <Users className="w-4 h-4 mx-auto mb-1 text-[#D9A31A]" />
                        House Cell Groups
                      </div>
                      <div className="bg-background border border-border p-3.5 rounded-2xl text-xs font-semibold text-text-primary text-center shadow-sm">
                        <BookOpen className="w-4 h-4 mx-auto mb-1 text-[#D9A31A]" />
                        Bible Study Circles
                      </div>
                      <div className="bg-background border border-border p-3.5 rounded-2xl text-xs font-semibold text-text-primary text-center shadow-sm">
                        <Heart className="w-4 h-4 mx-auto mb-1 text-[#D9A31A]" />
                        Church Prayer Nights
                      </div>
                    </div>
                  </div>
                )}

                {activeGrowthTab === "worship" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-[#D9A31A]/10 text-[#D9A31A] flex items-center justify-center font-bold">
                        4
                      </span>
                      <div>
                        <h4 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
                          Sunday Worship Services
                        </h4>
                        <span className="text-xs text-[#D9A31A] font-bold">Gather With Us Weekly</span>
                      </div>
                    </div>
                    <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-relaxed">
                      Join our church family every Sunday to experience uplifting worship, powerful biblical preaching, and vibrant community:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
                      <div className="bg-background border border-border p-3 rounded-2xl">
                        <span className="text-sm font-bold text-[#D9A31A] block">6:00 AM</span>
                        <span className="text-xs text-text-secondary">First Service</span>
                      </div>
                      <div className="bg-background border border-border p-3 rounded-2xl">
                        <span className="text-sm font-bold text-[#D9A31A] block">8:30 AM</span>
                        <span className="text-xs text-text-secondary">Second Service</span>
                      </div>
                      <div className="bg-background border border-border p-3 rounded-2xl">
                        <span className="text-sm font-bold text-[#D9A31A] block">11:00 AM</span>
                        <span className="text-xs text-text-secondary">Third Service</span>
                      </div>
                      <div className="bg-background border border-border p-3 rounded-2xl">
                        <span className="text-sm font-bold text-[#D9A31A] block">6:30 PM</span>
                        <span className="text-xs text-text-secondary">Evening Service</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Inspiring Scripture Banner */}
              <div className="p-4 sm:p-5 bg-surface dark:bg-surface-elevated rounded-2xl border-l-4 border-[#D9A31A] space-y-1">
                <p className="font-editorial italic text-base sm:text-lg text-text-primary">
                  “For you were once darkness, but now you are light in the Lord. Live as children of light.”
                </p>
                <span className="font-sans-clean text-xs font-bold text-[#D9A31A] block">
                  — Ephesians 5:8
                </span>
              </div>

              <div className="pt-2 text-center">
                <p className="font-editorial italic text-xl sm:text-2xl font-bold text-[#D9A31A]">
                  We are thrilled and honored to walk this journey of faith with you!
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
