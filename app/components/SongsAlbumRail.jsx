'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AlbumRail from './ui/AlbumRail';
import { Play, ExternalLink, X, Eye, ThumbsUp, Disc3 } from 'lucide-react';

function formatDuration(duration) {
  if (!duration || duration === 'P0D') return '';
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';
  const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;
  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function SongsAlbumRail({ videos = [], stats = {}, title = "OUR SONGS", id = "our-songs" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const railRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format playlist videos into album items
  const items = useMemo(() => {
    if (!videos || videos.length === 0) return [];

    return videos.map((video) => {
      const videoId = video.id?.videoId;
      const snip = video.snippet || {};
      const s = stats[videoId] || {};

      // Parse clean title and subtitle
      const rawTitle = snip.title || 'Worship Song';
      const parts = rawTitle.split('|').map((p) => p.trim());
      const mainTitle = parts.slice(0, 2).join(' | ');
      const artist = parts.length > 2 ? parts[parts.length - 1] : 'Full Life AG Church';

      // Always prioritize Full HD 1280x720 maxresdefault for crystal-clear fidelity without cropping/letterbox
      const maxresUrl =
        snip.thumbnails?.maxres?.url ||
        `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

      const fallbackUrl =
        snip.thumbnails?.high?.url ||
        snip.thumbnails?.medium?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      return {
        id: videoId,
        videoId,
        title: mainTitle,
        fullTitle: rawTitle,
        subtitle: artist,
        src: maxresUrl,
        fallbackSrc: fallbackUrl,
        fullSrc: maxresUrl,
        duration: formatDuration(s.duration),
        views: s.viewCount ? Number(s.viewCount).toLocaleString() : null,
        likes: s.likeCount ? Number(s.likeCount).toLocaleString() : null,
        link: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
  }, [videos, stats]);

  const currentItem = items[activeIndex] || items[0] || null;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };
    if (selectedVideo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedVideo]);

  const handleSelectAlbum = useCallback((item) => {
    setSelectedVideo(item);
  }, []);

  return (
    <section id={id} data-reveal className="relative w-full py-12 md:py-16 bg-background overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A31A]/10 border border-[#D9A31A]/30 text-[#D9A31A] text-xs font-bold tracking-widest uppercase mb-3">
            <Disc3 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            Worship & Praise Playlist
          </div>

          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-text-primary dark:text-white tracking-wide uppercase">
            {title}
          </h2>

          <div className="w-[80px] h-[3px] bg-[#8a0303] mx-auto mt-3 rounded-full" />

          <p className="mt-3 text-sm sm:text-base text-text-secondary dark:text-gray-400 font-sans-clean max-w-xl mx-auto">
            Experience the divine presence of God through spirit-filled worship, praise, and songs written & ministered at Full Life Centre.
          </p>
        </div>

        {/* 3D Vinyl Album Rail View */}
        {items.length > 0 && (
          <div className="relative w-full">
            {/* 3D Stage */}
            <div className="py-2">
              <AlbumRail
                ref={railRef}
                items={items}
                startIndex={0}
                aspectRatio={16 / 9}
                coverHeight={220}
                neighborSpacing={0.24}
                compactness={0.52}
                withRecord={true}
                showRuler={true}
                autoplay={true}
                autoplayInterval={3500}
                onIndexChange={(index) => setActiveIndex(index)}
                onSelect={(item) => handleSelectAlbum(item)}
              />
            </div>

            {/* Active Track Highlight Showcase */}
            {currentItem && (
              <div className="mt-6 max-w-2xl mx-auto bg-surface dark:bg-[#121626]/80 backdrop-blur-md rounded-2xl p-5 border border-black/5 dark:border-white/10 shadow-lg text-center transition-all duration-300">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#D9A31A] mb-1">
                  <span>Track {activeIndex + 1} of {items.length}</span>
                  {currentItem.duration && <span>• {currentItem.duration}</span>}
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-text-primary dark:text-white leading-snug line-clamp-2">
                  {currentItem.fullTitle}
                </h3>

                {currentItem.subtitle && (
                  <p className="mt-1 text-xs text-text-secondary dark:text-gray-400 font-sans-clean">
                    {currentItem.subtitle}
                  </p>
                )}

                {/* Stats & Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-black/5 dark:border-white/10">
                  {currentItem.views && (
                    <span className="inline-flex items-center gap-1 text-xs text-text-secondary dark:text-gray-400">
                      <Eye className="w-3.5 h-3.5" />
                      {currentItem.views} Views
                    </span>
                  )}

                  {currentItem.likes && (
                    <span className="inline-flex items-center gap-1 text-xs text-text-secondary dark:text-gray-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {currentItem.likes} Likes
                    </span>
                  )}

                  {/* Play Video Modal Button */}
                  <button
                    onClick={() => handleSelectAlbum(currentItem)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D9A31A] hover:bg-[#e4b029] text-black font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 ml-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Play Song
                  </button>

                  {/* External YouTube Link */}
                  <a
                    href={currentItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary dark:text-white text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    YouTube
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state fallback */}
        {items.length === 0 && (
          <div className="text-center py-16 text-text-secondary">
            <Disc3 className="w-12 h-12 mx-auto text-[#D9A31A]/50 mb-3" />
            <p className="font-editorial text-xl font-bold">Songs are loading or currently being updated...</p>
            <p className="text-sm mt-1">Please check back in a few moments.</p>
          </div>
        )}
      </div>

      {/* Embedded Video Modal rendered directly to body via portal to prevent header obstruction */}
      {selectedVideo && mounted && createPortal(
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/85 backdrop-blur-md pt-16 pb-6 px-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.fullTitle}
        >
          {/* Prominent Floating Close Button on Top Right (Always reachable & clickable) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVideo(null);
            }}
            aria-label="Close video"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100001] w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 text-white border border-white/20 backdrop-blur-lg shadow-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 pointer-events-auto"
            title="Close video (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative w-full max-w-4xl bg-[#0B0F19] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-[100000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#111625] border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2 overflow-hidden pr-4">
                <Disc3 className="w-4 h-4 text-[#D9A31A] animate-spin flex-shrink-0" style={{ animationDuration: '3s' }} />
                <h4 className="font-editorial text-sm sm:text-base font-bold text-white truncate">
                  {selectedVideo.fullTitle}
                </h4>
              </div>

              {/* Header Close Button (Enhanced 40x40px target, always clickable) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVideo(null);
                }}
                aria-label="Close video"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white flex items-center justify-center transition-all flex-shrink-0 cursor-pointer pointer-events-auto relative z-20"
                title="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player (Responsive 16:9) */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
                title={selectedVideo.fullTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#111625] flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-3">
                {selectedVideo.views && <span>{selectedVideo.views} views</span>}
                {selectedVideo.likes && <span>• {selectedVideo.likes} likes</span>}
              </div>

              <a
                href={selectedVideo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D9A31A] hover:underline font-semibold"
              >
                Open in YouTube app <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

