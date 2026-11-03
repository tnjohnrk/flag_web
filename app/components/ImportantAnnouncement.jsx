'use client';

import PillButton from './PillButton';
import { getMediaUrl } from '@/lib/media';

export default function ImportantAnnouncement() {
  const announcements = [
    {
      title: "NEED PRAYER?",
      description: "Our prayer team is available to support you. Click to call our prayer line directly.",
      image: getMediaUrl("/images/prayerimage.avif"),
      icon: (
        <svg className="w-8 h-8 text-[#D9A31A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      actionText: "Call Now",
      href: "tel:9841677587",
      isPhone: true
    },
    {
      title: "NEED HOUSE VISIT?",
      description: "Request a pastoral house visit. Fill out our connect form and we will reach out to schedule.",
      image: getMediaUrl("/images/needhousevisit.avif"),
      icon: (
        <svg className="w-8 h-8 text-[#D9A31A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      actionText: "Request Visit",
      href: "/knowgod#contact-form",
      isPhone: false
    },
    {
      title: "CHURCH MARRIAGE BUREAU",
      description: "Matrimonial services and guidance for church members. Click to call our office.",
      image: getMediaUrl("/images/marriage.avif"),
      icon: (
        <svg className="w-8 h-8 text-[#D9A31A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      actionText: "Call Bureau",
      href: "tel:7904480259",
      isPhone: true
    }
  ];

  return (
    <section id="announcements" data-reveal className="w-full bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-text-primary dark:text-white tracking-wide">
            IMPORTANT ANNOUNCEMENTS
          </h2>
          <div className="w-[80px] h-[3px] bg-[#8a0303] mx-auto mt-3 rounded-full" />
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((ann, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center p-6 rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-[340px] group"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 z-0"
                style={{ backgroundImage: `url(${ann.image})` }}
              />
              
              {/* Dark Overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/75 z-10 transition-colors duration-300 group-hover:bg-black/65" />

              {/* Card Contents */}
              <div className="relative z-20 flex flex-col items-center h-full w-full">
                {/* Icon Container */}
                <div className="mb-4 p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                  {ann.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold font-sans-clean text-white mb-2 tracking-wide uppercase">
                  {ann.title}
                </h3>

                {/* Description */}
                <p className="text-sm font-sans-clean text-gray-200 mb-6 leading-relaxed max-w-[280px]">
                  {ann.description}
                </p>

                {/* Pill Action Button */}
                <PillButton
                  href={ann.href}
                  variant="gold"
                  size="sm"
                  className="mt-auto shadow-md"
                >
                  {ann.isPhone ? (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C9.716 18 2 10.284 2 2V3z"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  )}
                  <span>{ann.actionText}</span>
                </PillButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
