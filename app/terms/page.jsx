'use client';

import React from 'react';
import Link from 'next/link';
import PillButton from '../components/PillButton';

export default function TermsAndConditions() {
  const currentYear = new Date().getFullYear();

  return (
    <div id="terms-page" className="w-full bg-background text-text-primary transition-colors duration-500 overflow-hidden pt-36 pb-12 md:pt-44 md:pb-20 animate-page-entry">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
            LEGAL NOTICE
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-flag-navy dark:text-white tracking-tight leading-[1.1]">
            Terms & Conditions
          </h1>
          <div className="w-20 h-0.5 bg-[#D9A31A]/80 mx-auto rounded-full" />
          <p className="font-sans-clean text-xs sm:text-sm text-text-secondary">
            Last Updated: August 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="prose dark:prose-invert max-w-none font-sans-clean text-sm sm:text-base text-text-secondary leading-relaxed space-y-8 bg-surface dark:bg-surface-elevated p-8 sm:p-12 rounded-[28px] border border-border shadow-xl">
          
          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              Welcome to the website of Full Life Centre AG Church. By accessing and using this website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please refrain from using our site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              2. Use of Site & Services
            </h2>
            <p>
              This website is provided to share information about our church services, sermons, events, and ministries. You agree to use the site only for lawful purposes and in a manner that does not infringe on the rights of others, restrict their use, or compromise the security of the website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              3. Intellectual Property Rights
            </h2>
            <p>
              All content on this website—including sermons, text, audio recordings, music videos, graphics, logos, images, and software—is the property of Full Life Centre AG Church or its content providers and is protected by copyright and intellectual property laws. You may watch, download, or share our public sermons and media for personal, non-commercial use only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              4. Donation & Contribution Policy
            </h2>
            <p>
              All financial donations, tithes, and offerings made through our online payment links or donation portals are voluntary. Donations are processed securely through authorized third-party payment gateways. Please ensure your payment details are entered correctly. Contributions are non-refundable once processed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              5. Communications Consent
            </h2>
            <p>
              When you submit a contact or prayer request form (such as the "Connect With Us" form), you agree that our pastoral care or administrative team may contact you via the provided mobile number or email address to offer prayer support, follow up on visits, or send event updates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              6. Limitation of Liability
            </h2>
            <p>
              Full Life Centre AG Church makes reasonable efforts to ensure that the information on this website is accurate and up to date. However, we provide the site "as is" and do not warrant that the website will be uninterrupted or error-free. We shall not be held liable for any damages arising out of the use of or inability to use this site.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-border">
            <h2 className="font-editorial text-xl font-bold text-flag-navy dark:text-white">
              Contact Information
            </h2>
            <p className="text-xs sm:text-sm">
              If you have any questions regarding these Terms & Conditions, please contact us at:<br />
              <strong className="text-text-primary dark:text-white">Full Life Centre A.G. Church</strong><br />
              No.1, 1st Cross Street, Murugan Nagar, Thiruverkadu, Chennai - 600 077.<br />
              Email: <a href="mailto:fulllifecentre@gmail.com" className="text-[#D9A31A] hover:underline">fulllifecentre@gmail.com</a>
            </p>
          </section>

        </div>

        {/* Back to Home button */}
        <div className="text-center">
          <PillButton
            href="/"
            variant="navy"
            size="lg"
            className="px-8"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </PillButton>
        </div>

      </div>
    </div>
  );
}
