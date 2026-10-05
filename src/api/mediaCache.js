/**
 * Media Cache & Asset Synchronization Manager
 * 
 * Provides:
 * 1. Persistent localStorage caching with fallback for offline & instant load.
 * 2. Stale-While-Revalidate caching pattern until remote server replaces images.
 * 3. Browser memory preloading & CacheStorage API caching to prevent UI flicker.
 * 4. Automatic fallback handling for broken or pending remote URLs.
 * 5. Event-based reactive notifications on cache updates.
 */

export const MEDIA_CACHE_KEYS = {
  DESTINATION_IMAGES: 'kids_area_cache_destination_v1',
  PLAYZONE_VIBES: 'kids_area_cache_vibes_v1',
  HERO_BANNERS: 'kids_area_cache_banners_v1',
  KIDS_HERO_BANNERS: 'kids_area_cache_hero_kids_v1',
  EXPLORE_KIDS_AREA: 'kids_area_cache_explore_kids_v1',
  FUNPARK_HERO_BANNERS: 'kids_area_cache_hero_funpark_v1',
  EXPLORE_FUN_PARK: 'kids_area_cache_explore_funpark_v1',
  CHALLENGE_HERO_BANNERS: 'kids_area_cache_hero_challenge_v1',
  EXPLORE_CHALLENGE: 'kids_area_cache_explore_challenge_v1',
  ADVENTURE_HERO_BANNERS: 'kids_area_cache_hero_adventure_v1',
  EXPLORE_ADVENTURE: 'kids_area_cache_explore_adventure_v1',
  EVENTS_HERO_BANNERS: 'kids_area_cache_hero_events_v1',
  VIBES_EVENTS: 'kids_area_cache_vibes_events_v1',
  PAGE_MEDIA_PREFIX: 'kids_area_cache_page_media_v1_'
};

export const mediaCache = {
  /**
   * Synchronously retrieve cached media (arrays or objects) or return fallback
   */
  get(key, fallback = null) {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data !== undefined && parsed.data !== null) {
        if (Array.isArray(parsed.data)) {
          return parsed.data.length > 0 ? parsed.data : fallback;
        }
        if (typeof parsed.data === 'object') {
          return Object.keys(parsed.data).length > 0 ? parsed.data : fallback;
        }
        return parsed.data;
      }
      return fallback;
    } catch (e) {
      console.warn(`[MediaCache] Error reading key "${key}":`, e);
      return fallback;
    }
  },

  /**
   * Get cache metadata (timestamp, source, version)
   */
  getMeta(key) {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        timestamp: parsed.timestamp,
        source: parsed.source,
        version: parsed.version
      };
    } catch {
      return null;
    }
  },

  /**
   * Save media data to persistent cache and notify listeners
   */
  set(key, data, source = 'cache') {
    if (typeof window === 'undefined' || data === undefined || data === null) return;
    try {
      const payload = {
        data,
        source, // 'mock' | 'server' | 'cache'
        timestamp: Date.now(),
        version: '1.0'
      };
      localStorage.setItem(key, JSON.stringify(payload));

      // Dispatch global update event
      window.dispatchEvent(new CustomEvent('kids_area_media_updated', {
        detail: { key, data, source }
      }));
    } catch (e) {
      console.warn(`[MediaCache] Error saving key "${key}":`, e);
    }
  },

  /**
   * Remove a single cache key
   */
  remove(key) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[MediaCache] Error removing key "${key}":`, e);
    }
  },

  /**
   * Clear all media cache keys
   */
  clearAll() {
    Object.values(MEDIA_CACHE_KEYS).forEach(k => mediaCache.remove(k));
    // Also remove any page media keys starting with prefix
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(MEDIA_CACHE_KEYS.PAGE_MEDIA_PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } catch (e) {
        console.warn('[MediaCache] Error clearing page media prefix keys:', e);
      }
    }
  },

  /**
   * Detect if new server data differs from existing cached data
   */
  hasChanged(cachedData, newData) {
    if (!cachedData || !newData) return true;
    try {
      return JSON.stringify(cachedData) !== JSON.stringify(newData);
    } catch {
      return true;
    }
  },

  /**
   * Preload an array or collection of image items into browser memory & Cache API
   * Supports objects with .src, .image, .img, or .url, or plain string URLs
   */
  preloadImages(items = []) {
    if (typeof window === 'undefined' || !items) return Promise.resolve([]);

    let flatItems = [];
    if (Array.isArray(items)) {
      flatItems = items.flat(Infinity);
    } else if (typeof items === 'object') {
      flatItems = Object.values(items).flatMap(val => 
        Array.isArray(val) ? val.flat(Infinity) : [val]
      );
    } else {
      flatItems = [items];
    }

    const promises = flatItems.map((item) => {
      const url = typeof item === 'string' 
        ? item 
        : (item?.src || item?.image || item?.img || item?.url);
      if (!url) return Promise.resolve({ url: null, success: false });

      // Cache in CacheStorage API if available
      if ('caches' in window && !url.startsWith('data:')) {
        try {
          caches.open('kids-area-media-cache-v1').then(cache => {
            fetch(url, { mode: 'no-cors' })
              .then(res => cache.put(url, res))
              .catch(() => {});
          }).catch(() => {});
        } catch {
          // ignore cache api restrictions
        }
      }

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ url, success: true });
        img.onerror = () => {
          // If server URL fails, try to preload fallback if present
          if (typeof item === 'object' && (item?.fallbackSrc || item?.fallbackImg || item?.fallback)) {
            const fallbackUrl = item.fallbackSrc || item.fallbackImg || item.fallback;
            const fallbackImg = new Image();
            fallbackImg.onload = () => resolve({ url: fallbackUrl, success: true });
            fallbackImg.onerror = () => resolve({ url, success: false });
            fallbackImg.src = fallbackUrl;
          } else {
            resolve({ url, success: false });
          }
        };
        img.src = url;
      });
    });

    return Promise.all(promises);
  }
};
