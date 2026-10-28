import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

if (process.loadEnvFile) {
  try {
    process.loadEnvFile('.env');
  } catch (_) {}
}

const cloud_name =
  process.argv[2] ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.cloudinary_cloud_name ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const api_key =
  process.env.CLOUDINARY_API_KEY ||
  process.env.cloudinary_api_key;

const api_secret =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.cloudinary_api_secret ||
  process.env.cloudinary_api_screatkey;

if (!cloud_name) {
  console.error('\n[!] Missing cloud_name: Please provide your Cloudinary Cloud Name in .env or as argument.');
  console.log('Usage: node scripts/upload-hero-loop-video.mjs [your_cloud_name]');
  process.exit(1);
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

const videoPath = fs.existsSync(path.resolve('public/images/loop_hero_optimized.mp4'))
  ? path.resolve('public/images/loop_hero_optimized.mp4')
  : path.resolve('public/images/Loop Video Final.mp4');

if (!fs.existsSync(videoPath)) {
  console.error(`[!] Video file not found at: ${videoPath}`);
  process.exit(1);
}

const stat = fs.statSync(videoPath);
const fileSizeMb = (stat.size / (1024 * 1024)).toFixed(2);

console.log(`\n======================================================`);
console.log(` Uploading Hero Loop Video to Cloudinary`);
console.log(` File : ${videoPath}`);
console.log(` Size : ${fileSizeMb} MB`);
console.log(` Cloud: ${cloud_name}`);
console.log(`======================================================\n`);

console.log('Starting chunked upload (this may take a few minutes for 145 MB)...');

try {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      videoPath,
      {
        resource_type: 'video',
        public_id: 'flagweb/hero_loop_video',
        overwrite: true,
        chunk_size: 6000000, // 6MB chunk size
      },
      (error, res) => {
        if (error) reject(error);
        else resolve(res);
      }
    );
  });

  console.log('\n[✓] Upload successful!');
  console.log('Public ID   :', result.public_id);
  console.log('Playback URL:', result.secure_url);

  // Generate optimized URLs
  const baseUrl = `https://res.cloudinary.com/${cloud_name}/video/upload`;
  const mp4Url = `${baseUrl}/f_auto,q_auto/v${result.version}/flagweb/hero_loop_video.mp4`;
  const webmUrl = `${baseUrl}/f_auto,q_auto/v${result.version}/flagweb/hero_loop_video.webm`;
  const posterUrl = `${baseUrl}/f_auto,q_auto,so_0/v${result.version}/flagweb/hero_loop_video.jpg`;

  console.log('\nOptimized CDN URLs:');
  console.log('Poster :', posterUrl);
  console.log('MP4    :', mp4Url);
  console.log('WebM   :', webmUrl);

  // Update manifest
  const manifestPath = path.resolve('lib/cloudinary-manifest.json');
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (_) {}
  }

  manifest['/images/Loop Video Final.mp4'] = {
    public_id: result.public_id,
    secure_url: mp4Url,
    webm_url: webmUrl,
    poster_url: posterUrl,
    raw_url: result.secure_url,
    resource_type: 'video',
    bytes: result.bytes,
    uploaded_at: new Date().toISOString(),
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('\n[✓] Updated lib/cloudinary-manifest.json');

  // Output json format for script consumption
  console.log('\nRESULT_JSON:' + JSON.stringify({
    mp4Url,
    webmUrl,
    posterUrl,
    cloud_name,
  }));
} catch (error) {
  console.error('\n[✗] Upload failed:', error.message);
  process.exit(1);
}
