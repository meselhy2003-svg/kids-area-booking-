/**
 * Image API Service
 * 
 * Implements the API integration for Apidog specification:
 * - GET /media/page/{page_name} - Fetches image filenames by page
 * - POST /upload-image          - Uploads new image via multipart/form-data
 * - Helper utilities for URL prepending, dummy string filtering, and error handling.
 */

// Environment variable configuration with safe fallbacks
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
export const IMAGE_BASE_URL = (
  import.meta.env.VITE_IMAGE_BASE_URL || 
  (API_BASE_URL ? `${API_BASE_URL}/media` : '/media')
).replace(/\/+$/, '');

// Known dummy / test strings and invalid patterns to filter out
const JUNK_STRING_PATTERNS = [
  /fjlsgjgh/i,
  /^undefined$/i,
  /^null$/i,
  /^\[object /i,
  /testdummy/i
];

// Valid image extensions regex
const VALID_IMAGE_EXTENSION_REGEX = /\.(jpe?g|png|webp|svg|gif|avif)($|\?)/i;

/**
 * Validates whether a given string is a legitimate image filename or path.
 * Filters out invalid dummy strings (e.g. "fjlsgjghlsjflgsjfg") and non-image strings.
 * 
 * @param {string} filename - Candidate image filename or path
 * @returns {boolean} True if the string is a valid image file
 */
export const isValidImageFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return false;

  const trimmed = filename.trim();
  if (trimmed.length < 4) return false;

  // Filter out known junk/dummy test strings
  for (const pattern of JUNK_STRING_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }

  // Base64 data URIs and object blob URLs are valid images
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
    return true;
  }

  // Strip query strings or trailing parameters before checking extension
  const pathOnly = trimmed.split('?')[0].split('#')[0];
  return VALID_IMAGE_EXTENSION_REGEX.test(pathOnly);
};

/**
 * Prepends the backend Image Base URL (e.g., import.meta.env.VITE_IMAGE_BASE_URL)
 * to a filename when binding it to the <img src={...} /> attribute.
 * Safely handles trailing/leading slashes, encoding spaces, and existing URLs.
 * 
 * @param {string} filename - Image filename returned by the API (e.g., "media-123.jpeg")
 * @returns {string} Fully qualified image URL for the <img> tag
 */
export const getImageUrl = (filename) => {
  if (!filename || typeof filename !== 'string') return '';

  let clean = filename.trim();

  // If already an absolute http/https URL, return it directly
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    // If it contains localhost:9500 (internal dev port), convert to proxy or configured IMAGE_BASE_URL
    if (/^https?:\/\/(localhost|127\.0\.0\.1):9500/i.test(clean)) {
      clean = clean.replace(/^https?:\/\/(localhost|127\.0\.0\.1):9500\/?(media\/)?/i, '');
    } else {
      return clean;
    }
  }

  // If already a data URI or blob URL, return as-is
  if (clean.startsWith('data:') || clean.startsWith('blob:') || clean.startsWith('/assets/') || clean.startsWith('/photo/')) {
    return clean;
  }

  // Strip accidental leading slashes and redundant 'media/' prefixes
  clean = clean.replace(/^\/+/, '');
  if (clean.startsWith('media/')) {
    clean = clean.substring(6).replace(/^\/+/, '');
  }

  // Safely encode filename URI (handles spaces and special characters)
  const encodedFilename = encodeURI(clean);

  // In local browser development, leverage Vite /media proxy to prevent CORS and ngrok interstitial blocks
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost) {
    return `/media/${encodedFilename}`;
  }

  // Otherwise prepend configured VITE_IMAGE_BASE_URL
  const base = IMAGE_BASE_URL || '/media';
  return `${base}/${encodedFilename}`;
};

/**
 * Normalizes raw API response into a clean array of valid image filenames.
 * Handles arrays, objects, nested keys, and filters out dummy strings.
 * 
 * @param {any} rawData - Data payload from the API
 * @returns {string[]} Array of verified image filenames
 */
export const extractValidFilenames = (rawData) => {
  if (!rawData) return [];

  let candidates = [];

  if (Array.isArray(rawData)) {
    candidates = rawData;
  } else if (typeof rawData === 'object') {
    if (Array.isArray(rawData.images)) {
      candidates = rawData.images;
    } else if (Array.isArray(rawData.data)) {
      candidates = rawData.data;
    } else if (rawData.data && Array.isArray(rawData.data.images)) {
      candidates = rawData.data.images;
    } else if (typeof rawData.image === 'string') {
      candidates = [rawData.image];
    } else if (typeof rawData.filename === 'string') {
      candidates = [rawData.filename];
    } else {
      // Look for any array or string values inside the object
      for (const val of Object.values(rawData)) {
        if (Array.isArray(val)) {
          candidates.push(...val);
        } else if (typeof val === 'string' && isValidImageFilename(val)) {
          candidates.push(val);
        }
      }
    }
  }

  // Flatten nested objects if items are { images: [...] } or { image: '...' }
  const flattened = [];
  for (const item of candidates) {
    if (typeof item === 'string') {
      flattened.push(item);
    } else if (item && typeof item === 'object') {
      if (Array.isArray(item.images)) {
        flattened.push(...item.images);
      } else if (typeof item.image === 'string') {
        flattened.push(item.image);
      } else if (typeof item.url === 'string') {
        flattened.push(item.url);
      } else if (typeof item.filename === 'string') {
        flattened.push(item.filename);
      }
    }
  }

  // Filter out dummy strings and keep only valid image files
  return flattened
    .map(name => (typeof name === 'string' ? name.trim() : ''))
    .filter(isValidImageFilename);
};

