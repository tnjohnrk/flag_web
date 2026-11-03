import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

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
  console.error('[!] Cloudinary credentials missing in .env');
  process.exit(1);
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

const MANIFEST_PATH = path.resolve('lib/cloudinary-manifest.json');
let manifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch (_) {}
}

const HISTORY_FILES = [
  'public/images/history/church_early_prayer_1998.jpg',
  'public/images/history/church_early_congregation.jpg',
  'public/images/history/church_first_hall_construction_2003.jpg',
  'public/images/history/church_demolition_trials_2005.jpg',
  'public/images/history/church_god_opens_doors_2005.jpg',
];

async function run() {
  console.log(`\n======================================================`);
  console.log(` Uploading Church History Images to Cloudinary (${cloud_name})`);
  console.log(`======================================================\n`);

  const results = {};

  for (const relFile of HISTORY_FILES) {
    const fullPath = path.resolve(relFile);
    if (!fs.existsSync(fullPath)) {
      console.log(`[SKIP] Missing file: ${relFile}`);
      continue;
    }

    const appPath = relFile.replace(/^public/, '');
    const filename = path.basename(relFile, path.extname(relFile));
    const publicId = `flagweb/history/${filename}`;

    console.log(`Uploading ${appPath} as ${publicId}...`);

    try {
      const res = await cloudinary.uploader.upload(fullPath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });

      const optimizedUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/f_auto,q_auto/v${res.version}/${res.public_id}.${res.format}`;

      manifest[appPath] = {
        public_id: res.public_id,
        secure_url: optimizedUrl,
        raw_url: res.secure_url,
        format: res.format,
        bytes: res.bytes,
        uploaded_at: new Date().toISOString(),
      };

      results[filename] = optimizedUrl;
      console.log(`  ✓ Success: ${optimizedUrl}`);
    } catch (err) {
      console.error(`  ✗ Error uploading ${appPath}:`, err.message);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\nUpdated manifest at ${MANIFEST_PATH}`);
  console.log(`\nResults JSON:`);
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);

