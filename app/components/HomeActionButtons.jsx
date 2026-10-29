'use client';

import PillButton from './PillButton';

export default function HomeActionButtons() {
  return (
    <div 
      data-reveal 
      className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-10 px-4 w-full bg-background"
    >
      {/* WhatsApp Button with React Bits Pill Animation */}
      <PillButton
        href="https://chat.whatsapp.com/Dsx6EPwgrmf3gtCymiY4dI?s=sw&p=a&mlu=4"
        target="_blank"
        rel="noopener noreferrer"
        variant="whatsapp"
        size="lg"
        className="w-full sm:w-auto tracking-wide text-base shadow-md hover:shadow-xl"
      >
        <svg 
          className="w-6 h-6 fill-current" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.945 11.472.945 6.037.945 1.614 5.315 1.61 10.744c-.001 1.706.452 3.373 1.312 4.868l-.963 3.517 3.61-.945 1.678.966zM17.486 14.28c-.324-.162-1.92-.949-2.219-1.058-.299-.11-.517-.162-.734.162-.217.324-.838 1.058-1.027 1.275-.19.217-.378.243-.702.08-1.022-.512-1.696-.943-2.316-2.005-.164-.28.164-.26.469-.87.094-.19.047-.356-.024-.518-.071-.162-.634-1.53-.871-2.102-.23-.557-.464-.48-.634-.489-.164-.009-.353-.01-.542-.01-.189 0-.498.071-.758.353-.26.28-1 .978-1 2.387 0 1.408 1.022 2.77 1.164 2.96.143.19 2.012 3.073 4.876 4.314.682.296 1.213.473 1.628.605.686.218 1.312.187 1.806.113.551-.082 1.92-.786 2.19-1.507.27-.72.27-1.34.19-1.47-.08-.13-.298-.21-.622-.372z"/>
        </svg>
        <span>Join Our WhatsApp Group</span>
      </PillButton>

      {/* New Here Button with React Bits Pill Animation */}
      <PillButton
        href="/knowgod#contact-form"
        variant="gold"
        size="lg"
        className="w-full sm:w-auto tracking-wide text-base shadow-md hover:shadow-xl"
      >
        <svg 
          className="w-6 h-6 stroke-current fill-none" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>New Here?</span>
      </PillButton>
    </div>
  );
}
