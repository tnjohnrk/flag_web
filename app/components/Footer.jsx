"use client";

import React from "react";
import Link from "next/link";
import "./Footer.css";
import { FaFacebook } from "@react-icons/all-files/fa/FaFacebook";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FaYoutube } from "@react-icons/all-files/fa/FaYoutube";
import { MapPin, Phone, Mail, Clock, Calendar, Navigation } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-reveal
      id="footer"
      className="relative w-full bg-flag-deep-navy text-[#F7F7F4] py-16 md:py-24 border-t border-white/10 transition-colors duration-500 overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-[#D9A31A]/10 via-[#2C3A82]/10 to-transparent blur-3xl rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Contact Header */}
        <div data-reveal className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
            GET IN TOUCH
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            We’d Love to Hear From You
          </h2>
          <div className="w-20 h-0.5 bg-[#D9A31A]/80 mx-auto rounded-full" />
          <p className="font-sans-clean text-base sm:text-lg text-[#F7F7F4]/80 leading-relaxed max-w-xl mx-auto">
            Come visit us for Sunday worship or reach out for prayer, counseling, and fellowship.
          </p>
        </div>

        {/* Main 3-Column Interactive Contact Grid */}
        <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Church Service Timings */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#D9A31A]">
                <Clock size={24} />
                <h3 className="font-editorial text-2xl font-bold text-white">Church Timings</h3>
              </div>

              <div className="space-y-3 font-sans-clean text-xs sm:text-sm text-[#F7F7F4]/90">
                <span className="font-bold text-[#D9A31A] uppercase tracking-wider block text-[11px]">
                  Sunday Worship Services
                </span>
                <div className="space-y-1.5 border-l-2 border-[#D9A31A]/60 pl-3">
                  <div className="flex justify-between"><span>Prep Prayer:</span><span className="font-semibold text-white">5:30 AM - 5:55 AM</span></div>
                  <div className="flex justify-between"><span>1st Service:</span><span className="font-semibold text-white">6:00 AM - 7:45 AM</span></div>
                  <div className="flex justify-between"><span>2nd Service:</span><span className="font-semibold text-white">8:30 AM - 10:15 AM</span></div>
                  <div className="flex justify-between"><span>3rd Service:</span><span className="font-semibold text-white">11:00 AM - 12:45 PM</span></div>
                  <div className="flex justify-between"><span>Evening Service:</span><span className="font-semibold text-white">6:30 PM - 7:30 PM</span></div>
                  <div className="flex justify-between"><span>Leaders Meeting:</span><span className="font-semibold text-white">7:30 PM - 8:30 PM</span></div>
                </div>

                <span className="font-bold text-[#D9A31A] uppercase tracking-wider block text-[11px] pt-3">
                  Children's Sunday School
                </span>
                <div className="space-y-1.5 border-l-2 border-[#D9A31A]/60 pl-3">
                  <div className="flex justify-between"><span>1st Service:</span><span className="font-semibold text-white">6:00 AM - 7:45 AM</span></div>
                  <div className="flex justify-between"><span>2nd Service:</span><span className="font-semibold text-white">8:30 AM - 10:15 AM</span></div>
                  <div className="flex justify-between"><span>3rd Service:</span><span className="font-semibold text-white">11:00 AM - 12:45 PM</span></div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-6">
              <a
                href="https://www.facebook.com/FullLifeCentre"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7F7F4]/80 hover:text-[#1877F2] transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={32} />
              </a>
              <a
                href="https://www.instagram.com/flag_chennai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7F7F4]/80 hover:text-[#E4405F] transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={32} />
              </a>
              <a
                href="https://www.youtube.com/c/FullLifeAGChurch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7F7F4]/80 hover:text-[#FF0000] transition-all duration-300 transform hover:scale-110"
                aria-label="YouTube"
              >
                <FaYoutube size={32} />
              </a>
            </div>
          </div>

          {/* Card 2: Interactive Location Map */}
          <div className="lg:col-span-4 min-h-[320px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.1564788732467!2d80.11847071187096!3d13.07830042977078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526160197a69bd%3A0xb12ec237458879ba!2sFull%20Life%20Centre%20A.%20G.%20Church!5e0!3m2!1sen!2sin!4v1642231341199!5m2!1sen!2sin"
              title="Full Life Church Location"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="w-full h-full min-h-[350px] object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
          </div>

          {/* Card 3: Church Address & Prayer Needs */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Church Address */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#D9A31A]">
                  <MapPin size={24} />
                  <h3 className="font-editorial text-2xl font-bold text-white">Come Visit Us</h3>
                </div>
                <p className="font-sans-clean text-xs sm:text-sm text-[#F7F7F4]/90 leading-relaxed pl-1">
                  <strong className="text-white font-semibold block text-sm">Full Life Centre A.G. Church</strong>
                  No.1, 1st Cross Street,<br />
                  Murugan Nagar, Thiruverkadu,<br />
                  Chennai - 600 077.
                </p>

                <a
                  href="https://maps.google.com/?q=Full+Life+Centre+A.G+Church+Thiruverkadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D9A31A] text-gray-900 font-sans-clean font-bold text-xs hover:bg-amber-400 transition-all duration-300 shadow-md mt-2"
                >
                  <Navigation size={14} />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Prayer Needs & Contact */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="font-editorial text-xl font-bold text-[#D9A31A]">
                  For Prayer Needs & Counseling
                </h4>
                <div className="space-y-2 font-sans-clean text-xs sm:text-sm">
                  <a
                    href="tel:+919841677587"
                    className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/10 hover:border-[#D9A31A] text-white transition-all duration-300"
                  >
                    <Phone size={18} className="text-[#D9A31A]" />
                    <span>+91 9841677587</span>
                  </a>

                  <a
                    href="mailto:fulllifecentre@gmail.com"
                    className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/10 hover:border-[#D9A31A] text-white transition-all duration-300"
                  >
                    <Mail size={18} className="text-[#D9A31A]" />
                    <span>fulllifecentre@gmail.com</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Copyright Statement */}
            <div className="pt-4 text-center border-t border-white/10 space-y-1.5">
              <p className="font-sans-clean text-[11px] text-[#F7F7F4]/60">
                Copyright © {currentYear} Full Life Centre AG Church. All Rights Reserved.
              </p>
              <p className="font-sans-clean text-[11px] text-[#F7F7F4]/60 flex items-center justify-center gap-3">
                <Link href="/terms" className="hover:text-[#D9A31A] transition-colors duration-200">
                  Terms & Conditions
                </Link>
                <span className="opacity-40">|</span>
                <Link href="/privacy" className="hover:text-[#D9A31A] transition-colors duration-200">
                  Privacy Policy
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}
