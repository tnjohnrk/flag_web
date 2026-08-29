'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const currentYear = new Date().getFullYear();

  return (
    <div id="privacy-page" className="w-full bg-background text-text-primary transition-colors duration-500 overflow-hidden pt-36 pb-12 md:pt-44 md:pb-20 animate-page-entry">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
            DATA PROTECTION
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-flag-navy dark:text-white tracking-tight leading-[1.1]">
            Privacy Policy
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
              1. Introduction
            </h2>
            <p>
              Full Life Centre AG Church is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or submit connect forms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              2. Information We Collect
            </h2>
            <p>
              We collect information that you voluntarily provide to us when you fill out forms on our website, such as the "Connect With Us" form. This information may include:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>First name and Last name</li>
              <li>Mobile/Telephone number</li>
              <li>Email address</li>
              <li>City/Location</li>
              <li>Religious background (optional)</li>
              <li>Whether you are watching our services online</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              3. How We Use Your Information
            </h2>
            <p>
              The information we collect is used solely to support your spiritual journey and coordinate church ministries. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Follow up on your prayer requests or house visit requests.</li>
              <li>Send church notifications, spiritual encouragement, or event updates (only with your consent).</li>
              <li>Process online donations and send contribution statements.</li>
              <li>Improve our website content and online service experience.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              4. Sharing of Information
            </h2>
            <p>
              We do not sell, rent, trade, or share your personal information with third-party commercial organizations. Your data is kept strictly confidential within the Full Life Centre AG Church pastoral and administrative teams. We will only disclose information if required by law or to protect the safety of our church members.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              5. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, loss, misuse, or alteration. Online submissions and donations are processed over encrypted channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-flag-navy dark:text-white">
              6. Your Choices & Opt-Out
            </h2>
            <p>
              You have the right to request access to the information we hold about you, request corrections, or ask us to delete your personal records from our database at any time. If you no longer wish to receive communications or prayer follow-ups from us, please send an opt-out email to <a href="mailto:fulllifecentre@gmail.com" className="text-[#D9A31A] hover:underline">fulllifecentre@gmail.com</a>.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-border">
            <h2 className="font-editorial text-xl font-bold text-flag-navy dark:text-white">
              Contact Information
            </h2>
            <p className="text-xs sm:text-sm">
              If you have any questions or concerns regarding this Privacy Policy, please reach out to us:<br />
              <strong className="text-text-primary dark:text-white">Full Life Centre A.G. Church</strong><br />
              No.1, 1st Cross Street, Murugan Nagar, Thiruverkadu, Chennai - 600 077.<br />
              Email: <a href="mailto:fulllifecentre@gmail.com" className="text-[#D9A31A] hover:underline">fulllifecentre@gmail.com</a>
            </p>
          </section>

        </div>

        {/* Back to Home button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-flag-blue hover:bg-[#1f2d6b] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