/**
 * Fetches images for a specific page from GET /media/page/{page_name}
 * 
 * @param {string} pageName - Page identifier (e.g. 'kids-area', 'hero', 'fun-park', 'home')
 * @returns {Promise<{ success: boolean, filenames: string[], urls: string[], raw?: any, error?: string }>}
 */
export const fetchPageImages = async (pageName = 'kids-area') => {
  const sanitizedPage = encodeURIComponent(String(pageName).trim());

  // Determine endpoint URL:
  // In localhost browser, use relative proxy /api/media/page/... or fallback to API_BASE_URL
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Primary endpoint per Apidog specification: /media/page/{page_name}
  const endpoint = isLocalhost 
    ? `/api/media/page/${sanitizedPage}`
    : `${API_BASE_URL || ''}/media/page/${sanitizedPage}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      // If /api/media/page/... returned 404, also try alternative endpoint /api/media/section/...
      if (response.status === 404 && isLocalhost) {
        const altEndpoint = `/api/media/section/${sanitizedPage}`;
        const altRes = await fetch(altEndpoint, {
          method: 'GET',
          headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
        });
        if (altRes.ok) {
          const altJson = await altRes.json();
          const validFilenames = extractValidFilenames(altJson);
          return {
            success: true,
            filenames: validFilenames,
            urls: validFilenames.map(getImageUrl),
            raw: altJson
          };
        }
      }

      throw new Error(`Server returned HTTP ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    console.log(`[imageApiService.fetchPageImages] "${pageName}" raw data:`, data);
    const filenames = extractValidFilenames(data);
    const urls = filenames.map(getImageUrl);
    console.log(`[imageApiService.fetchPageImages] "${pageName}" extracted filenames and urls:`, { filenames, urls });

    return {
      success: true,
      filenames,
      urls,
      raw: data
    };
  } catch (error) {
    console.error(`[ImageApiService] Error fetching images for page "${pageName}":`, error);
    return {
      success: false,
      filenames: [],
      urls: [],
      error: error.message || 'Failed to fetch images from server'
    };
  }
};

/**
 * Uploads an image using the POST /upload-image endpoint with FormData.
 * 
 * @param {object} options
 * @param {File} options.file - The image file to upload
 * @param {string} [options.pageName='kids-area'] - The page name category
 * @param {string} [options.section='hero'] - Target section within the page
 * @param {string} [options.name] - Optional display name or description
 * @returns {Promise<{ success: boolean, data?: any, filename?: string, imageUrl?: string, error?: string }>}
 */
export const uploadImage = async ({ file, pageName = 'kids-area', section = 'hero', name = '' }) => {
  if (!file) {
    return { success: false, error: 'No image file was provided for upload.' };
  }

  // Prepare standard FormData payload
  const formData = new FormData();
  
  // Apidog specification field keys
  formData.append('image', file);       // Primary standard key for POST /upload-image
  formData.append('images', file);      // Backward compatibility key
  formData.append('file', file);        // Common multipart file key
  formData.append('page', pageName);    // Page category
  formData.append('page_name', pageName);
  formData.append('section', section);
  formData.append('name', name || file.name);

  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Primary endpoint per requirement: POST /upload-image
  // In development, Vite proxy directs /upload-image to remote server
  const primaryEndpoint = isLocalhost ? '/upload-image' : `${API_BASE_URL || ''}/upload-image`;

  try {
    let response = await fetch(primaryEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'ngrok-skip-browser-warning': 'true'
        // NOTE: Do NOT set 'Content-Type': multipart/form-data manually,
        // the browser must set it with the correct multipart boundary!
      }
    });

    // If primary endpoint returns 404, fallback to /api/media (which is also supported by the backend)
    if (!response.ok && (response.status === 404 || response.status === 405)) {
      const fallbackEndpoint = isLocalhost ? '/api/media' : `${API_BASE_URL || ''}/api/media`;
      response = await fetch(fallbackEndpoint, {
        method: 'POST',
        body: formData,
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Upload failed with HTTP ${response.status}: ${errText || response.statusText}`);
    }

    const data = await response.json();
    console.log('[imageApiService.uploadImage] upload response data:', data);

    // Extract newly created filename from response if returned
    let newFilename = '';
    const extracted = extractValidFilenames(data);
    if (extracted.length > 0) {
      newFilename = extracted[0];
    } else if (file.name && isValidImageFilename(file.name)) {
      newFilename = file.name;
    }

    return {
      success: true,
      data,
      filename: newFilename,
      imageUrl: newFilename ? getImageUrl(newFilename) : ''
    };
  } catch (error) {
    console.error('[ImageApiService] Upload error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred while uploading the image.'
    };
  }
};
