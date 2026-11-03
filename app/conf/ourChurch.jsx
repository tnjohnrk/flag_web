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
    title: 'The Humble Beginning (1998)',
    image: getMediaUrl('/images/church_timing.avif'),
    alt: 'First Sunday service held in a rented house with two people',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Gathering of Faith & Worship',
    image: getMediaUrl('/images/Somthingthatneeded.avif'),
    alt: 'From two people to thousands worshipping together',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    title: 'Children & Family Ministries',
    image: getMediaUrl('/images/children_services.avif'),
    alt: 'FLAG Children Ministries',
    icon: (
      <svg className="w-3.5 h-3.5 text-[#D9A31A]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
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
