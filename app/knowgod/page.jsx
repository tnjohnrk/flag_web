
"use client";
import React, { useRef, useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/media';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import PillButton from '../components/PillButton';

export default function KnowGod() {
  const [formStatus, setFormStatus] = useState("idle"); // "idle" | "submitting" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const [showMap, setShowMap] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

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

      // Load default location (Chennai) first
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

    const rawMobile = formData.get("mobile") || "";
    const formattedMobile = rawMobile.startsWith("+") ? rawMobile : `+91 ${rawMobile}`;

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      mobile: formattedMobile,
      email: formData.get("email"),
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
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    const targets = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <div id="know-god" className="w-full bg-background text-text-primary transition-colors duration-500 overflow-hidden pt-24 pb-12 md:pt-36 md:pb-20 animate-page-entry">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32">

        {/* ===================================================================
            CHAPTER 1: OPENING — CREATION & WHO IS JESUS?
            =================================================================== */}
        <section data-reveal id="creation-who-is-jesus" className="relative text-center pt-8">
          {/* Subtle Ambient Radiant Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-gradient-to-tr from-[#D9A31A]/10 via-[#2C3A82]/10 to-transparent blur-3xl rounded-full pointer-events-none z-0" />

          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
              THE JOURNEY BEGINS
            </span>
            <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-bold text-flag-navy dark:text-white tracking-tight leading-[1.1]">
              Know God
            </h1>
            <div className="w-20 h-0.5 bg-[#D9A31A]/80 mx-auto rounded-full" />
            <p className="font-editorial italic text-lg sm:text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto pt-2">
              A journey of grace, truth, and eternal life. Discover the love of God through Jesus Christ.
            </p>
          </div>

          {/* Core Introduction Block */}
          <div data-reveal-stagger className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
            <div className="lg:col-span-6 space-y-6">
              <div className="relative overflow-hidden rounded-[28px] border border-border shadow-2xl group">
                <Image
                  src={getMediaUrl("/images/WhoIsJesus.avif")}
                  alt="Who Is Jesus?"
                  width={600}
                  height={450}
                  priority
                  className="object-cover w-full h-auto max-h-[420px] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-6 z-10">
                  <span className="font-editorial text-xl text-white font-semibold drop-shadow-md">
                    Who Is Jesus?
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-xl space-y-4">
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-flag-navy dark:text-white leading-tight">
                  <span className="text-[#D9A31A]">Jesus</span> is More Than a Teacher
                </h2>
                <p className="font-sans-clean text-base sm:text-lg text-text-primary font-medium leading-[1.75]">
                  <span className="text-[#D9A31A] font-bold">Jesus</span> is more than just a historical figure or a great teacher—He is the Son of God, the Savior of the world, and the source of true life.
                </p>
                <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-[1.75]">
                  Throughout history, people have debated who Jesus is. Some saw Him as a wise man, a prophet, or a great moral leader. Others dismissed Him as a madman. But even His enemies understood that He was claiming to be more than just a man—that’s why they sought to crucify Him.
                </p>
                <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-[1.75]">
                  The world’s calendar is centered around His life, marking B.C. (Before Christ) and A.D. (Anno Domini, "In the Year of Our Lord"). His influence is undeniable, but He is more than just a man of history—He is the Son of God.
                </p>
              </div>
            </div>
          </div>

          {/* Subsections: Power of Jesus & Free Gift */}
          <div data-reveal-stagger className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="p-6 sm:p-8 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-lg space-y-3">
              <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                MIRACLES & REDEMPTION
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-flag-navy dark:text-white">
                The Power of Jesus
              </h3>
              <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-[1.75]">
                Jesus’ time on earth was filled with miracles—healing the sick, raising the dead, calming storms, and feeding thousands. But His greatest miracles were His own birth and resurrection. These moments changed history and continue to transform lives today.
              </p>
              <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-[1.75]">
                His ultimate mission wasn’t just performing miracles—it was to save humanity. Through His death on the cross and His resurrection, He defeated sin and death, offering us forgiveness and eternal life. His blood shed on the cross is the only hope for salvation.
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-lg space-y-3">
              <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                UNCONDITIONAL LOVE
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-flag-navy dark:text-white">
                A Free Gift for All
              </h3>
              <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-[1.75]">
                We don’t have to earn God’s love—Jesus offers salvation as a free gift to anyone who believes. He invites us to come to Him as we are, with our burdens and struggles, and receive the peace, love, and forgiveness that only He can give.
              </p>
              <div className="pt-3 border-t border-border mt-4">
                <p className="font-editorial italic text-base text-text-primary">
                  “Many teachers have pointed the way, but Jesus said, ‘I AM the Way.’ Others have spoken of truth, but Jesus declared, ‘I AM the Truth.’ Others sought the meaning of life, but Jesus boldly claimed, ‘I AM the Life.’”
                </p>
                <span className="font-sans-clean text-xs font-bold text-[#D9A31A] block mt-2">
                  — C.S. Lewis
                </span>
              </div>
            </div>
          </div>

          <div data-reveal className="mt-10 text-center">
            <p className="font-editorial text-2xl sm:text-3xl font-bold text-flag-navy dark:text-white italic">
              Are you ready to know Him?
            </p>
          </div>
        </section>


        {/* ===================================================================
            CHAPTER 3: RECEIVING JESUS & PRAYER OF SALVATION
            =================================================================== */}
        <section data-reveal id="how-do-i-receive-jesus" className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
              A NEW BEGINNING
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-flag-navy dark:text-white tracking-tight">
              How Do I Receive Jesus?
            </h2>
            <div className="w-16 h-0.5 bg-[#D9A31A]/80 mx-auto rounded-full" />
            <p className="font-sans-clean text-base sm:text-lg text-text-primary font-medium max-w-xl mx-auto">
              Jesus offers forgiveness, hope, and a new beginning. Here’s how you can invite Him into your life:
            </p>
          </div>

          {/* 5 Step Journey Steps */}
          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-5 bg-surface dark:bg-surface-elevated rounded-2xl border border-border shadow-md space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#D9A31A] text-white font-bold flex items-center justify-center mx-auto text-sm">1</span>
              <h4 className="font-editorial font-bold text-lg text-flag-navy dark:text-white">Admit You Need a Savior</h4>
              <p className="font-sans-clean text-xs text-text-secondary leading-relaxed">We have all sinned and need God's forgiveness</p>
            </div>

            <div className="p-5 bg-surface dark:bg-surface-elevated rounded-2xl border border-border shadow-md space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#D9A31A] text-white font-bold flex items-center justify-center mx-auto text-sm">2</span>
              <h4 className="font-editorial font-bold text-lg text-flag-navy dark:text-white">Turn from Your Sins</h4>
              <p className="font-sans-clean text-xs text-text-secondary leading-relaxed">Choose to follow Jesus and leave behind a life of sin.</p>
            </div>

            <div className="p-5 bg-surface dark:bg-surface-elevated rounded-2xl border border-border shadow-md space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#D9A31A] text-white font-bold flex items-center justify-center mx-auto text-sm">3</span>
              <h4 className="font-editorial font-bold text-lg text-flag-navy dark:text-white">Believe in Jesus</h4>
              <p className="font-sans-clean text-xs text-text-secondary leading-relaxed">Jesus died for your sins and rose again. Have eternal life.</p>
            </div>

            <div className="p-5 bg-surface dark:bg-surface-elevated rounded-2xl border border-border shadow-md space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#D9A31A] text-white font-bold flex items-center justify-center mx-auto text-sm">4</span>
              <h4 className="font-editorial font-bold text-lg text-flag-navy dark:text-white">Invite Jesus into Your Life</h4>
              <p className="font-sans-clean text-xs text-text-secondary leading-relaxed">Surrender to Him and let Him guide you</p>
            </div>

            <div className="p-5 bg-surface dark:bg-surface-elevated rounded-2xl border border-border shadow-md space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-[#D9A31A] text-white font-bold flex items-center justify-center mx-auto text-sm">5</span>
              <h4 className="font-editorial font-bold text-lg text-flag-navy dark:text-white">Pray and Receive Jesus</h4>
              <p className="font-sans-clean text-xs text-text-secondary leading-relaxed">If you’re ready, pray this simple prayer:</p>
            </div>
          </div>

          {/* PRAYER OF SALVATION MOMENT */}
          <div data-reveal className="relative p-8 sm:p-12 bg-gradient-to-b from-surface via-surface-elevated to-surface dark:from-surface-elevated dark:via-surface dark:to-surface-elevated rounded-3xl border-2 border-[#D9A31A]/60 shadow-2xl text-center max-w-2xl mx-auto space-y-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D9A31A] text-white font-sans-clean text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
              Prayer of Salvation
            </div>
            
            <blockquote className="font-editorial italic text-xl sm:text-2xl text-text-primary leading-relaxed pt-2">
              “Father, I believe Jesus died for my sins and rose again. I confess I need Your forgiveness. I invite You into my life. I want to follow You as my Lord and Savior. In Jesus’ name, Amen.”
            </blockquote>

            <div className="pt-4 border-t border-border">
              <h3 className="font-editorial text-3xl font-bold text-[#D9A31A]">
                Welcome to God’s Family!
              </h3>
              <p className="font-sans-clean text-sm sm:text-base text-text-secondary mt-2 leading-relaxed">
                If you prayed this prayer, you have started a new journey with Jesus! We’d love to connect with you—fill out the form below so we can support you.
              </p>
            </div>
          </div>

          {/* Connect With Us Form */}
          <form id="contact-form" onSubmit={handleFormSubmit} data-reveal className="max-w-2xl mx-auto p-6 sm:p-8 bg-surface dark:bg-surface-elevated shadow-xl rounded-3xl border border-border space-y-4">
            <h3 className="font-editorial text-3xl font-bold text-center mb-6 text-[#D9A31A]">
              Connect With Us
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">First Name <span className="text-red-500">*</span></label>
                <input type="text" name="firstName" className="w-full border border-border bg-background text-text-primary rounded-xl p-2.5 text-sm" required />
              </div>
              <div>
                <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">Last Name <span className="text-red-500">*</span></label>
                <input type="text" name="lastName" className="w-full border border-border bg-background text-text-primary rounded-xl p-2.5 text-sm" required />
              </div>
            </div>

            <div>
              <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-2.5 border border-border rounded-xl bg-background text-text-secondary text-sm font-semibold">+91</span>
                <input type="tel" name="mobile" className="w-full border border-border bg-background text-text-primary rounded-xl p-2.5 text-sm" required />
              </div>
            </div>

            <div>
              <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">Email Address <span className="text-red-500">*</span></label>
              <input type="email" name="email" className="w-full border border-border bg-background text-text-primary rounded-xl p-2.5 text-sm" required />
            </div>

            <div>
              <label className="block font-sans-clean text-xs font-bold mb-1 text-text-primary">
                Address of your residency <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                className="w-full border border-border bg-background text-text-primary rounded-xl p-2.5 text-sm h-20"
                placeholder="Type your address manually or select on the map below..."
                required
              />
              
              <div className="mt-2">
                <PillButton
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  variant="gold-dark"
                  size="sm"
                  className="text-xs font-bold"
                >
                  <span>🗺️</span>
                  <span>{showMap ? "Hide Map" : "Select on Map"}</span>
                </PillButton>
              </div>

              {/* Collapsible Leaflet Map Area */}
              {showMap && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-border shadow-inner relative animate-fadeIn space-y-2 bg-background p-3">
                  {/* Search Bar */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search address/location on map..."
                      value={mapSearchQuery}
                      onChange={(e) => setMapSearchQuery(e.target.value)}
                      className="flex-1 border border-border bg-surface text-text-primary rounded-xl px-3 py-1.5 text-xs focus:outline-none"
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
                  
                  {/* Map Footer Info and Done Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border">
                    <div className="text-text-secondary text-[10px] sm:text-xs max-w-[50%]">
                      The map will auto-detect your location with high-accuracy GPS. Search above or drag the pin.
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <PillButton
                        type="button"
                        onClick={handleTriggerGPS}
                        variant="gold-dark"
                        size="sm"
                        className="!text-xs font-bold"
                      >
                        <span>📍 Current Location</span>
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
                <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  <span>✓ Location marked:</span>
                  <a href={mapLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-700 dark:hover:text-green-300">
                    View marked position
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
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-sans-clean text-text-secondary cursor-pointer">
                  <input type="radio" name="houseVisit" value="No" className="w-4 h-4 text-flag-navy border-border" />
                  <span>No</span>
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
              <input type="checkbox" name="communicationConsent" className="mt-1" required />
              <label className="font-sans-clean text-xs leading-relaxed text-text-secondary">
                Yes, I give my consent to call me on my phone and add me to your Communication Channels (SMS, WhatsApp).
              </label>
            </div>

            {/* Real-Time Status Indicators */}
            {formStatus === "success" && (
              <div className="p-4 bg-green-500/10 border border-green-500/40 rounded-2xl text-center space-y-1 animate-fadeIn">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
                  <Check size={18} />
                  <span>Thank you! Your response has been submitted successfully.</span>
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

            <div className="text-center pt-4">
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
                className="w-full sm:w-auto font-sans-clean text-sm font-bold px-10 shadow-lg"
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
            CHAPTER 4: NEXT STEP — CONTINUE THE JOURNEY
            =================================================================== */}
        <section data-reveal id="next-steps" className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
              CONTINUE THE JOURNEY
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-flag-navy dark:text-white tracking-tight">
              Next Step
            </h2>
            <div className="w-16 h-0.5 bg-[#D9A31A]/80 mx-auto rounded-full" />
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-square rounded-3xl overflow-hidden border border-border shadow-2xl group">
                <Image
                  src={getMediaUrl("/images/NextStepimage.avif")}
                  alt="Next Steps with Jesus"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-6 z-10">
                  <span className="font-editorial text-lg text-white font-semibold">
                    Walking with Christ Daily
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-editorial text-3xl font-bold text-flag-navy dark:text-white">
                Your Next Steps with Jesus:
              </h3>
              <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-[1.75]">
                The moment you made Jesus your personal Lord and Savior, you took your first step toward the life God intended for you. The Bible says:
              </p>
              
              <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border-l-4 border-[#D9A31A]">
                <p className="font-editorial italic text-base sm:text-lg text-text-primary">
                  "For you were once darkness, but now you are light in the Lord. Live as children of light."
                </p>
                <span className="font-sans-clean text-xs font-bold text-[#D9A31A] block mt-1">
                  (Ephesians 5:8)
                </span>
              </div>

              <h4 className="font-editorial text-xl font-bold text-flag-navy dark:text-white pt-2">
                Follow these steps to grow in your faith:
              </h4>

              <div className="space-y-4 font-sans-clean text-sm sm:text-base text-text-secondary">
                <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border border-border space-y-1">
                  <span className="font-bold text-text-primary block">1. Obey Jesus’ Teachings:</span>
                  <p className="leading-relaxed">
                    Jesus commanded His followers to make disciples, baptize them, and teach them to obey His word. <strong className="font-sans-clean text-[#D9A31A]">(Matthew 28:18-20)</strong>
                  </p>
                </div>

                <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border border-border space-y-1">
                  <span className="font-bold text-text-primary block">2. Spend Time with God Daily:</span>
                  <p className="leading-relaxed">Build a personal relationship with Jesus through prayer and reading His Word.</p>
                </div>

                <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border border-border space-y-3">
                  <span className="font-bold text-text-primary block">3. Stay Connected with Fellow Believers:</span>
                  <p className="leading-relaxed">Join a group where you can grow spiritually and encourage others:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-background border border-border p-3 rounded-xl text-xs font-semibold text-text-primary text-center shadow-sm">🙏 Church Prayer Gatherings</div>
                    <div className="bg-background border border-border p-3 rounded-xl text-xs font-semibold text-text-primary text-center shadow-sm">🏠 House Cell Groups</div>
                    <div className="bg-background border border-border p-3 rounded-xl text-xs font-semibold text-text-primary text-center shadow-sm">📖 Bible Studies</div>
                  </div>
                </div>

                <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border border-border space-y-3">
                  <span className="font-bold text-text-primary block">4. Worship with Us Every Sunday:</span>
                  <p className="leading-relaxed">Gather with us to worship and grow in faith:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
                    <div className="bg-background border border-border p-3 rounded-xl text-xs font-bold text-[#D9A31A]">⏰ 6 AM<br/><span className="text-text-secondary font-normal">First Service</span></div>
                    <div className="bg-background border border-border p-3 rounded-xl text-xs font-bold text-[#D9A31A]">⏰ 8:30 AM<br/><span className="text-text-secondary font-normal">Second Service</span></div>
                    <div className="bg-background border border-border p-3 rounded-xl text-xs font-bold text-[#D9A31A]">⏰ 11 AM<br/><span className="text-text-secondary font-normal">Third Service</span></div>
                    <div className="bg-background border border-border p-3 rounded-xl text-xs font-bold text-[#D9A31A]">⏰ 6:30 PM<br/><span className="text-text-secondary font-normal">Evening Service</span></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="font-editorial italic text-2xl font-bold text-[#D9A31A]">
                  We are excited to walk this journey with you!
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
