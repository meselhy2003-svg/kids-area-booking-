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
  VIBES_EVENTS: 'kids_area_cache_vibes_events_v1'
};

export const mediaCache = {
  /**
   * Synchronously retrieve cached images or return fallback
   */
  get(key, fallback = null) {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
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
   * Save images to persistent cache and notify listeners
   */
  set(key, data, source = 'cache') {
    if (typeof window === 'undefined' || !Array.isArray(data)) return;
    try {
      const payload = {
        data,
        source, // 'mock' | 'server'
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
  },

  /**
   * Detect if new server data differs from existing cached data
   */
  hasChanged(cachedData, newData) {
    if (!cachedData || !newData) return true;
    if (cachedData.length !== newData.length) return true;
    try {
      return JSON.stringify(cachedData) !== JSON.stringify(newData);
    } catch {
      return true;
    }
  },

  /**
   * Preload an array of image items into browser memory & Cache API
   * Supports objects with .src or .url, or plain string URLs
   */
  preloadImages(items = []) {
    if (typeof window === 'undefined' || !Array.isArray(items)) return Promise.resolve([]);

    const promises = items.map((item) => {
      const url = typeof item === 'string' ? item : (item?.src || item?.url);
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
          if (typeof item === 'object' && item?.fallbackSrc) {
            const fallbackImg = new Image();
            fallbackImg.onload = () => resolve({ url: item.fallbackSrc, success: true });
            fallbackImg.onerror = () => resolve({ url, success: false });
            fallbackImg.src = item.fallbackSrc;
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
