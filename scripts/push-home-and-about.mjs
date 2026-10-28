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

// Key Home and About assets
const TARGET_ASSETS = [
  // Home Area
  'public/images/flag-logo.avif',
  'public/images/church_timing.avif',
  'public/images/children_services.avif',
  'public/images/prayerimage.avif',
  'public/images/needhousevisit.avif',
  'public/images/marriage.avif',
  'public/images/Playbutton.avif',

  // About Area
  'public/images/Pr._Johnson_Magazine.png',
  'public/images/familyPic.avif',
  'public/images/family-pic.avif',

  // 18 Pastoral Cutouts
  'public/images/pastors/pastor-01_-09_Joh.png',
  'public/images/pastors/pastor-02_-08_Ema.png',
  'public/images/pastors/pastor-03_-07_Pra.png',
  'public/images/pastors/pastor-04_-06_Chir.png',
  'public/images/pastors/pastor-05_-05_Thom.png',
  'public/images/pastors/pastor-06_-04_Pet.png',
  'public/images/pastors/pastor-07_-03_Roy.png',
  'public/images/pastors/pastor-08_-02_mani.png',
  'public/images/pastors/pastor-09_-01_Jer.png',
  'public/images/pastors/pastor-10_01_Dad.png',
  'public/images/pastors/pastor-11_02_Jeru.png',
  'public/images/pastors/pastor-12_03_Bal.png',
  'public/images/pastors/pastor-13_04_Dan.png',
  'public/images/pastors/pastor-14_05_Nag.png',
  'public/images/pastors/pastor-15_06_Jos.png',
  'public/images/pastors/pastor-16_07_Sun.png',
  'public/images/pastors/pastor-17_08_Vic.png',
  'public/images/pastors/pastor-18_09_Jen.png',

  // Pastor Modal portraits
  'public/images/pastor-1.avif',
  'public/images/pastor-2.avif',
  'public/images/pastor-3.avif',
  'public/images/pastor-4.avif',
  'public/images/pastor-5.avif',
  'public/images/pastor-6.avif',
  'public/images/pastor-7.avif',
  'public/images/pastor-8.avif',
  'public/images/pastor-9.avif',
  'public/images/pastor-10.avif',
  'public/images/pastor-11.avif',
  'public/images/pastor-12.avif',
  'public/images/pastor-13.avif'
];

async function run() {
  console.log(`\n======================================================`);
  console.log(` Pushing Home & About Images to Cloudinary (${cloud_name})`);
  console.log(`======================================================\n`);

  let success = 0;
  let fail = 0;

  for (let i = 0; i < TARGET_ASSETS.length; i++) {
    const relFile = TARGET_ASSETS[i];
    const fullPath = path.resolve(relFile);
    if (!fs.existsSync(fullPath)) {
      console.log(`[SKIP] Missing local file: ${relFile}`);
      continue;
    }

    const appPath = relFile.replace(/^public/, '');
    const cleanId = appPath.replace(/^\//, '').replace(/\.[^/.]+$/, '');
    const publicId = `flagweb/${cleanId}`;

    console.log(`[${i + 1}/${TARGET_ASSETS.length}] Uploading ${appPath}...`);

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

      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
      console.log(`  ✓ Uploaded -> ${optimizedUrl}`);
      success++;
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      fail++;
    }
  }

  console.log(`\n======================================================`);
  console.log(` Results: ${success} uploaded, ${fail} failed.`);
  console.log(` Manifest updated at ${MANIFEST_PATH}`);
  console.log(`======================================================\n`);
}

run().catch(console.error);
