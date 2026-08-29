import VideosCarousel from '../components/YouTubeVideos';

const apiKey = 'AIzaSyAug-_XwvZngyHblrWTCB5JA6P9Otrz-Ug';
const playlistId = 'PLzPzFVypL4vRCTD_e4VPiVYuIRh5if38F';
const maxResults = 50;

export default async function WatchOurSongsPage() {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`;

    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    const data = await res.json();
    const rawItems = data.items || [];

    // Format the items to match the structure expected by VideosCarousel
    const videos = rawItems.map(item => ({
        id: {
            videoId: item.snippet?.resourceId?.videoId
        },
        snippet: item.snippet
    })).filter(v => v.id.videoId); // Filter out any items without a videoId

    if (videos.length === 0) {
        return <VideosCarousel title="OUR SONGS" id="our-songs" videos={[]} stats={{}} />;
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

    return <VideosCarousel title="OUR SONGS" id="our-songs" videos={videos} stats={statsMap} />;
}
