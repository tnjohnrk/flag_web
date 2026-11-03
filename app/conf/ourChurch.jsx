import React from 'react';
import { getMediaUrl } from '@/lib/media';

export const churchHistoryItems = [
  {
    title: 'Rev. N. Johnson & Family',
    image: getMediaUrl('/images/familyPic.avif'),
    alt: 'Rev. N. Johnson & Family — Pioneering FLAG Ministry',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
      </svg>
    )
  },
  {
    title: 'Early Prayer Fellowship (1998)',
    image: getMediaUrl('/images/history/church_early_prayer_1998.jpg'),
    alt: 'Pioneering days of faith and open-air prayer fellowship',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Early Church Congregation',
    image: getMediaUrl('/images/history/church_early_congregation.jpg'),
    alt: 'First generation believers gathered in worship',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    title: 'First Hall Construction (2003)',
    image: getMediaUrl('/images/history/church_first_hall_construction_2003.jpg'),
    alt: 'Building the first church hall provided by God',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: 'Faith Through Trials (2005)',
    image: getMediaUrl('/images/history/church_demolition_trials_2005.jpg'),
    alt: 'Demolition during government project where faith held firm',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    title: 'God Opens Another Door (2005)',
    image: getMediaUrl('/images/history/church_god_opens_doors_2005.jpg'),
    alt: 'God opening new doors leading to the dedicated church sanctuary',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
      </svg>
    )
  }
];

export const ourChurchDetails = [ 
  <>In <strong>October 1998</strong>, Rev. D. Mohan, Chief Pastor of New Life A.G. Church and General Superintendent of the All India Assemblies of God, sent <strong>Pr. N. Johnson</strong> to pioneer a church in <strong>Thiruverkadu</strong>—a rapidly growing pilgrimage town where churches were few and the spiritual need was great.</>,
  <>The journey began humbly. On <strong>November 7, 1998</strong>, the first Sunday service was held in a rented house with just <strong>two people</strong>. Opposition was strong, but faith remained stronger. In the midst of threats, closed doors, and many challenges, God began to build His church.</>,
  <>Within two years, the congregation had grown to around <strong>120 people</strong>. In <strong>2003</strong>, God provided land for a new church hall, and the congregation continued to multiply. Even when the building was demolished in <strong>2005</strong> due to a government project, God opened another door. New land was purchased, and on <strong>May 8, 2008</strong>, the present church building was dedicated.</>,
  <>What began with <strong>two people in a small rented house</strong> has, by God's grace, grown into a vibrant family of around <strong>1,400 active members</strong>, with <strong>16 branch churches, 2 house churches, and 7 missionaries</strong> supported every month.</>,
  <>Through every challenge, one truth has remained constant:</>,
  <>God is faithful.</>
];

export default ourChurchDetails;
