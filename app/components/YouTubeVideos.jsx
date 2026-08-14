'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./YouTubeVideos.css";

export default function VideosCarousel({ videos, stats }) {
    return (
        <div id="sermons" className="Youtubecontainer">
            <div className="youtubecontent">
                <div className="videos-header">
                    <h2>LATEST SERMONS</h2>
                    <div className="underline" />
                </div>

                {videos.length > 0 ? (
                    <>
                        <Swiper
                            freeMode={true}
                            spaceBetween={24}
                            slidesPerView={4}
                            loop={false}
                            watchOverflow={true}
                            navigation={true}
                            pagination={{ clickable: true }}
                            modules={[FreeMode, Navigation, Pagination]}
                            style={{ paddingBottom: '30px', position: 'relative' }}
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
                                                    src="/Images/Playbutton.png"
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
                                            <div className="video_title" title={video.snippet.title}>
                                                {video.snippet.title}
                                            </div>
                                            {s && (
                                                <div className="video_stats">
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

