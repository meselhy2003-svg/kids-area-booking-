/**
 * Media, Banner & Gallery API Service
 * 
 * Provides:
 * 1. Functions to get and manage media by page (`getPageMedia`, `getAllPagesMedia`).
 * 2. Exported page keys (`PAGE_MEDIA_KEYS`) and pre-structured default media data (`pageMediaData`).
 * 3. Connection to Backend API: https://backend-ados.vercel.app
 * 4. Stale-while-revalidate persistent caching, image preloading, and robust offline fallback.
 */

import { apiClient, API_BASE_URL } from './apiClient';
import { mediaCache, MEDIA_CACHE_KEYS } from './mediaCache';
import { 
  heroBannerSlides, 
  vibesGallery, 
  playzoneVibesImages, 
  ultimateDestinationImages,
  kidsAreaHeroBanners,
  exploreKidsAreaImages,
  funParkHeroBanners,
  exploreFunParkImages,
  challengeHeroBanners,
  exploreChallengeImages,
  adventureHeroBanners,
  exploreAdventureImages,
  eventsHeroBanners,
  vibesEventsImages,
  virtualTourData
} from '../data/mock/media.mock';

/**
 * Standardized Page Media Keys
 * Use these constants across the application to query media by page.
 */
export const PAGE_MEDIA_KEYS = {
  HOME: 'home',
  KIDS_AREA: 'kids-area',
  FUN_PARK: 'fun-park',
  CHALLENGE: 'challenge',
  ADVENTURE: 'adventure',
  EVENTS: 'events',
  TRIPS: 'trips',
  ABOUT: 'about',
  PACKAGE: 'package',
  RESTAURANT: 'restaurant'
};

/**
 * Common Aliases & Route Names mapped to Canonical PAGE_MEDIA_KEYS
 */
export const PAGE_KEY_ALIASES = {
  'home': PAGE_MEDIA_KEYS.HOME,
  'kids': PAGE_MEDIA_KEYS.KIDS_AREA,
  'kids-area': PAGE_MEDIA_KEYS.KIDS_AREA,
  'kidsarea': PAGE_MEDIA_KEYS.KIDS_AREA,
  'fun': PAGE_MEDIA_KEYS.FUN_PARK,
  'fun-park': PAGE_MEDIA_KEYS.FUN_PARK,
  'funpark': PAGE_MEDIA_KEYS.FUN_PARK,
  'funzone': PAGE_MEDIA_KEYS.FUN_PARK,
  'fun-zone': PAGE_MEDIA_KEYS.FUN_PARK,
  'hero': PAGE_MEDIA_KEYS.KIDS_AREA, // Apidog default documentation example: page name 'hero'
  'challenge': PAGE_MEDIA_KEYS.CHALLENGE,
  'adventure': PAGE_MEDIA_KEYS.ADVENTURE,
  'events': PAGE_MEDIA_KEYS.EVENTS,
  'trips': PAGE_MEDIA_KEYS.TRIPS,
  'about': PAGE_MEDIA_KEYS.ABOUT,
  'package': PAGE_MEDIA_KEYS.PACKAGE,
  'packages': PAGE_MEDIA_KEYS.PACKAGE,
  'restaurant': PAGE_MEDIA_KEYS.RESTAURANT,
  'cafe': PAGE_MEDIA_KEYS.RESTAURANT,
  'dining': PAGE_MEDIA_KEYS.RESTAURANT,
  'restaurant-cafe': PAGE_MEDIA_KEYS.RESTAURANT
};

/**
 * Checks if a string is a valid uploaded image filename or URL (filters out junk test text)
 */
export const isValidImageFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return false;
  const s = filename.trim().toLowerCase();
  // Filter out dummy/junk strings
  if (s.includes('fjlsgjgh') || s.includes('undefined') || s.includes('null')) return false;
  // Local project assets and data URIs
  if (s.startsWith('data:image/') || s.startsWith('blob:') || s.startsWith('/photo/') || s.startsWith('/assets/')) return true;
  // Any string ending in a known image format
  if (/\.(jpg|jpeg|png|webp|svg|gif|avif)($|\?)/i.test(s)) return true;
  // Strip host part and recheck
  const clean = s.replace(/^https?:\/\/[^/]+/i, '');
  return /\.(jpg|jpeg|png|webp|svg|gif|avif)($|\?)/i.test(clean);
};

/**
 * Normalizes any page identifier into a canonical PAGE_MEDIA_KEY
 */
export const normalizePageKey = (key = '') => {
  if (!key) return PAGE_MEDIA_KEYS.HOME;
  const cleaned = String(key).toLowerCase().trim().replace(/_/g, '-');
  return PAGE_KEY_ALIASES[cleaned] || cleaned;
};

/**
 * Resolves any image identifier (file name from backend, local asset path, external URL)
 * into a fully-qualified browser accessible URL.
 * Resolves any image identifier (file name from backend, local asset path, external URL)
 * into a fully-qualified browser accessible URL.
 */
export const resolveImageUrl = (img) => {
  if (!img) return '';
  if (typeof img === 'object') {
    if (img.image) img = img.image;
    else if (img.src) img = img.src;
    else if (img.url) img = img.url;
    else if (Array.isArray(img.images) && img.images.length > 0) img = img.images[0];
    else if (typeof img.images === 'string') img = img.images;
  }
  if (!img || typeof img !== 'string') return '';
  let trimmed = img.trim();

  // 3. Local bundled public assets or data URLs
  if (
    trimmed.startsWith('data:') || 
    trimmed.startsWith('blob:') || 
    trimmed.startsWith('/photo/') || 
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('/public/')
  ) {
    return trimmed;
  }

  // 4. External third-party hosted URLs (Cloudinary, Unsplash, etc.)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // 5. Backend static uploaded files under /media/<encodedFilename>
  let cleanPath = trimmed.replace(/^\/+/, '');
  if (cleanPath.startsWith('media/')) {
    cleanPath = cleanPath.substring(6);
  }

  // In local browser development, leverage Vite /media proxy
  const encoded = encodeURI(cleanPath);
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return `/media/${encoded}`;
  }

  const cleanBase = (API_BASE_URL || '').replace(/\/+$/, '');
  return `${cleanBase}/media/${encoded}`;
};

/**
 * Uploads an image to the backend via POST /api/media (as per Apidog specification)
 * 
 * @param {object} params
 * @param {File|Blob} params.file - The image file
 * @param {string} params.page - Target page ('kids-area', 'fun-park', 'home', etc.)
 * @param {string} params.section - Target section ('hero', 'explore', 'vibes', etc.)
 * @param {string} params.name - Descriptive name of the image
 * @returns {Promise<{ success: boolean, data?: object, error?: string, imageUrl?: string }>}
 */
