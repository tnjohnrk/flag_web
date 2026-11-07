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

const items = [
  {
    localFile: 'public/images/pastors/pastor-16_07_Sun.png',
    appPath: '/images/pastors/pastor-16_07_Sun.png',
    publicId: 'flagweb/images/pastors/pastor-16_07_Sun',
    name: 'Pr. Sundar'
  },
  {
    localFile: 'public/images/pastors/pastor-18_09_Jen.png',
    appPath: '/images/pastors/pastor-18_09_Jen.png',
    publicId: 'flagweb/images/pastors/pastor-18_09_Jen',
    name: 'Sis. Jency'
  },
  {
    localFile: 'public/images/pastors/pastor-19_10_Mac.png',
    appPath: '/images/pastors/pastor-19_10_Mac.png',
    publicId: 'flagweb/images/pastors/pastor-19_10_Mac',
    name: 'Sis. Machtalin'
  },
];

async function run() {
  console.log(`Starting Cloudinary upload for ${items.length} pastor images...\n`);
  const uploadedResults = {};

  for (const item of items) {
    console.log(`Uploading ${item.name} (${item.localFile}) -> ${item.publicId}...`);
    const fullPath = path.resolve(item.localFile);
    const res = await cloudinary.uploader.upload(fullPath, {
      public_id: item.publicId,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
    });

    const optimizedUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/f_auto,q_auto/v${res.version}/${res.public_id}.${res.format}`;
    console.log(`  ✓ Success! Version: ${res.version}`);
    console.log(`  ✓ CDN URL: ${optimizedUrl}\n`);

    manifest[item.appPath] = {
      public_id: res.public_id,
      secure_url: optimizedUrl,
      raw_url: res.secure_url,
      format: res.format,
      bytes: res.bytes,
      version: res.version,
      uploaded_at: new Date().toISOString(),
    };

    uploadedResults[item.publicId] = optimizedUrl;
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Updated lib/cloudinary-manifest.json');
  console.log('Result URLs:', JSON.stringify(uploadedResults, null, 2));
}

run().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});
