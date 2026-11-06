'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import AlbumRail from './ui/AlbumRail';
import { Play, ExternalLink, X, Eye, ThumbsUp, Disc3, LayoutGrid } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState('rail'); // 'rail' | 'grid'
  const railRef = useRef(null);

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

      const thumbUrl =
        snip.thumbnails?.maxres?.url ||
        snip.thumbnails?.standard?.url ||
        snip.thumbnails?.high?.url ||
        snip.thumbnails?.medium?.url ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return {
        id: videoId,
        videoId,
        title: mainTitle,
        fullTitle: rawTitle,
        subtitle: artist,
        src: thumbUrl,
        fullSrc: thumbUrl,
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

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold text-text-primary dark:text-white tracking-wide">
            {title}
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#D9A31A] to-transparent mx-auto mt-3 rounded-full" />

          <p className="mt-3 text-sm sm:text-base text-text-secondary dark:text-gray-400 font-sans-clean max-w-xl mx-auto">
            Experience the divine presence of God through spirit-filled worship, praise, and songs written & ministered at Full Life Centre.
          </p>

          {/* View Mode Toggle */}
          <div className="mt-4 inline-flex items-center p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <button
              onClick={() => setViewMode('rail')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'rail'
                  ? 'bg-[#D9A31A] text-black font-semibold shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-label="3D Album Rail view"
            >
              <Disc3 className="w-3.5 h-3.5" />
              Vinyl Rail
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#D9A31A] text-black font-semibold shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              All Songs
            </button>
          </div>
        </div>

        {/* 3D Vinyl Album Rail View */}
        {viewMode === 'rail' && items.length > 0 && (
          <div className="relative w-full">
            {/* 3D Stage */}
            <div className="py-2">
              <AlbumRail
                ref={railRef}
                items={items}
                startIndex={0}
                aspectRatio={1}
                coverHeight={250}
                neighborSpacing={0.24}
                compactness={0.52}
                withRecord={true}
                showRuler={true}
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

        {/* Traditional Grid View */}
        {viewMode === 'grid' && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
            {items.map((item, idx) => (
              <div
                key={`grid-${item.id || idx}`}
                onClick={() => handleSelectAlbum(item)}
                className="group relative bg-surface dark:bg-[#121626] rounded-xl overflow-hidden border border-black/5 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Square Album Cover with vinyl edge preview */}
                <div className="relative w-full aspect-square overflow-hidden bg-black">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Play Button Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-[#D9A31A] text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {item.duration && (
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* Song Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-editorial text-base font-bold text-text-primary dark:text-white line-clamp-2 group-hover:text-[#D9A31A] transition-colors">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="mt-1 text-xs text-text-secondary dark:text-gray-400 line-clamp-1">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-text-secondary">
                    <span>{item.views ? `${item.views} Views` : 'Full Life AG'}</span>
                    <span className="text-[#D9A31A] font-semibold flex items-center gap-1">
                      Play <Play className="w-2.5 h-2.5 fill-current" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Embedded Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0B0F19] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111625] border-b border-white/10">
              <div className="flex items-center gap-2 overflow-hidden pr-4">
                <Disc3 className="w-4 h-4 text-[#D9A31A] animate-spin flex-shrink-0" style={{ animationDuration: '3s' }} />
                <h4 className="font-editorial text-sm sm:text-base font-bold text-white truncate">
                  {selectedVideo.fullTitle}
                </h4>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                aria-label="Close video"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
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
        </div>
      )}
    </section>
  );
}
