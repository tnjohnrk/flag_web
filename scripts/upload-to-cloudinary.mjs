import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Load .env
if (process.loadEnvFile) {
  try {
    process.loadEnvFile('.env');
  } catch (_) {}
}

const cloud_name =
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

if (!cloud_name || !api_key || !api_secret) {
  console.error('\n======================================================');
  console.error(' [!] Cloudinary configuration incomplete in .env');
  console.error('======================================================');
  console.error('Cloud Name :', cloud_name ? 'OK' : 'MISSING');
  console.error('API Key    :', api_key ? 'OK' : 'MISSING');
  console.error('API Secret :', api_secret ? 'OK' : 'MISSING');
  console.error('\nPlease ensure your .env file contains:');
  console.error('  cloudinary_cloud_name=<your_cloud_name>');
  console.error('  cloudinary_api_key=<your_api_key>');
  console.error('  cloudinary_api_screatkey=<your_api_secret>');
  console.error('======================================================\n');
  process.exit(1);
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

const MANIFEST_PATH = path.resolve('lib/cloudinary-manifest.json');
const PUBLIC_DIR = path.resolve('public');
const IMAGES_DIR = path.resolve('public/images');
const V1_FRAMES_DIR = path.resolve('public/v1_frames');

const args = process.argv.slice(2);
const forceUpload = args.includes('--force');
const includeFrames = args.includes('--include-frames');

// Load existing manifest
let manifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch (_) {
    manifest = {};
  }
}

// Helper: Scan files recursively
function getFilesRecursively(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, extensions));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const SUPPORTED_EXTS = [
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif',
  '.mp4', '.webm', '.mov', '.ogg'
];

async function uploadFile(filePath) {
  const relativeToPublic = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const appPath = `/${relativeToPublic}`;
  const ext = path.extname(filePath).toLowerCase();
  const isVideo = ['.mp4', '.webm', '.mov', '.ogg'].includes(ext);
  const resourceType = isVideo ? 'video' : 'image';

  // Check if already uploaded and not forcing
  if (!forceUpload && manifest[appPath] && manifest[appPath].secure_url) {
    console.log(`[SKIP] Already uploaded: ${appPath}`);
    return manifest[appPath];
  }

  const stat = fs.statSync(filePath);
  const fileSizeMb = (stat.size / (1024 * 1024)).toFixed(2);
  console.log(`[UPLOADING] ${appPath} (${fileSizeMb} MB, ${resourceType})...`);

  // Cloudinary public ID without extension
  const cleanSubPath = relativeToPublic.replace(/\.[^/.]+$/, '');
  const publicId = `flagweb/${cleanSubPath}`;

  try {
    let result;
    if (isVideo && stat.size > 20 * 1024 * 1024) {
      // Use upload_large for files > 20MB
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
          filePath,
          {
            resource_type: resourceType,
            public_id: publicId,
            overwrite: true,
            chunk_size: 6000000, // 6MB chunks
          },
          (error, res) => {
            if (error) reject(error);
            else resolve(res);
          }
        );
      });
    } else {
      result = await cloudinary.uploader.upload(filePath, {
        resource_type: resourceType,
        public_id: publicId,
        overwrite: true,
      });
    }

    // Build optimized CDN URL with auto-format and auto-quality
    let optimizedUrl = result.secure_url;
    if (optimizedUrl.includes('/upload/')) {
      optimizedUrl = optimizedUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    manifest[appPath] = {
      public_id: result.public_id,
      secure_url: optimizedUrl,
      raw_url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
      resource_type: result.resource_type,
      width: result.width,
      height: result.height,
      uploaded_at: new Date().toISOString(),
    };

    // Save manifest progressively
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`  ✓ Success -> ${optimizedUrl}`);
    return manifest[appPath];
  } catch (error) {
    console.error(`  ✗ Failed to upload ${appPath}:`, error.message);
    return null;
  }
}

async function run() {
  console.log('\n======================================================');
  console.log('   FLAG Church - Cloudinary Asset Uploader');
  console.log('======================================================');
  console.log(`Target Cloud   : ${cloud_name}`);
  console.log(`Force Upload   : ${forceUpload}`);
  console.log(`Include Frames : ${includeFrames}`);
  console.log('======================================================\n');

  // Collect target files
  let targetFiles = getFilesRecursively(IMAGES_DIR, SUPPORTED_EXTS);

  if (includeFrames) {
    console.log('Including v1_frames sequence (480 frames)...');
    targetFiles = targetFiles.concat(getFilesRecursively(V1_FRAMES_DIR, SUPPORTED_EXTS));
  } else {
    console.log('Note: v1_frames sequence skipped by default to save quota.');
    console.log('Pass --include-frames to also upload 240-frame sequence.\n');
  }

  console.log(`Found ${targetFiles.length} media files to process.\n`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < targetFiles.length; i++) {
    const file = targetFiles[i];
    const rel = path.relative(PUBLIC_DIR, file).replace(/\\/g, '/');
    const appPath = `/${rel}`;

    if (!forceUpload && manifest[appPath] && manifest[appPath].secure_url) {
      skippedCount++;
      continue;
    }

    console.log(`[${i + 1}/${targetFiles.length}] Processing ${rel}...`);
    const res = await uploadFile(file);
    if (res) successCount++;
    else failCount++;
  }

  console.log('\n======================================================');
  console.log(' Upload Summary');
  console.log('======================================================');
  console.log(`Total Files Checked : ${targetFiles.length}`);
  console.log(`Successfully Uploaded: ${successCount}`);
  console.log(`Skipped (Cached)   : ${skippedCount}`);
  console.log(`Failed             : ${failCount}`);
  console.log(`Manifest updated at : ${MANIFEST_PATH}`);
  console.log('======================================================\n');
}

run().catch((err) => {
  console.error('Fatal error during upload:', err);
  process.exit(1);
});
