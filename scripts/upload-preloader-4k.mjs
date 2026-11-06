import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

if (process.loadEnvFile) {
  try {
    process.loadEnvFile('.env');
  } catch (_) {}
}

const cloud_name =
  process.env.cloudinary_cloud_name ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const api_key =
  process.env.cloudinary_api_key ||
  process.env.CLOUDINARY_API_KEY;

const api_secret =
  process.env.cloudinary_api_screatkey ||
  process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

const videoPath = path.resolve('public/images/preloder1.mp4');

if (!fs.existsSync(videoPath)) {
  console.error(`[!] Video file not found at: ${videoPath}`);
  process.exit(1);
}

const stat = fs.statSync(videoPath);
const fileSizeMb = (stat.size / (1024 * 1024)).toFixed(2);

console.log(`\n======================================================`);
console.log(` Uploading Preloader Video (4K) to Cloudinary`);
console.log(` File : ${videoPath}`);
console.log(` Size : ${fileSizeMb} MB`);
console.log(` Cloud: ${cloud_name}`);
console.log(`======================================================\n`);

try {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      videoPath,
      {
        resource_type: 'video',
        public_id: 'flagweb/preloader1_4k',
        overwrite: true,
        chunk_size: 6000000,
      },
      (error, res) => {
        if (error) reject(error);
        else resolve(res);
      }
    );
  });

  console.log('\n[✓] Upload successful!');
  console.log('Public ID   :', result.public_id);
  console.log('Width       :', result.width);
  console.log('Height      :', result.height);
  console.log('Duration    :', result.duration);
  console.log('Format      :', result.format);
  console.log('Secure URL  :', result.secure_url);
} catch (err) {
  console.error('[!] Upload error:', err);
  process.exit(1);
}
