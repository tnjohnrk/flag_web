import VideosPageClient from '../components/YouTubeVideos';

const apiKey = 'AIzaSyAug-_XwvZngyHblrWTCB5JA6P9Otrz-Ug';
const playlistId = 'UUIkeyxZEY3QrjtKm7KJHmZA'; // Channel Uploads Playlist (costs 1 quota unit instead of 100 search units)
const maxResults = 10;

export default async function VideosPage() {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`;

    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    const data = await res.json();
    const rawItems = data.items || [];

    // Format the items to match Swiper structure
    const videos = rawItems.map(item => ({
        id: {
            videoId: item.snippet?.resourceId?.videoId
        },
        snippet: item.snippet
    })).filter(v => v.id.videoId);

    if (videos.length === 0) {
        return <VideosPageClient videos={[]} stats={{}} />;
    }

    // Fetch stats
    const ids = videos.map(v => v.id.videoId).join(',');
    const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids}&key=${apiKey}`,
        { next: { revalidate: 86400 } }
    );
    const statsJson = await statsRes.json();

    // Create a lookup map
    const statsMap = {};
    if (statsJson.items) {
        statsJson.items.forEach(item => {
            statsMap[item.id] = {
                ...item.statistics,
                duration: item.contentDetails?.duration
            };
        });
    }

    return <VideosPageClient videos={videos} stats={statsMap} />;
}
