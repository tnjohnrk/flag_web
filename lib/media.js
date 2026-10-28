import { CDN_URLS } from './cloudinaryLibrary';
import manifest from './cloudinary-manifest.json';

const cloudName =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.cloudinary_cloud_name;

/**
 * Resolves a local path (e.g. "/images/pastors/pastor-01_-09_Joh.png")
 * to its fast Cloudinary CDN URL if available, otherwise returns the local path.
 *
 * @param {string} localPath - Relative path like "/images/flag-logo.avif"
 * @param {Object} [options] - Optional Cloudinary transformations
 * @param {number} [options.width] - Desired width (e.g. 800)
 * @param {number} [options.height] - Desired height
 * @param {string} [options.crop] - Crop mode ('fill', 'scale', 'limit', etc.)
 * @param {string} [options.quality='auto'] - Quality setting ('auto', 'auto:best', etc.)
 * @param {string} [options.format='auto'] - Format setting ('auto', 'webp', 'avif', etc.)
 * @returns {string} - Fast CDN URL or local fallback path
 */
export function getMediaUrl(localPath, options = {}) {
  if (!localPath) return '';

  // 1. If it's already an external/Cloudinary URL, return as-is
  if (localPath.startsWith('http://') || localPath.startsWith('https://')) {
    return localPath;
  }

  // Normalize path with leading slash
  const normalizedPath = localPath.startsWith('/') ? localPath : `/${localPath}`;

  // 2. Check centralized Cloudinary Library first, then manifest
  let cdnUrl = CDN_URLS[normalizedPath] || (manifest && manifest[normalizedPath] ? (typeof manifest[normalizedPath] === 'string' ? manifest[normalizedPath] : manifest[normalizedPath].secure_url) : null);

  if (cdnUrl) {

    // Apply inline transformations if options requested
    if (cdnUrl && (options.width || options.height || options.quality || options.crop)) {
      const transforms = [];
      if (options.crop) transforms.push(`c_${options.crop}`);
      if (options.width) transforms.push(`w_${options.width}`);
      if (options.height) transforms.push(`h_${options.height}`);
      if (options.quality) transforms.push(`q_${options.quality}`);
      if (options.format) transforms.push(`f_${options.format}`);

      if (transforms.length > 0) {
        // Insert transformations after /upload/
        cdnUrl = cdnUrl.replace('/upload/', `/upload/${transforms.join(',')}/`);
      }
    }

    return cdnUrl;
  }

  // 3. Fallback: use local file until uploaded and recorded in manifest
  return normalizedPath;
}

export default getMediaUrl;
