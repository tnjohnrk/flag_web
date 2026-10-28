import { v2 as cloudinary } from 'cloudinary';

// Ensure .env is loaded if running in Node standalone scripts
if (typeof process !== 'undefined' && process.loadEnvFile) {
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
  process.env.cloudinary_api_screatkey; // Support user's env spelling

if (cloud_name && api_key && api_secret) {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });
}

export { cloudinary, cloud_name, api_key, api_secret };
export default cloudinary;
