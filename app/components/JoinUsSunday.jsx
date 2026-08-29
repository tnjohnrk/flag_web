'use client';

import React from 'react';

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
          <h2 className="text-3xl font-bold font-editorial text-text-primary dark:text-white tracking-wide uppercase">
            Join Us This Sunday
          </h2>
          <div className="w-[80px] h-[3px] bg-[#8a0303] mx-auto mt-3 rounded-full" />
        </div>

        {/* Two-Column Timings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Services Card */}
          <div className="bg-surface dark:bg-surface-elevated border border-border p-6 sm:p-8 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <svg className="w-6 h-6 text-flag-orange dark:text-flag-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold font-editorial text-text-primary dark:text-white uppercase tracking-wide">
                Church Service Timings
              </h3>
            </div>
            
            <div className="space-y-4">
              {mainServices.map((svc, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-2xl bg-background/50 hover:bg-background transition-colors duration-200"
                >
                  <span className="font-semibold text-sm sm:text-base text-text-primary dark:text-white">
                    {svc.name}
                  </span>
                  <span className="font-sans-clean text-xs sm:text-sm text-flag-blue dark:text-flag-yellow font-bold bg-flag-blue/5 dark:bg-flag-yellow/10 px-3 py-1 rounded-full border border-flag-blue/10 dark:border-flag-yellow/20">
                    {svc.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sunday School Card */}
          <div className="bg-surface dark:bg-surface-elevated border border-border p-6 sm:p-8 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
              <svg className="w-6 h-6 text-flag-orange dark:text-flag-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xl font-bold font-editorial text-text-primary dark:text-white uppercase tracking-wide">
                Children's Sunday School
              </h3>
            </div>
            
            <div className="space-y-4">
              {sundaySchool.map((school, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-2xl bg-background/50 hover:bg-background transition-colors duration-200"
                >
                  <span className="font-semibold text-sm sm:text-base text-text-primary dark:text-white">
                    {school.name}
                  </span>
                  <span className="font-sans-clean text-xs sm:text-sm text-flag-blue dark:text-flag-yellow font-bold bg-flag-blue/5 dark:bg-flag-yellow/10 px-3 py-1 rounded-full border border-flag-blue/10 dark:border-flag-yellow/20">
                    {school.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
