'use client';

import * as React from 'react';
import './PastorsModal.css';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

export default function PastorsModal({ name, role, description, imageIndex }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let [pastorName, pastorRole, pastorDescription] = [name, role, description];
  let imagePath = "/Images/pastor-" + imageIndex + ".png";

  return (
    <>
      {/* Premium Editorial Portrait Card */}
      <div 
        onClick={handleOpen}
        className="pastor-editorial-card group relative overflow-hidden rounded-[24px] w-full h-[460px] flex flex-col justify-end p-6 select-none"
      >
        {/* Background Pastor Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
          <Image 
            src={imagePath}
            alt={pastorName}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
            priority={imageIndex <= 3}
            className="pastor-card-image object-cover object-top w-full h-full"
          />
        </div>

        {/* Top Subtle Vignette Overlay */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none z-10" />

        {/* Bottom Rich Gradient Mask */}
        <div className="pastor-card-overlay absolute inset-0 pointer-events-none z-10" />

        {/* Card Content (Typography & Role Badge) */}
        <div className="pastor-card-content relative z-20 flex flex-col justify-end h-full pt-12">
          {/* Role Badge */}
          <div className="mb-3.5 self-start">
            <span className="font-sans-clean text-[11px] md:text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-md inline-block shadow-sm">
              {pastorRole}
            </span>
          </div>

          {/* Pastor Name (Dominant Editorial Serif Font) */}
          <h3 className="font-editorial text-2xl md:text-3xl font-bold text-white leading-tight tracking-wide drop-shadow-md group-hover:text-amber-200 transition-colors duration-300">
            {pastorName}
          </h3>

          {/* Subtle Hover Action Callout */}
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/80 group-hover:text-white transition-all duration-300">
            <span>Read Biography</span>
            <svg 
              className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300 text-amber-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pastor Biography Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
      >
        <Fade in={open}>
          <Box id="box">
            <div className="pr-8">
              <span className="font-sans-clean text-xs font-bold tracking-widest uppercase text-amber-500 mb-1 inline-block">
                {pastorRole}
              </span>
              <h1 id="title" className="font-editorial text-3xl md:text-4xl font-bold text-text-primary mt-1 mb-3">
                {pastorName}
              </h1>
              <div id="pastors-details" className="mt-4 border-t border-border/40 pt-4">
                <p id="description" className="font-sans-clean text-base leading-relaxed text-text-secondary">
                  {pastorDescription}
                </p>
              </div>
            </div>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: 'absolute',
                right: 16,
                top: 16,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}