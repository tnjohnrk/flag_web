'use client';

import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import "./YouTubeVideos.css";
import { getMediaUrl } from "@/lib/media";

export default function VideosCarousel({ videos, stats, title = "LATEST SERMONS", id = "sermons" }) {
    const swiperRef = useRef(null);
    const containerRef = useRef(null);

    // Ultra-Responsive Smooth Mouse Wheel / Trackpad Scroll Navigation
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let accumulatedDelta = 0;
        let wheelTimer = null;
        let lastTriggerTime = 0;
        let resumeAutoplayTimer = null;

        const onWheel = (e) => {
            const swiper = swiperRef.current;
            if (!swiper || swiper.destroyed) return;

            // Determine dominant scroll delta
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) < 2) return;

            // Prevent whole page vertical jump while interacting with the sermons carousel
            e.preventDefault();

            // Temporarily pause autoplay so it doesn't fight user's manual scroll
            if (swiper.autoplay && swiper.autoplay.running) {
                swiper.autoplay.stop();
            }
            clearTimeout(resumeAutoplayTimer);
            resumeAutoplayTimer = setTimeout(() => {
                if (swiperRef.current?.autoplay && !swiperRef.current.destroyed) {
                    swiperRef.current.autoplay.start();
                }
            }, 3500);

            const now = performance.now();
            accumulatedDelta += delta;

            // Instant reaction: threshold of 8 with adaptive throttle for 120fps fluid response
            const timeSinceLast = now - lastTriggerTime;
            const isRapidFlick = Math.abs(delta) > 50 || Math.abs(accumulatedDelta) > 40;
            const throttleMs = isRapidFlick ? 45 : 65;

            if (Math.abs(accumulatedDelta) >= 8 && timeSinceLast > throttleMs) {
                lastTriggerTime = now;
                // Snappy 240-270ms transition duration prevents lag and locks
                const duration = isRapidFlick ? 230 : 270;
                if (accumulatedDelta > 0) {
                    swiper.slideNext(duration);
                } else {
                    swiper.slidePrev(duration);
                }
                accumulatedDelta = 0;
            }

            clearTimeout(wheelTimer);
            wheelTimer = setTimeout(() => {
                accumulatedDelta = 0;
            }, 90);
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            el.removeEventListener('wheel', onWheel);
            clearTimeout(wheelTimer);
            clearTimeout(resumeAutoplayTimer);
        };
    }, []);

    return (
        <div id={id} data-reveal className="Youtubecontainer bg-background">
            <div className="youtubecontent bg-background" ref={containerRef}>
                <div className="videos-header">
                    <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-text-primary dark:text-white tracking-wide uppercase">{title}</h2>
                    <div className="underline bg-flag-blue" />
                </div>

                {videos.length > 0 ? (
                    <>
                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            spaceBetween={24}
                            loop={videos.length > 4}
                            watchOverflow={true}
                            navigation={true}
                            speed={280}
                            autoplay={videos.length > 1 ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                            observer={true}
                            observeParents={true}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 16
                                },
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 24
                                },
                                1440: {
                                    slidesPerView: 4,
                                    spaceBetween: 24
                                }
                            }}
                            modules={[Navigation, Autoplay]}
                            style={{ width: '100%', position: 'relative' }}
                        >
                            {videos.map((video) => {
                                const s = stats[video.id.videoId];
                                return (
                                    <SwiperSlide key={video.id.videoId}>
                                        <div style={{ textAlign: 'center', position: 'relative' }}>
                                            <div className="video-wrapper">
                                                <img
                                                    className="video-thumbnail"
                                                    width="463"
                                                    height="251"
                                                    src={`https://img.youtube.com/vi/${video.id.videoId}/hqdefault.jpg`}
                                                    alt={video.snippet.title}
                                                   
                                                />
                                               
                                                <img
                                                    src={getMediaUrl("/images/Playbutton.avif")}
                                                    alt="YouTube Play"
                                                    className="youtube-center-logo"
                                                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank')}
                                                />
                                                <span className="video-duration">
                                                    {s.duration && (
                                                        <div className="video_duration">
                                                            {formatDuration(s.duration)}
                                                        </div>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="video_title text-text-primary dark:text-text-primary" title={video.snippet.title} style={{ color: 'inherit' }}>
                                                {video.snippet.title}
                                            </div>
                                            {s && (
                                                <div className="video_stats text-text-secondary dark:text-text-secondary" style={{ color: 'inherit' }}>
                                                    {Number(s.viewCount).toLocaleString()} Views •{" "}
                                                    {Number(s.likeCount).toLocaleString()} Likes •{" "}
                                                    {Number(s.commentCount).toLocaleString()} Comments
                                                </div>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </>
                ) : (
                    <p>Loading videos...</p>
                )}
            </div>
        </div>
    );
}

function formatDuration(duration) {
    if (!duration || duration === 'P0D') return "00:00";

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    if (!match) return "00:00"; // fallback if not matched

    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;

    return hours > 0
        ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

