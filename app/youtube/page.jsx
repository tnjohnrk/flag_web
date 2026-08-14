import VideosPageClient from '../components/YouTubeVideos';

const apiKey = 'AIzaSyAug-_XwvZngyHblrWTCB5JA6P9Otrz-Ug';
const channelId = 'UCIkeyxZEY3QrjtKm7KJHmZA';
const maxResults = 7;

export default async function VideosPage() {

    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&maxResults=${maxResults}&type=video`;

    const res = await fetch(apiUrl, { next: { revalidate: 86400 } });
    const data = await res.json();
    const videos = data.items || [];

    // Fetch stats
    const ids = videos.map(v => v.id.videoId).join(',');
    const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids}&key=${apiKey}`,
        { next: { revalidate: 86400 } }
    );
    const statsJson = await statsRes.json();

    // Create a lookup map
    const statsMap = {};
    statsJson.items.forEach(item => {
        statsMap[item.id] = {
            ...item.statistics,
            duration: item.contentDetails.duration
        };
    });

    // Pass both videos + stats
    return <VideosPageClient videos={videos} stats={statsMap} />;
}
