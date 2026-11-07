"use client";

import Image from 'next/image';
import React, { useRef, useState } from 'react';
import copyIcon from '../assets/copy.svg';
import flagQRCode from '../assets/flagQrcode.svg';
import PillButton from '../components/PillButton';
import { Landmark, QrCode, CreditCard, Tag, Banknote, Folder, KeyRound, Check, Copy, Heart, ShieldCheck, Sparkles, Globe } from 'lucide-react';

export default function DonateUs() {
  const [activeTab, setActiveTab] = useState('UPI');
  const [copiedText, setCopiedText] = useState(null);
  const qrcoderef = useRef(null);
  const neftref = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'UPI' && qrcoderef.current) {
      qrcoderef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === 'NEFT' && neftref.current) {
      neftref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const CopyButton = ({ textToCopy, label = "" }) => {
    const handleCopy = () => {
      navigator.clipboard.writeText(textToCopy);
      setCopiedText(textToCopy);
      setTimeout(() => setCopiedText(null), 2000);
    };

    const isCopied = copiedText === textToCopy;

    return (
      <PillButton
        onClick={handleCopy}
        type="button"
        variant={isCopied ? "gold" : "glass"}
        size="sm"
        className="!text-xs !py-1 !px-3 font-semibold transition-all duration-300"
        title="Copy to clipboard"
      >
        {isCopied ? (
          <>
            <Check size={13} className="text-[#121016] stroke-[2.5]" />
            <span className="text-[#121016] font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Copy size={13} className="shrink-0 transition-colors duration-200" />
            <span>{label || "Copy"}</span>
          </>
        )}
      </PillButton>
    );
  };

  const bankDetails = [
    { icon: Landmark, label: "Bank Name", value: "State Bank of India" },
    { icon: Banknote, label: "Branch", value: "Thiruverkadu" },
    { icon: CreditCard, label: "Account No", value: "32887890700" },
    { icon: Tag, label: "Account Name", value: "Full Life Assembly of God" },
    { icon: Folder, label: "Account Type", value: "Savings Account" },
    { icon: KeyRound, label: "IFSC Code", value: "SBIN0015492" },
  ];

  return (
    <section id="donate-us" data-reveal className="relative w-full py-16 md:py-24 bg-background text-text-primary transition-colors duration-500 overflow-hidden">
      {/* Background Ambient Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-gradient-to-tr from-[#D9A31A]/10 via-[#2C3A82]/10 to-transparent blur-3xl rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        
        {/* Editorial Section Header */}
        <div data-reveal className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-sans-clean text-xs font-bold tracking-[0.3em] uppercase text-[#D9A31A] block">
            GENEROSITY & STEWARDSHIP
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-flag-navy dark:text-white tracking-wide uppercase">
            Give With Purpose
          </h2>
          <div className="w-20 h-0.5 bg-[#D9A31A]/80 mx-auto rounded-full" />
          <p className="font-editorial italic text-xl sm:text-2xl text-text-secondary leading-relaxed">
            “God Loves a Cheerful Giver” <span className="font-sans-clean not-italic text-sm text-[#D9A31A] font-bold uppercase tracking-wider">(2 Corinthians 9:7)</span>
          </p>
        </div>

        {/* Emotional Visual Milestones: Give -> Support -> Serve -> Impact */}
        <div data-reveal-stagger className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border border-border text-center shadow-md hover:border-[#D9A31A]/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-[#D9A31A]/20 text-[#D9A31A] flex items-center justify-center mx-auto mb-2">
              <Heart size={20} />
            </div>
            <h4 className="font-editorial font-bold text-base text-flag-navy dark:text-white">Give</h4>
            <p className="font-sans-clean text-[11px] text-text-secondary">Generous Worship</p>
          </div>

          <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border border-border text-center shadow-md hover:border-[#D9A31A]/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-[#D9A31A]/20 text-[#D9A31A] flex items-center justify-center mx-auto mb-2">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-editorial font-bold text-base text-flag-navy dark:text-white">Support</h4>
            <p className="font-sans-clean text-[11px] text-text-secondary">Building God's House</p>
          </div>

          <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border border-border text-center shadow-md hover:border-[#D9A31A]/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-[#D9A31A]/20 text-[#D9A31A] flex items-center justify-center mx-auto mb-2">
              <Globe size={20} />
            </div>
            <h4 className="font-editorial font-bold text-base text-flag-navy dark:text-white">Serve</h4>
            <p className="font-sans-clean text-[11px] text-text-secondary">Outreach & Families</p>
          </div>

          <div className="p-4 bg-surface dark:bg-surface-elevated rounded-2xl border border-border text-center shadow-md hover:border-[#D9A31A]/50 transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-[#D9A31A]/20 text-[#D9A31A] flex items-center justify-center mx-auto mb-2">
              <Sparkles size={20} />
            </div>
            <h4 className="font-editorial font-bold text-base text-flag-navy dark:text-white">Impact</h4>
            <p className="font-sans-clean text-[11px] text-text-secondary">Eternal Transformation</p>
          </div>
        </div>

        {/* Main 2-Column Composition: Left Storytelling, Right Payment Card */}
        <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Story & Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-xl space-y-4">
              <span className="font-sans-clean text-xs font-bold tracking-[0.2em] uppercase text-[#D9A31A] block">
                WAYS TO OFFER
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-flag-navy dark:text-white leading-tight">
                Giving is an Art of Worship
              </h2>
              <p className="font-sans-clean text-sm sm:text-base text-text-secondary leading-[1.75]">
                Your contributions help maintain our church services, support community outreach programs, and ensure the Gospel continues to transform lives in Chennai and beyond.
              </p>
              <div className="p-4 bg-background rounded-2xl border-l-4 border-[#D9A31A] text-xs font-semibold text-text-primary">
                Every contribution, no matter the size, makes an eternal difference in God's kingdom.
              </div>
            </div>

            {/* Governance Policy Callout */}
            <div className="p-6 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-lg space-y-2">
              <span className="font-sans-clean text-xs font-bold tracking-wider uppercase text-text-secondary block">
                FINANCIAL GOVERNANCE
              </span>
              <p className="font-sans-clean text-xs text-text-secondary leading-relaxed">
                We apply good governance principles in our operations and are continually vigilant over our financial processes and accountability to governing authorities. A strict no-refund policy is in place to deter financial irregularities.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Donation Payment Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 bg-surface dark:bg-surface-elevated rounded-3xl border border-border shadow-2xl space-y-6">
              
              {/* Payment Method Selector Tabs with React Bits Pill Animation */}
              <div className="flex items-center justify-center gap-3 p-1.5 bg-background rounded-full border border-border">
                <PillButton
                  type="button"
                  onClick={() => handleTabClick('UPI')}
                  variant={activeTab === 'UPI' ? 'gold' : 'glass'}
                  size="md"
                  className="flex-1 font-sans-clean font-bold text-sm"
                >
                  <QrCode size={18} />
                  <span>UPI / GPay</span>
                </PillButton>

                <PillButton
                  type="button"
                  onClick={() => handleTabClick('NEFT')}
                  variant={activeTab === 'NEFT' ? 'gold' : 'glass'}
                  size="md"
                  className="flex-1 font-sans-clean font-bold text-sm"
                >
                  <Landmark size={18} />
                  <span>NEFT / RTGS</span>
                </PillButton>
              </div>

              {/* UPI Tab Content */}
              {activeTab === 'UPI' && (
                <div ref={qrcoderef} className="space-y-6 text-center animate-fadeIn">
                  
                  {/* Scan to Give QR Code Badge */}
                  <div className="relative inline-block p-4 bg-white rounded-3xl border-2 border-[#D9A31A] shadow-xl group">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D9A31A] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      Scan to Give
                    </div>
                    <Image
                      src={flagQRCode}
                      alt="UPI QR Code"
                      width={220}
                      height={220}
                      className="mx-auto transition-transform duration-500 group-hover:scale-105"
                    />
                    <p className="text-[11px] font-sans-clean text-gray-600 font-semibold mt-2">
                      Scan with GPay, PhonePe, Paytm, or any UPI app
                    </p>
                  </div>

                  {/* Payment Details Lists */}
                  <div className="space-y-3 max-w-md mx-auto text-left">
                    <div className="p-3.5 bg-background rounded-2xl border border-border flex items-center justify-between gap-3">
                      <div>
                        <span className="font-sans-clean text-[11px] font-bold uppercase text-text-secondary block">UPI ID</span>
                        <span className="font-sans-clean text-sm font-bold text-text-primary select-all">FULLLIFECENTRE-2@OKAXIS</span>
                      </div>
                      <CopyButton textToCopy="FULLLIFECENTRE-2@OKAXIS" label="Copy ID" />
                    </div>

                    <div className="p-3.5 bg-background rounded-2xl border border-border flex items-center justify-between gap-3">
                      <div>
                        <span className="font-sans-clean text-[11px] font-bold uppercase text-text-secondary block">GPay Number</span>
                        <span className="font-sans-clean text-sm font-bold text-text-primary select-all">9841677587</span>
                      </div>
                      <CopyButton textToCopy="9841677587" label="Copy Number" />
                    </div>
                  </div>
                </div>
              )}

              {/* NEFT / RTGS Bank Transfer Content */}
              {activeTab === 'NEFT' && (
                <div ref={neftref} className="space-y-5 animate-fadeIn">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                    <p className="font-sans-clean text-xs text-amber-700 dark:text-amber-300 font-medium">
                      *Only for Indian citizens residing in India or abroad. Direct bank transfer via NEFT, RTGS or IMPS.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {bankDetails.map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={idx} className="p-3.5 bg-background rounded-2xl border border-border space-y-1 flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-[#D9A31A]">
                              <IconComponent size={18} />
                              <span className="font-sans-clean text-[11px] font-bold uppercase text-text-secondary">{item.label}</span>
                            </div>
                            <CopyButton textToCopy={item.value} />
                          </div>
                          <p className="font-sans-clean text-sm font-bold text-text-primary select-all pt-1">
                            {item.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}