export const uploadMediaImage = async ({ file, page = 'kids-area', section = 'hero', name = '' }) => {
  if (!file) {
    return { success: false, error: 'Please select an image file to upload.' };
  }

  try {
    const formData = new FormData();
    formData.append('images', file);
    formData.append('page', page);
    formData.append('section', section);
    formData.append('name', name || file.name || 'Uploaded Image');

    const res = await apiClient.upload('/api/media', formData);

    if (res && res.success && res.data) {
      const item = res.data.data !== undefined ? res.data.data : res.data;
      const normKey = normalizePageKey(page);

      // Invalidate relevant cache entries
      mediaCache.remove(`${MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX}${normKey}`);
      mediaCache.remove(`${MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX}images_${normKey}`);
      if (normKey === PAGE_MEDIA_KEYS.KIDS_AREA) {
        mediaCache.remove(MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS);
        mediaCache.remove(MEDIA_CACHE_KEYS.EXPLORE_KIDS_AREA);
      } else if (normKey === PAGE_MEDIA_KEYS.FUN_PARK) {
        mediaCache.remove(MEDIA_CACHE_KEYS.FUNPARK_HERO_BANNERS);
        mediaCache.remove(MEDIA_CACHE_KEYS.EXPLORE_FUN_PARK);
      } else if (normKey === PAGE_MEDIA_KEYS.CHALLENGE) {
        mediaCache.remove(MEDIA_CACHE_KEYS.CHALLENGE_HERO_BANNERS);
        mediaCache.remove(MEDIA_CACHE_KEYS.EXPLORE_CHALLENGE);
      } else if (normKey === PAGE_MEDIA_KEYS.ADVENTURE) {
        mediaCache.remove(MEDIA_CACHE_KEYS.ADVENTURE_HERO_BANNERS);
        mediaCache.remove(MEDIA_CACHE_KEYS.EXPLORE_ADVENTURE);
      } else if (normKey === PAGE_MEDIA_KEYS.EVENTS) {
        mediaCache.remove(MEDIA_CACHE_KEYS.EVENTS_HERO_BANNERS);
        mediaCache.remove(MEDIA_CACHE_KEYS.VIBES_EVENTS);
      } else if (normKey === PAGE_MEDIA_KEYS.HOME) {
        mediaCache.remove(MEDIA_CACHE_KEYS.DESTINATION_IMAGES);
        mediaCache.remove(MEDIA_CACHE_KEYS.PLAYZONE_VIBES);
      }

      // Re-fetch page media in background
      await mediaService.refreshZone(normKey);

      // Dispatch global events for instant reactive UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('media_updated', {
          detail: { page, section, item }
        }));
      }

      const rawImg = Array.isArray(item.images) ? item.images[0] : item.images;
      return {
        success: true,
        data: item,
        imageUrl: resolveImageUrl(rawImg)
      };
    }

    return {
      success: false,
      error: res?.error || (res?.data?.message) || 'Failed to upload image'
    };
  } catch (err) {
    console.error('[mediaService.uploadMediaImage] error:', err);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Deletes an uploaded image from backend via DELETE /api/media/:id
 */
export const deleteMediaImage = async (mediaId, page = '', section = '') => {
  if (!mediaId) {
    return { success: false, error: 'Media ID required for deletion.' };
  }

  try {
    const res = await apiClient.delete(`/api/media/${mediaId}`);
    if (res && res.success) {
      if (page) {
        const normKey = normalizePageKey(page);
        mediaCache.remove(`${MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX}${normKey}`);
        mediaCache.remove(`${MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX}images_${normKey}`);
        await mediaService.refreshZone(normKey);
      } else {
        mediaService.clearMediaCache();
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('media_updated', {
          detail: { mediaId, page, section, deleted: true }
        }));
      }

      return { success: true, data: res.data };
    }
    return { success: false, error: res?.error || 'Failed to delete image' };
  } catch (err) {
    console.error('[mediaService.deleteMediaImage] error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Gets media for a page directly from the backend /api/media/page/:page with robust fallback
 */
export const getMediaByPage = async (pageName) => {
  try {
    if (pageName === 'all') {
      const endpoints = [
        '/api/media/section/hero',
        '/api/media/section/explore',
        '/api/media/section/vibes',
        '/api/media/page/kids-area',
        '/api/media/page/hero',
        '/api/media/page/Home',
        '/api/media/page/home',
        '/api/media/page/funzone',
        '/api/media/page/fun-park',
        '/api/media/page/challenge',
        '/api/media/page/adventure',
        '/api/media/page/events'
      ];
      const results = await Promise.allSettled(
        endpoints.map(ep => apiClient.get(ep))
      );
      const allItems = [];
      const seen = new Set();
      results.forEach(r => {
        if (r.status === 'fulfilled' && r.value && r.value.success && r.value.data) {
          const list = Array.isArray(r.value.data) ? r.value.data : (Array.isArray(r.value.data.data) ? r.value.data.data : []);
          list.forEach(item => {
            if (item && item._id && !seen.has(item._id)) {
              seen.add(item._id);
              const rawImgs = Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []);
              const validImgs = rawImgs.filter(isValidImageFilename);
              if (validImgs.length > 0) {
                allItems.push({
                  ...item,
                  images: validImgs,
                  imageUrl: resolveImageUrl(validImgs[0])
                });
              }
            }
          });
        }
      });
      return allItems;
    }

    const normKey = normalizePageKey(pageName);
    const res = await apiClient.get(`/api/media/page/${encodeURIComponent(normKey)}`);
    const all = [];
    const seen = new Set();
    if (res && res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
        list.forEach(item => {
          if (item && item._id && !seen.has(item._id)) {
            seen.add(item._id);
            const rawImgs = Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []);
            const validImgs = rawImgs.filter(isValidImageFilename);
            if (validImgs.length > 0) {
              all.push({
                ...item,
                images: validImgs,
                imageUrl: resolveImageUrl(validImgs[0])
              });
            }
          }
        });
      }
    return all;
  } catch (err) {
    console.warn('[mediaService.getMediaByPage] error:', err);
    return [];
  }
};

/**
 * Gets media for a section directly from backend /api/media/section/:section
 */
export const getMediaBySection = async (sectionName) => {
  try {
    const res = await apiClient.get(`/api/media/section/${encodeURIComponent(sectionName)}`);
    if (res && res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
      const valid = [];
      list.forEach(item => {
        const rawImgs = Array.isArray(item.images) ? item.images : (item.images ? [item.images] : []);
        const validImgs = rawImgs.filter(isValidImageFilename);
        if (validImgs.length > 0) {
          valid.push({
            ...item,
            images: validImgs,
            imageUrl: resolveImageUrl(validImgs[0])
          });
        }
      });
      return valid;
    }
    return [];
  } catch (err) {
    console.warn('[mediaService.getMediaBySection] error:', err);
    return [];
  }
};

/**
 * Pre-structured default media data organized by page key.
 * Can be imported directly for zero-latency default rendering.
 */
export const DEFAULT_PAGE_MEDIA = {
  [PAGE_MEDIA_KEYS.HOME]: {
    page: PAGE_MEDIA_KEYS.HOME,
    heroBanners: heroBannerSlides['kids-area'],
    ultimateDestination: ultimateDestinationImages,
    vibes: playzoneVibesImages,
    vibesGallery: vibesGallery,
    virtualTour: virtualTourData
  },
  [PAGE_MEDIA_KEYS.KIDS_AREA]: {
    page: PAGE_MEDIA_KEYS.KIDS_AREA,
    heroBanners: kidsAreaHeroBanners,
    explore: exploreKidsAreaImages
  },
  [PAGE_MEDIA_KEYS.FUN_PARK]: {
    page: PAGE_MEDIA_KEYS.FUN_PARK,
    heroBanners: funParkHeroBanners,
    explore: exploreFunParkImages
  },
  [PAGE_MEDIA_KEYS.CHALLENGE]: {
    page: PAGE_MEDIA_KEYS.CHALLENGE,
    heroBanners: challengeHeroBanners,
    explore: exploreChallengeImages
  },
  [PAGE_MEDIA_KEYS.ADVENTURE]: {
    page: PAGE_MEDIA_KEYS.ADVENTURE,
    heroBanners: adventureHeroBanners,
    explore: exploreAdventureImages
  },
  [PAGE_MEDIA_KEYS.EVENTS]: {
    page: PAGE_MEDIA_KEYS.EVENTS,
    heroBanners: eventsHeroBanners,
    vibes: vibesEventsImages
  },
  [PAGE_MEDIA_KEYS.TRIPS]: {
    page: PAGE_MEDIA_KEYS.TRIPS,
    heroBanner: {
      id: 'trips-hero',
      src: '/photo/kid area pic/trip hero.png',
      image: '/photo/kid area pic/trip hero.png',
      alt: 'American Dream Trips'
    },
    images: [
      { id: 'trip-1', src: '/photo/kid area pic/trip hero.png' }
    ]
  },
  [PAGE_MEDIA_KEYS.ABOUT]: {
    page: PAGE_MEDIA_KEYS.ABOUT,
    heroBanner: {
      id: 'about-hero',
      src: '/photo/kid area pic/Hero Background with warm cinematic overlay (about us ).png',
      image: '/photo/kid area pic/Hero Background with warm cinematic overlay (about us ).png',
      alt: 'American Dream About Us'
    },
    gallery: [
      { id: 'about-1', src: '/photo/kid area pic/Image (1).png' },
      { id: 'about-2', src: '/photo/kid area pic/Image (2).png' },
      { id: 'about-3', src: '/photo/kid area pic/trip hero.png' },
      { id: 'about-4', src: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png' }
    ]
  },
  [PAGE_MEDIA_KEYS.PACKAGE]: {
    page: PAGE_MEDIA_KEYS.PACKAGE,
    heroBanner: {
      id: 'packages-hero',
      src: '/photo/kid-area-pic/packages-hero-trio.png',
      image: '/photo/kid-area-pic/packages-hero-trio.png',
      fallbackSrc: '/photo/kid-area-pic/Photo 3_ VR Arena Friends.png',
      alt: 'American Dream Packages'
    },
    promoBanner: {
      id: 'packages-promo',
      src: '/photo/kid-area-pic/Graphic Composition.png',
      fallbackSrc: '/photo/mobile-challenge/offer-collage.png',
      alt: 'Packages Promo'
    }
  },
  [PAGE_MEDIA_KEYS.RESTAURANT]: {
    page: PAGE_MEDIA_KEYS.RESTAURANT,
    heroBanner: {
      id: 'restaurant-hero',
      src: '/photo/kid area pic/Hero Background Image with DataStore Placeholder.png',
      image: '/photo/kid area pic/Hero Background Image with DataStore Placeholder.png',
      fallbackSrc: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      title: 'Good food. Great moments.',
      titleAr: 'طعام رائع. لحظات لا تُنسى.',
      subtitle: 'Enjoy delicious food, your favorite drinks, and a relaxing waterfront atmosphere at American Dream Ismailia',
      subtitleAr: 'استمتع بأشهى المأكولات، ومشروباتك المفضلة، وأجواء الواجهة المائية الهادئة في أمريكان دريم الإسماعيلية'
    },
    delivery: {
      id: 'rest-delivery',
      src: '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png',
      title: 'Delivery',
      titleAr: 'خدمة التوصيل'
    },
    inPark: {
      id: 'rest-in-park',
      src: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
      fallbackSrc: '/photo/kid area pic/mosaic-card-2.png',
      title: 'Order at American Dream',
      titleAr: 'الطلب داخل أمريكان دريم'
    },
    bookTable: {
      id: 'rest-book-table',
      src: '/photo/kid area pic/Item 2_ Vertical Dining & Floral Setup.png',
      fallbackSrc: '/photo/kid area pic/American Dream Ismailia luxury event hall architecture setup.png',
      title: 'Book a Table',
      titleAr: 'حجز طاولة'
    },
    vibes: [
      {
        id: 'vibes-1',
        src: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
        title: 'Sunset Dinner Terrace',
        titleAr: 'تراس العشاء عند الغروب'
      },
      {
        id: 'vibes-2',
        src: '/photo/kid area pic/Item 2_ Vertical Dining & Floral Setup.png',
        title: 'Waterfront Floral Banquets',
        titleAr: 'جلسات الواجهة المائية الراقية'
      },
      {
        id: 'vibes-3',
        src: '/photo/kid area pic/Freshly grilled brioche cheeseburger with crispy shoestring fries and artisanal dip in craft takeaway presentation.png',
        title: 'Artisanal Brioche Burger',
        titleAr: 'برجر البريوش الفاخر'
      },
      {
        id: 'vibes-4',
        src: '/photo/kid area pic/mosaic-card-2.png',
        title: 'Family Gathering & Laughter',
        titleAr: 'لمّة العائلة والضحكة الحلوة'
      },
      {
        id: 'vibes-5',
        src: '/photo/kid area pic/Image (1).png',
        fallbackSrc: '/photo/kid area pic/Canal-side sunset dinner terrace with warm string lights, dining tables, grilled meats, salads, and sparkling water.png',
        title: 'Seaside Coffee & Mocktails',
        titleAr: 'قهوة وعصائر على نسيم القناة'
      }
    ]
  }
};

/**
 * Direct export for easy import of all page media data and keys
 */
export const pageMediaData = DEFAULT_PAGE_MEDIA;

/**
 * Synchronously retrieves cached page media or instant fallback
 */
export const getCachedPageMedia = (pageKey) => {
  const normKey = normalizePageKey(pageKey);
  const cacheKey = `${MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX}${normKey}`;
  const defaultData = DEFAULT_PAGE_MEDIA[normKey] || { page: normKey };

  const cachedPage = mediaCache.get(cacheKey, null);
  if (cachedPage) {
    return cachedPage;
  }

  // Construct from sub-keys if page composite key not populated yet
  switch (normKey) {
    case PAGE_MEDIA_KEYS.HOME:
      return {
        page: PAGE_MEDIA_KEYS.HOME,
        heroBanners: mediaCache.get(MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS, kidsAreaHeroBanners),
        ultimateDestination: mediaCache.get(MEDIA_CACHE_KEYS.DESTINATION_IMAGES, ultimateDestinationImages),
        vibes: mediaCache.get(MEDIA_CACHE_KEYS.PLAYZONE_VIBES, playzoneVibesImages),
        vibesGallery: mediaService.distributeVibesIntoColumns(mediaCache.get(MEDIA_CACHE_KEYS.PLAYZONE_VIBES, playzoneVibesImages)),
        virtualTour: virtualTourData
      };
    case PAGE_MEDIA_KEYS.KIDS_AREA:
      return {
        page: PAGE_MEDIA_KEYS.KIDS_AREA,
        heroBanners: mediaCache.get(MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS, kidsAreaHeroBanners),
        explore: mediaCache.get(MEDIA_CACHE_KEYS.EXPLORE_KIDS_AREA, exploreKidsAreaImages)
      };
    case PAGE_MEDIA_KEYS.FUN_PARK:
      return {
        page: PAGE_MEDIA_KEYS.FUN_PARK,
        heroBanners: mediaCache.get(MEDIA_CACHE_KEYS.FUNPARK_HERO_BANNERS, funParkHeroBanners),
        explore: mediaCache.get(MEDIA_CACHE_KEYS.EXPLORE_FUN_PARK, exploreFunParkImages)
      };
    case PAGE_MEDIA_KEYS.CHALLENGE:
      return {
        page: PAGE_MEDIA_KEYS.CHALLENGE,
        heroBanners: mediaCache.get(MEDIA_CACHE_KEYS.CHALLENGE_HERO_BANNERS, challengeHeroBanners),
        explore: mediaCache.get(MEDIA_CACHE_KEYS.EXPLORE_CHALLENGE, exploreChallengeImages)
      };
    case PAGE_MEDIA_KEYS.ADVENTURE:
      return {
        page: PAGE_MEDIA_KEYS.ADVENTURE,
        heroBanners: mediaCache.get(MEDIA_CACHE_KEYS.ADVENTURE_HERO_BANNERS, adventureHeroBanners),
        explore: mediaCache.get(MEDIA_CACHE_KEYS.EXPLORE_ADVENTURE, exploreAdventureImages)
      };
    case PAGE_MEDIA_KEYS.EVENTS:
      return {
        page: PAGE_MEDIA_KEYS.EVENTS,
        heroBanners: mediaCache.get(MEDIA_CACHE_KEYS.EVENTS_HERO_BANNERS, eventsHeroBanners),
        vibes: mediaCache.get(MEDIA_CACHE_KEYS.VIBES_EVENTS, vibesEventsImages)
      };
    case PAGE_MEDIA_KEYS.RESTAURANT:
      return DEFAULT_PAGE_MEDIA[PAGE_MEDIA_KEYS.RESTAURANT];
    default:
      return defaultData;
  }
};

/**
 * Fetch media for a specific page from backend API with automatic cache & fallback
 * 
 * @param {string} pageKey - e.g. 'home', 'kids-area', 'fun-park', 'challenge', 'adventure', 'events', 'trips', 'about', 'package'
 * @param {object} [options] - Optional settings ({ forceRefresh, endpoint })
 * @returns {Promise<object>} Page media data object
 */
export const getPageMedia = async (pageKey, options = {}) => {
  const normKey = normalizePageKey(pageKey);
  const cacheKey = `${MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX}${normKey}`;
  const cached = getCachedPageMedia(normKey);
  const { forceRefresh = false, endpoint } = options;

  try {
    let res = null;
    if (endpoint) {
      res = await apiClient.get(endpoint);
    } else {
      // Direct database endpoint: /api/media/page/:page
      res = await apiClient.get(`/api/media/page/${encodeURIComponent(normKey)}`);
    }

    if (res && res.success && res.data) {
      const serverPayload = res.data.data !== undefined ? res.data.data : res.data;
      
      let updatedPage = { ...cached };
      if (Array.isArray(serverPayload)) {
        const heroItems = serverPayload.filter(it => !it.section || it.section.toLowerCase() === 'hero');
        const exploreItems = serverPayload.filter(it => it.section && (it.section.toLowerCase() === 'explore' || it.section.toLowerCase() === 'games'));
        const vibeItems = serverPayload.filter(it => it.section && (it.section.toLowerCase() === 'vibes' || it.section.toLowerCase() === 'gallery'));
        const destItems = serverPayload.filter(it => it.section && it.section.toLowerCase() === 'destination');

        const mapToHero = (it) => {
          const imgUrl = resolveImageUrl(Array.isArray(it.images) ? it.images[0] : it.images);
          return {
            id: it._id,
            _id: it._id,
            name: it.name,
            title: it.name,
            titleAr: it.name,
            titleEn: it.name,
            subtitle: it.name,
            subtitleAr: it.name,
            subtitleEn: it.name,
            image: imgUrl,
            src: imgUrl,
            badge: 'Live',
            badgeAr: 'مرفوع',
            badgeEn: 'Live',
            isServerUploaded: true
          };
        };

        const mapToItem = (it) => {
          const imgUrl = resolveImageUrl(Array.isArray(it.images) ? it.images[0] : it.images);
          return {
            id: it._id,
            _id: it._id,
            name: it.name,
            title: it.name,
            titleAr: it.name,
            titleEn: it.name,
            image: imgUrl,
            src: imgUrl,
            isServerUploaded: true
          };
        };

        if (heroItems.length > 0) {
          const mappedHeroes = heroItems.map(mapToHero);
          updatedPage.heroBanners = [...mappedHeroes, ...(cached.heroBanners || [])];
        }

        if (exploreItems.length > 0) {
          const mappedExplore = exploreItems.map(mapToItem);
          updatedPage.explore = [...mappedExplore, ...(cached.explore || [])];
        }

        if (vibeItems.length > 0) {
          const mappedVibes = vibeItems.map(mapToItem);
          updatedPage.vibes = [...mappedVibes, ...(cached.vibes || [])];
          updatedPage.vibesGallery = mediaService.distributeVibesIntoColumns(updatedPage.vibes);
        }

        if (destItems.length > 0) {
          const mappedDest = destItems.map(mapToItem);
          updatedPage.ultimateDestination = [...mappedDest, ...(cached.ultimateDestination || [])].slice(0, 4);
        }
      } else if (typeof serverPayload === 'object' && serverPayload !== null) {
        updatedPage = {
          ...cached,
          ...serverPayload,
          page: normKey
        };
      }

      // Preload images into browser memory
      mediaCache.preloadImages(updatedPage);

      // Save to cache
      mediaCache.set(cacheKey, updatedPage, 'server');
      console.log(`[mediaService.getPageMedia] Live media data for "${normKey}":`, updatedPage);
      return updatedPage;
    }

    console.log(`[mediaService.getPageMedia] Cached fallback data for "${normKey}":`, cached);
    return cached;
  } catch (err) {
    console.warn(`[mediaService.getPageMedia] fallback for ${normKey}:`, err.message);
    return cached;
  }
};

/**
 * Fetch media for ALL pages from backend API with automatic caching & fallback
 * 
 * @param {object} [options] - Optional settings ({ forceRefresh, endpoint })
 * @returns {Promise<object>} Dictionary mapping each page key to its media object
 */
export const getAllPagesMedia = async (options = {}) => {
  const { forceRefresh = false, endpoint } = options;

  try {
    // 1. Attempt unified API endpoint
    const unifiedEndpoint = endpoint || '/api/media/all';
    const res = await apiClient.get(unifiedEndpoint);

    if (res && res.success && res.data && typeof res.data === 'object') {
      const serverPages = res.data.data !== undefined ? res.data.data : res.data;
      const result = {};

      for (const [key, pageData] of Object.entries(serverPages)) {
        const normKey = normalizePageKey(key);
        const cacheKey = `${MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX}${normKey}`;
        const cached = getCachedPageMedia(normKey);
        const merged = { ...cached, ...(typeof pageData === 'object' ? pageData : {}) };
        
        mediaCache.set(cacheKey, merged, 'server');
        result[normKey] = merged;
      }

      // Ensure every canonical key exists
      Object.values(PAGE_MEDIA_KEYS).forEach((k) => {
        if (!result[k]) {
          result[k] = getCachedPageMedia(k);
        }
      });

      mediaCache.preloadImages(result);
      return result;
    }
  } catch (e) {
    console.warn('[mediaService.getAllPagesMedia] unified fetch fallback:', e.message);
  }

  // 2. Fallback: Fetch each page concurrently
  const pageKeys = Object.values(PAGE_MEDIA_KEYS);
  const results = await Promise.allSettled(
    pageKeys.map(key => getPageMedia(key, { forceRefresh }))
  );

  const pagesMap = {};
  pageKeys.forEach((key, index) => {
    const outcome = results[index];
    pagesMap[key] = outcome.status === 'fulfilled' 
      ? outcome.value 
      : getCachedPageMedia(key);
  });

  return pagesMap;
};

/**
 * Helper to unwrap array payloads from diverse server response shapes
 */
export const extractArrayPayload = (res) => {
  if (!res || !res.success || !res.data) return null;
  if (Array.isArray(res.data)) return res.data;
  if (res.data && typeof res.data === 'object') {
    if (Array.isArray(res.data.data)) return res.data.data;
    if (Array.isArray(res.data.items)) return res.data.items;
    if (Array.isArray(res.data.images)) return res.data.images;
    if (Array.isArray(res.data.banners)) return res.data.banners;
    if (Array.isArray(res.data.slides)) return res.data.slides;
  }
  return null;
};

/**
 * Normalizes any media payload into a flat Array of Objects.
 * Every item in the array is guaranteed to be an object with { id, src, url, title, alt, ... }.
 * 
 * @param {any} data - Raw media payload or page structure
 * @param {string} pageName - Name of the page for IDs and tagging
 * @returns {Array<object>} Flat array of image objects
 */
export const extractImagesAsArrayOfObjects = (rawData, pageName = 'page') => {
  if (!rawData) return [];

  // Unwrap envelope object if passed { data: ... }
  let data = rawData;
  if (data && typeof data === 'object' && !Array.isArray(data) && data.data !== undefined) {
    data = data.data;
  }

  const toImageObject = (item, idx = 0, section = '') => {
    if (!item) return null;

    if (typeof item === 'string') {
      const resolved = resolveImageUrl(item);
      return {
        id: `${pageName}-${section || 'img'}-${idx}`,
        src: resolved,
        url: resolved,
        title: `${pageName} image ${idx + 1}`,
        titleEn: `${pageName} image ${idx + 1}`,
        titleAr: '',
        subtitle: '',
        alt: `${pageName} image ${idx + 1}`,
        page: pageName,
        section: section || 'general'
      };
    }

    if (typeof item === 'object') {
      const rawSrc = item.src || item.image || item.img || item.url || item.mainPanorama || (Array.isArray(item.images) ? item.images[0] : item.images) || '';
      const srcUrl = resolveImageUrl(rawSrc);
      if (!srcUrl && !item.fallbackSrc) return null;

      const fallbackUrl = resolveImageUrl(item.fallbackSrc || item.fallbackImg || item.fallback || null);
      const title = item.name || item.title || item.titleEn || item.alt || '';
      const titleEn = item.titleEn || item.name || item.title || '';
      const titleAr = item.titleAr || item.name || '';
      const subtitle = item.subtitle || item.subtitleEn || item.desc || '';
      const subtitleEn = item.subtitleEn || item.subtitle || item.desc || '';
      const subtitleAr = item.subtitleAr || item.descAr || '';
      const alt = item.alt || title || titleEn || `${pageName} image`;

      return {
        id: item._id ? String(item._id) : (item.id ? String(item.id) : `${pageName}-${section || 'img'}-${idx}`),
        _id: item._id,
        src: srcUrl || fallbackUrl,
        url: srcUrl || fallbackUrl,
        fallbackSrc: fallbackUrl,
        title,
        titleEn,
        titleAr,
        subtitle,
        subtitleEn,
        subtitleAr,
        alt,
        page: pageName,
        section: section || item.section || 'media',
        category: item.category || section || '',
        badge: item.badge || null,
        ...item,
        // Guarantee src & url are resolved strings
        src: srcUrl || fallbackUrl,
        url: srcUrl || fallbackUrl
      };
    }

    return null;
  };

  if (Array.isArray(data)) {
    return data
      .flatMap((item, idx) => {
        if (Array.isArray(item)) {
          return item.map((sub, sIdx) => toImageObject(sub, `${idx}-${sIdx}`, 'gallery'));
        }
        return [toImageObject(item, idx)];
      })
      .filter(Boolean);
  }

  if (typeof data === 'object') {
    const list = [];
    let counter = 0;

    Object.entries(data).forEach(([key, val]) => {
      if (['page', '_source', '_success', 'status', 'message', 'error'].includes(key)) return;

      if (Array.isArray(val)) {
        val.forEach((subItem, sIdx) => {
          if (Array.isArray(subItem)) {
            subItem.forEach((colItem, cIdx) => {
              const obj = toImageObject(colItem, `${key}-${sIdx}-${cIdx}`, key);
              if (obj) list.push(obj);
            });
          } else {
            const obj = toImageObject(subItem, counter++, key);
            if (obj) list.push(obj);
          }
        });
      } else if (val && typeof val === 'object') {
        const obj = toImageObject(val, counter++, key);
        if (obj) list.push(obj);
      }
    });

    return list;
  }

  return [];
};

/**
 * Calls data and fetches API by page name, returning all images as an Array of Objects.
 * 
 * @param {string} pageName - The name of the page (e.g. 'home', 'kids-area', 'fun-park', 'challenge', 'adventure', 'events', 'trips', 'about', 'package')
 * @param {object} [options] - Optional settings ({ forceRefresh, endpoint })
 * @returns {Promise<Array<object>>} The page images formatted as an array of objects
 */
export const getPageImages = async (pageName, options = {}) => {
  const normKey = normalizePageKey(pageName);
  const cacheKey = `${MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX}images_${normKey}`;
  const { forceRefresh = false, endpoint } = options;

  // 1. Check cached array for instant zero-latency return
  if (!forceRefresh) {
    const cachedImages = mediaCache.get(cacheKey, null);
    if (Array.isArray(cachedImages) && cachedImages.length > 0) {
      return cachedImages;
    }
  }

  try {
    let res = null;
    if (endpoint) {
      res = await apiClient.get(endpoint);
    } else {
      // Primary Live Apidog endpoint: /api/media/page/:page
      res = await apiClient.get(`/api/media/page/${encodeURIComponent(normKey)}`);
    }

    if (res && res.success && res.data) {
      const serverPayload = res.data.data !== undefined ? res.data.data : res.data;
      const imagesArray = extractImagesAsArrayOfObjects(serverPayload, normKey);
      console.log(`[mediaService.getPageImages] Live data for "${normKey}":`, imagesArray);

      if (imagesArray.length > 0) {
        mediaCache.preloadImages(imagesArray);
        mediaCache.set(cacheKey, imagesArray, 'server');
        return imagesArray;
      }
    }
  } catch (err) {
    console.warn(`[getPageImages] API fetch fallback for "${normKey}":`, err.message);
  }

  // Fallback: extract images from cached / default page data
  const pageData = getCachedPageMedia(normKey);
  const fallbackImages = extractImagesAsArrayOfObjects(pageData, normKey);
  console.log(`[mediaService.getPageImages] Fallback cached data for "${normKey}":`, fallbackImages);

  if (fallbackImages.length > 0) {
    mediaCache.set(cacheKey, fallbackImages, 'mock');
  }

  return fallbackImages;
};

// Aliases for convenience
export const fetchPageImages = getPageImages;
export const getPageMediaImages = getPageImages;

/**
 * Fetch images for all pages, each returning as an Array of Objects
 * 
 * @param {object} [options] - Optional settings ({ forceRefresh, endpoint })
 * @returns {Promise<object>} Dictionary mapping each page key to its array of image objects
 */
export const getAllPagesImages = async (options = {}) => {
  const pageKeys = Object.values(PAGE_MEDIA_KEYS);
  const results = await Promise.allSettled(
    pageKeys.map(key => getPageImages(key, options))
  );

  const imagesMap = {};
  pageKeys.forEach((key, index) => {
    const outcome = results[index];
    imagesMap[key] = outcome.status === 'fulfilled' 
      ? outcome.value 
      : extractImagesAsArrayOfObjects(getCachedPageMedia(key), key);
  });

  return imagesMap;
};

export const mediaService = {
  // Page Media Core API
  PAGE_MEDIA_KEYS,
  PAGE_KEY_ALIASES,
  DEFAULT_PAGE_MEDIA,
  pageMediaData,
  normalizePageKey,
  getPageMedia,
  getAllPagesMedia,
  getCachedPageMedia,
  getPageImages,
  fetchPageImages,
  getPageMediaImages,
  getAllPagesImages,
  extractImagesAsArrayOfObjects,

  // Live Apidog API Methods
  resolveImageUrl,
  uploadMediaImage,
  deleteMediaImage,
  getMediaByPage,
  getMediaBySection,

  /**
   * Fetches live media items from backend /api/media/page/:page and /api/media/section/:section
   * Fully supports Apidog uploads (e.g. page 'hero', 'Home', 'funzone', etc.)
   */
  async fetchLivePageMediaItems(pageName, sectionName = null) {
    try {
      const normKey = normalizePageKey(pageName);
      const endpoints = [`/api/media/page/${encodeURIComponent(normKey)}`];
      
      if (sectionName) {
        endpoints.push(`/api/media/section/${encodeURIComponent(sectionName)}`);
      }

      const results = await Promise.allSettled(
        endpoints.map(ep => apiClient.get(ep))
      );

      const allRaw = [];
      results.forEach(r => {
        if (r.status === 'fulfilled' && r.value && r.value.success && r.value.data) {
          const list = Array.isArray(r.value.data) ? r.value.data : (Array.isArray(r.value.data.data) ? r.value.data.data : []);
          allRaw.push(...list);
        }
      });

      const seen = new Set();
      const uniqueItems = [];

      for (const it of allRaw) {
        if (!it || !it._id || seen.has(it._id)) continue;
        seen.add(it._id);

        const rawImgs = Array.isArray(it.images) ? it.images : (it.images ? [it.images] : []);
        const validImgs = rawImgs.filter(isValidImageFilename);
        if (validImgs.length === 0) continue;

        if (sectionName) {
          const sLower = sectionName.toLowerCase();
          const itSection = (it.section || '').toLowerCase();
          const itPage = (it.page || '').toLowerCase();

          if (sLower === 'hero') {
            if (itSection === 'hero' || itPage === 'hero' || !itSection) {
              // If item belongs to a different specific zone, don't mix unless it's general hero
              if (itPage && itPage !== 'hero') {
                const normItPage = normalizePageKey(itPage);
                if (normItPage !== normKey && normKey !== PAGE_MEDIA_KEYS.HOME) {
                  continue;
                }
              }
              uniqueItems.push({ ...it, images: validImgs });
            }
          } else if (sLower === 'explore') {
            if (itSection === 'explore' || itSection === 'games') {
              uniqueItems.push({ ...it, images: validImgs });
            }
          } else if (sLower === 'vibes' || sLower === 'gallery') {
            if (itSection === 'vibes' || itSection === 'gallery') {
              uniqueItems.push({ ...it, images: validImgs });
            }
          } else {
            if (itSection === sLower) {
              uniqueItems.push({ ...it, images: validImgs });
            }
          }
        } else {
          uniqueItems.push({ ...it, images: validImgs });
        }
      }

      return uniqueItems;
    } catch {
      return [];
    }
  },

  /**
   * Helper to map live backend media items to hero slide objects, expanding multi-image arrays
   */
  mapLiveItemsToSlides(liveItems, fallbackSubtitle = 'American Dream Park') {
    const mapped = [];
    liveItems.forEach(it => {
      const arr = Array.isArray(it.images) ? it.images : [it.images];
      arr.filter(isValidImageFilename).forEach((filename, fIdx) => {
        const imgUrl = resolveImageUrl(filename);
        mapped.push({
          id: `${it._id}-${fIdx}`,
          _id: it._id,
          title: it.name || 'American Dream',
          titleAr: it.name || 'أمريكان دريم',
          titleEn: it.name || 'American Dream',
          subtitle: fallbackSubtitle,
          subtitleAr: fallbackSubtitle,
          subtitleEn: fallbackSubtitle,
          image: imgUrl,
          src: imgUrl,
          badge: 'Live',
          badgeAr: 'مرفوع',
          badgeEn: 'Live',
          isServerUploaded: true
        });
      });
    });
    return mapped;
  },

  /**
   * Helper to map live backend media items to explore / gallery card objects
   */
  mapLiveItemsToExplore(liveItems) {
    const mapped = [];
    liveItems.forEach(it => {
      const arr = Array.isArray(it.images) ? it.images : [it.images];
      arr.filter(isValidImageFilename).forEach((filename, fIdx) => {
        const imgUrl = resolveImageUrl(filename);
        mapped.push({
          id: `${it._id}-${fIdx}`,
          _id: it._id,
          title: it.name || 'Zone Attraction',
          titleAr: it.name || 'معلم ترفيهي',
          titleEn: it.name || 'Attraction',
          image: imgUrl,
          src: imgUrl,
          isServerUploaded: true
        });
      });
    });
    return mapped;
  },

  /**
   * Refreshes zone data across caches and event listeners
   */
  async refreshZone(normKey) {
    switch (normKey) {
      case PAGE_MEDIA_KEYS.KIDS_AREA:
        await Promise.all([
          this.getKidsHeroBanners(true),
          this.getExploreKidsArea(true)
        ]);
        break;
      case PAGE_MEDIA_KEYS.FUN_PARK:
        await Promise.all([
          this.getFunParkHeroBanners(true),
          this.getExploreFunPark(true)
        ]);
        break;
      case PAGE_MEDIA_KEYS.CHALLENGE:
        await Promise.all([
          this.getChallengeHeroBanners(true),
          this.getExploreChallenge(true)
        ]);
        break;
      case PAGE_MEDIA_KEYS.ADVENTURE:
        await Promise.all([
          this.getAdventureHeroBanners(true),
          this.getExploreAdventure(true)
        ]);
        break;
      case PAGE_MEDIA_KEYS.EVENTS:
        await Promise.all([
          this.getEventsHeroBanners(true),
          this.getVibesEventsImages(true)
        ]);
        break;
      case PAGE_MEDIA_KEYS.HOME:
        await Promise.all([
          this.getUltimateDestinationImages(true),
          this.getPlayzoneVibes(true)
        ]);
        break;
      default:
        await getPageMedia(normKey, { forceRefresh: true });
        break;
    }
  },

  /**
   * Helper to distribute a flat list of vibes images into 3 balanced columns
   */
  distributeVibesIntoColumns(items = [], numCols = 3) {
    if (!Array.isArray(items) || items.length === 0) return vibesGallery;
    if (Array.isArray(items[0])) return items;

    const cols = Array.from({ length: numCols }, () => []);
    const defaultHeights = ['h-slide', 'h-ropes', 'h-cafe'];

    items.forEach((item, idx) => {
      const targetCol = typeof item.col === 'number' && item.col >= 0 && item.col < numCols
        ? item.col
        : idx % numCols;

      const enrichedItem = {
        ...item,
        className: item.className || defaultHeights[Math.floor(idx / numCols) % defaultHeights.length]
      };

      cols[targetCol].push(enrichedItem);
    });

    return cols;
  },

  /**
   * Synchronously get cached destination images (4 images) for instant render
   */
  getCachedUltimateDestinationImages() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.DESTINATION_IMAGES, 
      ultimateDestinationImages
    );
  },

  /**
   * Get 4 Ultimate Destination section images
   */
  async getUltimateDestinationImages(forceRefresh = false) {
    const cached = this.getCachedUltimateDestinationImages();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_destination_override', null);
      const liveItems = await this.fetchLivePageMediaItems('home', 'destination');

      let serverData = ultimateDestinationImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length === 4) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToExplore(liveItems);
        serverData = [...mapped, ...ultimateDestinationImages].slice(0, 4);
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.DESTINATION_IMAGES, 
          serverData, 
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getUltimateDestinationImages fallback:', err);
      return cached;
    }
  },

  /**
   * Update or replace the 4 Ultimate Destination images with server URLs
   */
  async setUltimateDestinationImages(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length !== 4) {
      console.warn('Ultimate Destination expects exactly 4 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.DESTINATION_IMAGES, 
      newImages, 
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_destination_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kids_area_destination_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached PlayZone Vibes images (minimum 9 images)
   */
  getCachedPlayzoneVibes() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.PLAYZONE_VIBES, 
      playzoneVibesImages
    );
  },

  /**
   * Get PlayZone Vibes images (minimum 9 images)
   */
  async getPlayzoneVibes(forceRefresh = false) {
    const cached = this.getCachedPlayzoneVibes();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_vibes_override', null);
      const liveItems = await this.fetchLivePageMediaItems('home', 'vibes');

      let serverData = playzoneVibesImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 9) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToExplore(liveItems);
        serverData = [...mapped, ...playzoneVibesImages];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.PLAYZONE_VIBES, 
          serverData, 
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getPlayzoneVibes fallback:', err);
      return cached;
    }
  },

  /**
   * Update or replace PlayZone Vibes images (minimum 9 images) with server URLs
   */
  async setPlayzoneVibes(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 9) {
      console.warn('PlayZone Vibes expects minimum 9 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.PLAYZONE_VIBES, 
      newImages, 
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_vibes_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kids_area_vibes_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Get photo vibes gallery columns for desktop home (minimum 9 images)
   */
  async getVibesGallery(forceRefresh = false) {
    const vibes = await this.getPlayzoneVibes(forceRefresh);
    return this.distributeVibesIntoColumns(vibes);
  },

  /**
   * Synchronously get cached Kids Area hero banners for instant render
   */
  getCachedKidsHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS,
      kidsAreaHeroBanners
    );
  },

  /**
   * Get Kids Area Hero Banners with caching and server sync
   */
  async getKidsHeroBanners(forceRefresh = false) {
    const cached = this.getCachedKidsHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_hero_override', null);
      const liveItems = await this.fetchLivePageMediaItems('kids-area', 'hero');

      let serverData = kidsAreaHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToSlides(liveItems, 'منطقة الأطفال • Kids Area');
        serverData = [...mapped, ...kidsAreaHeroBanners];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getKidsHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Kids Area hero banners with server URLs
   */
  async setKidsHeroBanners(newSlides, persistAsServer = true) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      throw new Error('Hero banners array must not be empty.');
    }
    await mediaCache.preloadImages(newSlides);
    mediaCache.set(
      MEDIA_CACHE_KEYS.KIDS_HERO_BANNERS,
      newSlides,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_hero_override', newSlides);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kids_area_hero_updated', { detail: newSlides }));
    }
    return newSlides;
  },

  /**
   * Synchronously get cached Explore Kids Area images (minimum 3 images) for instant render
   */
  getCachedExploreKidsArea() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EXPLORE_KIDS_AREA,
      exploreKidsAreaImages
    );
  },

  /**
   * Get Explore Kids Area images
   */
  async getExploreKidsArea(forceRefresh = false) {
    const cached = this.getCachedExploreKidsArea();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_explore_override', null);
      const liveItems = await this.fetchLivePageMediaItems('kids-area', 'explore');

      let serverData = exploreKidsAreaImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 3) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToExplore(liveItems);
        serverData = [...mapped, ...exploreKidsAreaImages];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EXPLORE_KIDS_AREA,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getExploreKidsArea fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Explore Kids Area images (minimum 3 images) with server URLs
   */
  async setExploreKidsArea(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 3) {
      console.warn('Explore Kids Area expects minimum 3 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EXPLORE_KIDS_AREA,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_explore_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kids_area_explore_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached Fun Park hero banners for instant render
   */
  getCachedFunParkHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.FUNPARK_HERO_BANNERS,
      funParkHeroBanners
    );
  },

  /**
   * Get Fun Park Hero Banners with caching and server sync
   */
  async getFunParkHeroBanners(forceRefresh = false) {
    const cached = this.getCachedFunParkHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_funpark_hero_override', null);
      const liveItems = await this.fetchLivePageMediaItems('fun-park', 'hero');

      let serverData = funParkHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToSlides(liveItems, 'فن بارك • Fun Park');
        serverData = [...mapped, ...funParkHeroBanners];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.FUNPARK_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getFunParkHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Fun Park hero banners with server URLs
   */
  async setFunParkHeroBanners(newSlides, persistAsServer = true) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      throw new Error('Hero banners array must not be empty.');
    }
    await mediaCache.preloadImages(newSlides);
    mediaCache.set(
      MEDIA_CACHE_KEYS.FUNPARK_HERO_BANNERS,
      newSlides,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_funpark_hero_override', newSlides);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('funpark_hero_updated', { detail: newSlides }));
    }
    return newSlides;
  },

  /**
   * Synchronously get cached Explore Fun Park images (minimum 3 images) for instant render
   */
  getCachedExploreFunPark() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EXPLORE_FUN_PARK,
      exploreFunParkImages
    );
  },

  /**
   * Get Explore Fun Park images
   */
  async getExploreFunPark(forceRefresh = false) {
    const cached = this.getCachedExploreFunPark();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_funpark_explore_override', null);
      const liveItems = await this.fetchLivePageMediaItems('fun-park', 'explore');

      let serverData = exploreFunParkImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 3) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToExplore(liveItems);
        serverData = [...mapped, ...exploreFunParkImages];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EXPLORE_FUN_PARK,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getExploreFunPark fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Explore Fun Park images with server URLs
   */
  async setExploreFunPark(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 3) {
      console.warn('Explore Fun Park expects minimum 3 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EXPLORE_FUN_PARK,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_funpark_explore_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('funpark_explore_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached Challenge Zone hero banners for instant render
   */
  getCachedChallengeHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.CHALLENGE_HERO_BANNERS,
      challengeHeroBanners
    );
  },

  /**
   * Get Challenge Zone Hero Banners with caching and server sync
   */
  async getChallengeHeroBanners(forceRefresh = false) {
    const cached = this.getCachedChallengeHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_challenge_hero_override', null);
      const liveItems = await this.fetchLivePageMediaItems('challenge', 'hero');

      let serverData = challengeHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToSlides(liveItems, 'منطقة التحدي • Challenge Zone');
        serverData = [...mapped, ...challengeHeroBanners];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.CHALLENGE_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getChallengeHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Challenge Zone hero banners with server URLs
   */
  async setChallengeHeroBanners(newSlides, persistAsServer = true) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      throw new Error('Hero banners array must not be empty.');
    }
    await mediaCache.preloadImages(newSlides);
    mediaCache.set(
      MEDIA_CACHE_KEYS.CHALLENGE_HERO_BANNERS,
      newSlides,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_challenge_hero_override', newSlides);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('challenge_hero_updated', { detail: newSlides }));
    }
    return newSlides;
  },

  /**
   * Synchronously get cached Explore Challenge Zone images for instant render
   */
  getCachedExploreChallenge() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EXPLORE_CHALLENGE,
      exploreChallengeImages
    );
  },

  /**
   * Get Explore Challenge Zone images
   */
  async getExploreChallenge(forceRefresh = false) {
    const cached = this.getCachedExploreChallenge();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_challenge_explore_override', null);
      const liveItems = await this.fetchLivePageMediaItems('challenge', 'explore');

      let serverData = exploreChallengeImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 3) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToExplore(liveItems);
        serverData = [...mapped, ...exploreChallengeImages];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EXPLORE_CHALLENGE,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getExploreChallenge fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Explore Challenge Zone images with server URLs
   */
  async setExploreChallenge(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 3) {
      console.warn('Explore Challenge Zone expects minimum 3 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EXPLORE_CHALLENGE,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_challenge_explore_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('challenge_explore_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached Adventure Zone hero banners for instant render
   */
  getCachedAdventureHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.ADVENTURE_HERO_BANNERS,
      adventureHeroBanners
    );
  },

  /**
   * Get Adventure Zone Hero Banners with caching and server sync
   */
  async getAdventureHeroBanners(forceRefresh = false) {
    const cached = this.getCachedAdventureHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_adventure_hero_override', null);
      const liveItems = await this.fetchLivePageMediaItems('adventure', 'hero');

      let serverData = adventureHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToSlides(liveItems, 'حديقة المغامرة • Adventure Park');
        serverData = [...mapped, ...adventureHeroBanners];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.ADVENTURE_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getAdventureHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Adventure Zone hero banners with server URLs
   */
  async setAdventureHeroBanners(newSlides, persistAsServer = true) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      throw new Error('Hero banners array must not be empty.');
    }
    await mediaCache.preloadImages(newSlides);
    mediaCache.set(
      MEDIA_CACHE_KEYS.ADVENTURE_HERO_BANNERS,
      newSlides,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_adventure_hero_override', newSlides);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adventure_hero_updated', { detail: newSlides }));
    }
    return newSlides;
  },

  /**
   * Synchronously get cached Explore Adventure Zone images for instant render
   */
  getCachedExploreAdventure() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EXPLORE_ADVENTURE,
      exploreAdventureImages
    );
  },

  /**
   * Get Explore Adventure Zone images
   */
  async getExploreAdventure(forceRefresh = false) {
    const cached = this.getCachedExploreAdventure();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_adventure_explore_override', null);
      const liveItems = await this.fetchLivePageMediaItems('adventure', 'explore');

      let serverData = exploreAdventureImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 3) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToExplore(liveItems);
        serverData = [...mapped, ...exploreAdventureImages];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EXPLORE_ADVENTURE,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getExploreAdventure fallback:', err);
      return cached;
    }
  },

  /**
   * Replace Explore Adventure Zone images with server URLs
   */
  async setExploreAdventure(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 3) {
      console.warn('Explore Adventure Zone expects minimum 3 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EXPLORE_ADVENTURE,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_adventure_explore_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adventure_explore_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Synchronously get cached Events & Halls hero banners for zero-flash render
   */
  getCachedEventsHeroBanners() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.EVENTS_HERO_BANNERS,
      eventsHeroBanners
    );
  },

  /**
   * Get EVENTS & HALLS (hero) images
   */
  async getEventsHeroBanners(forceRefresh = false) {
    const cached = this.getCachedEventsHeroBanners();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_events_hero_override', null);
      const liveItems = await this.fetchLivePageMediaItems('events', 'hero');

      let serverData = eventsHeroBanners;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length > 0) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = this.mapLiveItemsToSlides(liveItems, 'الحفلات والمناسبات • Events');
        serverData = [...mapped, ...eventsHeroBanners];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.EVENTS_HERO_BANNERS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getEventsHeroBanners fallback:', err);
      return cached;
    }
  },

  /**
   * Replace EVENTS & HALLS (hero) images with server URLs
   */
  async setEventsHeroBanners(newBanners, persistAsServer = true) {
    if (!Array.isArray(newBanners) || newBanners.length === 0) return [];
    await mediaCache.preloadImages(newBanners);
    mediaCache.set(
      MEDIA_CACHE_KEYS.EVENTS_HERO_BANNERS,
      newBanners,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_events_hero_override', newBanners);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('events_hero_updated', { detail: newBanners }));
    }
    return newBanners;
  },

  /**
   * Synchronously get cached VIBES OF EVENTS images
   */
  getCachedVibesEventsImages() {
    return mediaCache.get(
      MEDIA_CACHE_KEYS.VIBES_EVENTS,
      vibesEventsImages
    );
  },

  /**
   * Get VIBES OF EVENTS images
   */
  async getVibesEventsImages(forceRefresh = false) {
    const cached = this.getCachedVibesEventsImages();

    try {
      const remoteOverride = apiClient.storage.get('kids_area_remote_events_vibes_override', null);
      const liveItems = await this.fetchLivePageMediaItems('events', 'vibes');

      let serverData = vibesEventsImages;
      let isServerSource = false;

      if (remoteOverride && Array.isArray(remoteOverride) && remoteOverride.length >= 6) {
        serverData = remoteOverride;
        isServerSource = true;
      } else if (liveItems.length > 0) {
        const mapped = liveItems.map(it => {
          const imgUrl = resolveImageUrl(Array.isArray(it.images) ? it.images[0] : it.images);
          return {
            id: it._id,
            _id: it._id,
            title: it.name,
            titleAr: it.name,
            titleEn: it.name,
            image: imgUrl,
            src: imgUrl,
            isServerUploaded: true
          };
        });
        serverData = [...mapped, ...vibesEventsImages];
        isServerSource = true;
      }

      if (forceRefresh || mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(
          MEDIA_CACHE_KEYS.VIBES_EVENTS,
          serverData,
          isServerSource ? 'server' : 'mock'
        );
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn('mediaService.getVibesEventsImages fallback:', err);
      return cached;
    }
  },

  /**
   * Replace VIBES OF EVENTS images with server URLs
   */
  async setVibesEventsImages(newImages, persistAsServer = true) {
    if (!Array.isArray(newImages) || newImages.length < 6) {
      console.warn('VIBES OF EVENTS expects minimum 6 images, received:', newImages?.length);
    }
    await mediaCache.preloadImages(newImages);
    mediaCache.set(
      MEDIA_CACHE_KEYS.VIBES_EVENTS,
      newImages,
      persistAsServer ? 'server' : 'mock'
    );
    if (persistAsServer) {
      apiClient.storage.set('kids_area_remote_events_vibes_override', newImages);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('events_vibes_updated', { detail: newImages }));
    }
    return newImages;
  },

  /**
   * Get hero banner slides for a specific zone with caching
   */
  async getHeroBanners(zone = 'kids-area') {
    if (zone === 'kids-area') {
      return this.getKidsHeroBanners();
    }
    if (zone === 'fun-park') {
      return this.getFunParkHeroBanners();
    }
    if (zone === 'challenge') {
      return this.getChallengeHeroBanners();
    }
    if (zone === 'adventure') {
      return this.getAdventureHeroBanners();
    }
    if (zone === 'events') {
      return this.getEventsHeroBanners();
    }

    const cacheKey = `${MEDIA_CACHE_KEYS.HERO_BANNERS}_${zone}`;
    const cached = mediaCache.get(cacheKey, heroBannerSlides[zone] || []);

    try {
      const res = await apiClient.get(`/api/media/banners?zone=${zone}`);
      const serverData = (res && res.success && Array.isArray(res.data) && res.data.length > 0)
        ? res.data
        : (heroBannerSlides[zone] || []);

      if (mediaCache.hasChanged(cached, serverData)) {
        await mediaCache.preloadImages(serverData);
        mediaCache.set(cacheKey, serverData, res?.success ? 'server' : 'mock');
        return serverData;
      }

      return cached;
    } catch (err) {
      console.warn(`mediaService.getHeroBanners fallback for ${zone}:`, err);
      return cached;
    }
  },

  /**
   * Preload an array or collection of images into browser memory
   */
  preloadImages(items) {
    return mediaCache.preloadImages(items);
  },

  /**
   * Clear media cache to force a re-fetch from the server
   */
  clearMediaCache() {
    mediaCache.clearAll();
    apiClient.storage.remove('kids_area_remote_destination_override');
    apiClient.storage.remove('kids_area_remote_vibes_override');
    apiClient.storage.remove('kids_area_remote_hero_override');
    apiClient.storage.remove('kids_area_remote_explore_override');
    apiClient.storage.remove('kids_area_remote_funpark_hero_override');
    apiClient.storage.remove('kids_area_remote_funpark_explore_override');
    apiClient.storage.remove('kids_area_remote_challenge_hero_override');
    apiClient.storage.remove('kids_area_remote_challenge_explore_override');
    apiClient.storage.remove('kids_area_remote_adventure_hero_override');
    apiClient.storage.remove('kids_area_remote_adventure_explore_override');
    apiClient.storage.remove('kids_area_remote_events_hero_override');
    apiClient.storage.remove('kids_area_remote_events_vibes_override');
  }
};

// Global helper for testing / debugging in browser console
if (typeof window !== 'undefined') {
  window.__mediaService = mediaService;
  window.__getPageMedia = getPageMedia;
  window.__getAllPagesMedia = getAllPagesMedia;
  window.__getPageImages = getPageImages;
  window.__PAGE_MEDIA_KEYS = PAGE_MEDIA_KEYS;
  window.__uploadMediaImage = uploadMediaImage;
  window.__deleteMediaImage = deleteMediaImage;
  window.__getMediaByPage = getMediaByPage;
  window.__getMediaBySection = getMediaBySection;
  window.__resolveImageUrl = resolveImageUrl;
}
