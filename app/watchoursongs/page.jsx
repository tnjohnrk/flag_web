import SongsAlbumRail from '../components/SongsAlbumRail';

const apiKey = 'AIzaSyAug-_XwvZngyHblrWTCB5JA6P9Otrz-Ug';
const playlistId = 'PLzPzFVypL4vRCTD_e4VPiVYuIRh5if38F';
const maxResults = 50;

const FALLBACK_VIDEOS = [
  {
    id: { videoId: 'SO6myGMCntw' },
    snippet: {
      title: 'Neereallamal... | நீரேயல்லாமல்... | Rev. Madurantakam Yesudhas | Rev. N. Johnson',
      thumbnails: {
        maxres: { url: 'https://i.ytimg.com/vi/SO6myGMCntw/maxresdefault.jpg' }
      }
    }
  },
  {
    id: { videoId: '4UhI1wnNAk8' },
    snippet: {
      title: 'EL-YESHUA | எல்-யெஷூவா | 2025 New Tamil Dance Song | Jerry Jemson',
      thumbnails: {
        maxres: { url: 'https://i.ytimg.com/vi/4UhI1wnNAk8/maxresdefault.jpg' }
      }
    }
  },
  {
    id: { videoId: 'vXlXucFmIpY' },
    snippet: {
      title: 'பிறந்தார் இயேசு பிறந்தார் | New Tamil Christmas Song | Rev. N. Johnson',
      thumbnails: {
        maxres: { url: 'https://i.ytimg.com/vi/vXlXucFmIpY/maxresdefault.jpg' }
      }
    }
  },
  {
    id: { videoId: 'm7JydCkEVh4' },
    snippet: {
      title: 'Sugam Alikum Paadalgal | Healing Medley | The Johnsons | Full Life AG',
      thumbnails: {
        maxres: { url: 'https://i.ytimg.com/vi/m7JydCkEVh4/maxresdefault.jpg' }
      }
    }
  },
  {
    id: { videoId: '5WeDhCK2YlM' },
    snippet: {
      title: 'Thetrum Devan | தேற்றும் தேவன் | 4K Cinematic Worship | FLAG Media',
      thumbnails: {
        maxres: { url: 'https://i.ytimg.com/vi/5WeDhCK2YlM/maxresdefault.jpg' }
      }
    }
  },
  {
    id: { videoId: 'SnZ1k6ZhcIk' },
    snippet: {
      title: 'அப்பா அப்பா பிதாவே! | Appa Appa Pithave! | Jerusha Pearlin',
      thumbnails: {
        maxres: { url: 'https://i.ytimg.com/vi/SnZ1k6ZhcIk/maxresdefault.jpg' }
      }
    }
  },
  {
    id: { videoId: 'mutRIzv9JiM' },
    snippet: {
      title: 'Deva Umathu Anbu | தேவா உமது அன்பு | Jerusha Pearlin | Rev. N. Johnson',
      thumbnails: {
        maxres: { url: 'https://i.ytimg.com/vi/mutRIzv9JiM/maxresdefault.jpg' }
      }
    }
  },
  {
    id: { videoId: 'PjTYKViJpIU' },
    snippet: {
      title: 'Yesu Vantharae | இயேசு வந்தாரே | Rev. N. Johnson | Pr. Jerry Jemson',
      thumbnails: {
        maxres: { url: 'https://i.ytimg.com/vi/PjTYKViJpIU/maxresdefault.jpg' }
      }
    }
  }
];

export default async function WatchOurSongsPage() {
  let videos = [];
  let statsMap = {};

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`;
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    const data = await res.json();
    const rawItems = data.items || [];

    videos = rawItems
      .map((item) => ({
        id: {
          videoId: item.snippet?.resourceId?.videoId,
        },
        snippet: item.snippet,
      }))
      .filter((v) => v.id.videoId);

    if (videos.length > 0) {
      const ids = videos.map((v) => v.id.videoId).join(',');
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids}&key=${apiKey}`,
        { next: { revalidate: 86400 } }
      );
      const statsJson = await statsRes.json();

      if (statsJson.items) {
        statsJson.items.forEach((item) => {
          statsMap[item.id] = {
            ...item.statistics,
            duration: item.contentDetails?.duration,
          };
        });
      }
    }
  } catch (err) {
    console.error('Error fetching YouTube songs playlist:', err);
  }

  // Use fallback if API returned no items
  const finalVideos = videos.length > 0 ? videos : FALLBACK_VIDEOS;

  return (
    <SongsAlbumRail
      title="OUR SONGS"
      id="our-songs"
      videos={finalVideos}
      stats={statsMap}
    />
  );
}
