'use client';

import React from 'react';
import { getMediaUrl } from '@/lib/media';

const CHURCH_LOCATION_URL = "https://maps.google.com/?q=Full+Life+Centre+A.G+Church+Thiruverkadu";

export default function JoinUsSunday() {
  const mainServices = [
    { name: "Prep Prayer", time: "5:30 AM - 5:55 AM" },
    { name: "1st Service", time: "6:00 AM - 7:45 AM" },
    { name: "2nd Service", time: "8:30 AM - 10:15 AM" },
    { name: "3rd Service", time: "11:00 AM - 12:45 PM" },
    { name: "Evening Service", time: "6:30 PM - 7:30 PM" }
  ];

  const sundaySchool = [
    { name: "1st Service School", time: "6:00 AM - 7:45 AM" },
    { name: "2nd Service School", time: "8:30 AM - 10:15 AM" },
    { name: "3rd Service School", time: "11:00 AM - 12:45 PM" }
  ];

  return (
    <section id="timings" data-reveal className="w-full bg-background py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-text-primary dark:text-white tracking-wide uppercase">
            Join Us This Sunday
          </h2>
          <div className="w-[80px] h-[3px] bg-[#8a0303] mx-auto mt-3 rounded-full" />
          <p className="font-sans-clean text-xs sm:text-sm text-text-secondary mt-2">
            Click any service to view church location &amp; get directions
          </p>
        </div>

        {/* Two-Column Timings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Services Card */}
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-border shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 z-0"
              style={{ backgroundImage: `url(${getMediaUrl('/images/church_timing.avif')})` }}
            />
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/80 z-10" />

            {/* Card Content */}
            <div className="relative z-20 w-full">
              <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
                <svg className="w-6 h-6 text-[#D9A31A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold font-editorial text-white uppercase tracking-wide">
                  Church Service Timings
                </h3>
              </div>
              
              <div className="space-y-4">
                {mainServices.map((svc, idx) => (
                  <a 
                    key={idx} 
                    href={CHURCH_LOCATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Get Directions to Full Life Centre for ${svc.name}`}
                    className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#D9A31A]/50 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-xs sm:text-sm md:text-base text-white group-hover/item:text-[#D9A31A] transition-colors truncate">
                        {svc.name}
                      </span>
                    </div>
                    <span className="font-sans-clean text-[10px] sm:text-xs md:text-sm text-[#D9A31A] font-bold bg-[#D9A31A]/15 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#D9A31A]/20 group-hover/item:bg-[#D9A31A] group-hover/item:text-gray-900 transition-colors shrink-0">
                      {svc.time}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sunday School Card */}
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-border shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 z-0"
              style={{ backgroundImage: `url(${getMediaUrl('/images/children_services.avif')})` }}
            />
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/80 z-10" />

            {/* Card Content */}
            <div className="relative z-20 w-full">
              <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
                <svg className="w-6 h-6 text-[#D9A31A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-bold font-editorial text-white uppercase tracking-wide">
                  Children's Sunday School
                </h3>
              </div>
              
              <div className="space-y-4">
                {sundaySchool.map((school, idx) => (
                  <a 
                    key={idx} 
                    href={CHURCH_LOCATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Get Directions to Full Life Centre for ${school.name}`}
                    className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#D9A31A]/50 transition-all duration-300 transform hover:scale-[1.01] cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-xs sm:text-sm md:text-base text-white group-hover/item:text-[#D9A31A] transition-colors truncate">
                        {school.name}
                      </span>
                    </div>
                    <span className="font-sans-clean text-[10px] sm:text-xs md:text-sm text-[#D9A31A] font-bold bg-[#D9A31A]/15 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#D9A31A]/20 group-hover/item:bg-[#D9A31A] group-hover/item:text-gray-900 transition-colors shrink-0">
                      {school.time}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
