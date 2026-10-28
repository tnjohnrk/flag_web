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

console.log('--- Cloudinary Diagnostic Test ---');
console.log('Detected configuration in .env:');
console.log('Cloud Name :', cloud_name ? `"${cloud_name}"` : 'MISSING (Please add cloudinary_cloud_name to .env)');
console.log('API Key    :', api_key ? `"${api_key.substring(0, 5)}...${api_key.slice(-3)}"` : 'MISSING');
console.log('API Secret :', api_secret ? 'PRESENT' : 'MISSING');

if (!cloud_name) {
  console.error('\n[!] Missing cloud_name: Cloudinary requires a Cloud Name to communicate with your account.');
  console.log('To fix this, check your Cloudinary Console (Dashboard):');
  console.log('1. Visit https://console.cloudinary.com/pm/dashboards');
  console.log('2. Copy your "Cloud name"');
  console.log('3. Add it to .env:');
  console.log('   cloudinary_cloud_name=your_cloud_name_here');
  console.log('   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here\n');
  process.exit(1);
}

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

try {
  console.log('\nPinging Cloudinary API...');
  try {
    console.log('Testing upload permissions (create)...');
    const testUpload = await cloudinary.uploader.upload(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      { public_id: 'flagweb/perm_test', overwrite: true }
    );
    console.log('[✓] Upload permission verified! Test upload succeeded.');
    // Clean up test file
    await cloudinary.uploader.destroy('flagweb/perm_test');
  } catch (permErr) {
    console.error('\n[!] Missing Upload Permission:');
    console.error('    ' + permErr.message);
    console.log('\nTo fix this:');
    console.log('1. Go to Cloudinary Settings -> API Keys (or Access Keys)');
    console.log('2. Click Edit on API Key 126719573649328');
    console.log('3. Enable the "Create" (Write/Upload) permission checkbox and Save.');
    process.exit(1);
  }

  console.log('\n[✓] Cloudinary is fully connected and ready to push media!');
} catch (err) {
  console.error('\n[✗] Cloudinary Connection Error:', err.message);
  if (err.message && err.message.includes('cloud_name mismatch')) {
    console.error('Note: The API Key and Secret in .env do not match the cloud_name "' + cloud_name + '".');
    console.error('Please verify your Cloud Name from your Cloudinary Dashboard.');
  }
  process.exit(1);
}
