/**
 * useFunParkMedia Hook
 * 
 * Manages Fun Park hero banners and explore images with:
 * 1. Synchronous hydration from cache (zero flicker).
 * 2. Background polling every 5000ms using ONLY the exact routes:
 *    - /api/media/page/fun-park
 *    - /api/media/section/hero
 *    - /api/media/section/explore
 * 3. Zero redundant URL variations (no funpark, funzone, funZone).
 * 4. Image preloading and seamless state updates.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/apiClient';
import { mediaService, isValidImageFilename } from '../api/mediaService';
import { funParkHeroBanners, exploreFunParkImages } from '../data/mock/media.mock';

/**
 * Extracts normalized image candidates from an API response.
 * Handles arrays of string filenames ["img.jpg"], objects [{ images: [...] }],
 * and nested envelope structures { success: true, data: [...] }.
 */
function extractValidItems(res) {
  if (!res || !res.data) return [];
  const raw = res.data?.data !== undefined ? res.data.data : res.data;
  const list = Array.isArray(raw) ? raw : (raw?.images || raw?.data || raw?.files || []);
  if (!Array.isArray(list)) return [];

  const items = [];
  list.forEach((item, idx) => {
    if (typeof item === 'string') {
      if (isValidImageFilename(item)) {
        const url = mediaService.resolveImageUrl(item);
        items.push({
          id: `item-${idx}`,
          filename: item,
          name: item.split('/').pop(),
          url,
          image: url,
          src: url
        });
      }
    } else if (item && typeof item === 'object') {
      const imgSources = Array.isArray(item.images)
        ? item.images
        : [item.image || item.url || item.filename || item.src];

      imgSources.filter(isValidImageFilename).forEach((fn, fIdx) => {
        const url = mediaService.resolveImageUrl(fn);
        items.push({
          id: item._id ? `${item._id}-${fIdx}` : `item-${idx}-${fIdx}`,
          _id: item._id,
          filename: fn,
          name: item.name || item.title || fn.split('/').pop(),
          url,
          image: url,
          src: url,
          section: (item.section || '').toLowerCase(),
          page: (item.page || '').toLowerCase()
        });
      });
    }
  });

  return items;
}

/**
 * Converts extracted items to hero slide objects
 */
function formatToHeroSlides(items, fallbackList) {
  if (!items || items.length === 0) return fallbackList;

  const slides = items.map((it, idx) => ({
    id: it.id || `funpark-hero-${idx}`,
    _id: it._id,
    title: it.name || 'American Dream Fun Park',
    titleAr: 'فن بارك • Fun Park',
    titleEn: 'Fun Park',
    subtitle: 'فن بارك • Fun Park',
    subtitleAr: 'فن بارك • Fun Park',
    subtitleEn: 'Fun Park',
    image: it.url,
    src: it.url,
    badge: 'Live',
    badgeAr: 'مرفوع',
    badgeEn: 'Live',
    isServerUploaded: true
  }));

  return slides.length > 0 ? slides : fallbackList;
}

/**
 * Converts extracted items to explore attraction cards
 */
function formatToExploreCards(items, fallbackList) {
  if (!items || items.length === 0) return fallbackList;

  const cards = items.map((it, idx) => ({
    id: it.id || `funpark-explore-${idx}`,
    _id: it._id,
    title: it.name || `Attraction ${idx + 1}`,
    titleAr: it.name || `معلم ترفيهي ${idx + 1}`,
    titleEn: it.name || `Attraction ${idx + 1}`,
    image: it.url,
    src: it.url,
    isServerUploaded: true
  }));

  // If fewer than 3 images uploaded, merge with defaults to maintain layout stability
  return cards.length >= 3 ? cards : [...cards, ...fallbackList].slice(0, 6);
}

export function useFunParkMedia() {
  // 1. Synchronous hydration from cache (zero loading flicker)
  const [heroBanners, setHeroBanners] = useState(() => 
    mediaService.getCachedFunParkHeroBanners()
  );

  const [exploreItems, setExploreItems] = useState(() => 
    mediaService.getCachedExploreFunPark()
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerSynced, setIsServerSynced] = useState(false);

  // References to previous state for comparison
  const prevHeroRef = useRef(heroBanners);
  const prevExploreRef = useRef(exploreItems);

  useEffect(() => {
    prevHeroRef.current = heroBanners;
  }, [heroBanners]);

  useEffect(() => {
    prevExploreRef.current = exploreItems;
  }, [exploreItems]);

  // 2. Synchronize Fun Park media using ONLY the 3 exact routes
  const syncFunParkMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    console.log('🔄 [POLLING TRIGGERED] Initiating sync for Fun Park media...');
    console.log('📡 [Exact Routes]: GET /api/media/page/fun-park, GET /api/media/section/hero, GET /api/media/section/explore');

    try {
      // ONLY request the exact 3 correct routes concurrently
      const [pageRes, heroRes, exploreRes] = await Promise.allSettled([
        apiClient.get('/api/media/page/fun-park'),
        apiClient.get('/api/media/section/hero'),
        apiClient.get('/api/media/section/explore')
      ]);

      const pageItems = pageRes.status === 'fulfilled' ? extractValidItems(pageRes.value) : [];
      const heroItems = heroRes.status === 'fulfilled' ? extractValidItems(heroRes.value) : [];
      const exploreItemsRaw = exploreRes.status === 'fulfilled' ? extractValidItems(exploreRes.value) : [];

      // Combine section-specific items with page items tagged for that section
      const combinedHeroPool = [
        ...heroItems,
        ...pageItems.filter(p => p.section === 'hero' || (!p.section && heroItems.length === 0))
      ];

      const combinedExplorePool = [
        ...exploreItemsRaw,
        ...pageItems.filter(p => p.section === 'explore' || p.section === 'games')
      ];

      // Format into slides and explore cards
      const freshHero = formatToHeroSlides(combinedHeroPool, funParkHeroBanners);
      const freshExplore = formatToExploreCards(combinedExplorePool, exploreFunParkImages);

      // Log response.data every polling cycle
      console.log('📦 [Polling response.data] Fun Park Hero Banners:', freshHero);
      console.log('📦 [Polling response.data] Fun Park Explore Items:', freshExplore);

      // Compare previous state with newly fetched data to detect changes
      const oldHero = prevHeroRef.current || [];
      const isHeroLengthSame = oldHero.length === (freshHero?.length || 0);
      const isHeroItemsSame = JSON.stringify(oldHero.map(i => i?.image || i?.src || i?.url || i)) === 
                              JSON.stringify((freshHero || []).map(i => i?.image || i?.src || i?.url || i));

      if (oldHero.length > 0 && isHeroLengthSame && isHeroItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Fun Park Hero]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshHero?.length || 0}\n` +
          `• Items:`, freshHero,
          `\n• Diagnostic Note: If an image was recently uploaded, the server may be returning static data.`
        );
      } else if (freshHero?.length > 0) {
        console.log(`✨ [POLLING UPDATE - Fun Park Hero]: Prev count: ${oldHero.length} -> New count: ${freshHero?.length}`);
      }

      const oldExplore = prevExploreRef.current || [];
      const isExploreLengthSame = oldExplore.length === (freshExplore?.length || 0);
      const isExploreItemsSame = JSON.stringify(oldExplore.map(i => i?.image || i?.src || i?.url || i)) === 
                                 JSON.stringify((freshExplore || []).map(i => i?.image || i?.src || i?.url || i));

      if (oldExplore.length > 0 && isExploreLengthSame && isExploreItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Fun Park Explore]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshExplore?.length || 0}\n` +
          `• Items:`, freshExplore
        );
      } else if (freshExplore?.length > 0) {
        console.log(`✨ [POLLING UPDATE - Fun Park Explore]: Prev count: ${oldExplore.length} -> New count: ${freshExplore?.length}`);
      }

      if (Array.isArray(freshHero) && freshHero.length > 0) {
        setHeroBanners(freshHero);
        mediaService.preloadImages(freshHero);
      }

      if (Array.isArray(freshExplore) && freshExplore.length > 0) {
        setExploreItems(freshExplore);
        mediaService.preloadImages(freshExplore);
      }

      setIsServerSynced(true);
    } catch (err) {
      console.warn('[useFunParkMedia] Background sync warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Listen for immediate window updates from admin uploads
  useEffect(() => {
    const handleHeroUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setHeroBanners(e.detail);
      }
    };

    const handleExploreUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length >= 3) {
        setExploreItems(e.detail);
      }
    };

    window.addEventListener('funpark_hero_updated', handleHeroUpdate);
    window.addEventListener('funpark_explore_updated', handleExploreUpdate);

    return () => {
      window.removeEventListener('funpark_hero_updated', handleHeroUpdate);
      window.removeEventListener('funpark_explore_updated', handleExploreUpdate);
    };
  }, []);

  // 4. Initial sync & 5000ms background polling interval
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      mediaService.preloadImages(heroBanners);
      mediaService.preloadImages(exploreItems);
      if (isMounted) {
        await syncFunParkMedia(false);
      }
    }

    initialSync();

    // Revalidate when user returns to window tab
    const handleWindowFocus = () => {
      syncFunParkMedia(true);
    };
    window.addEventListener('focus', handleWindowFocus);

    // 5-second polling interval
    const interval = setInterval(() => {
      if (isMounted) {
        syncFunParkMedia(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(interval);
    };
  }, [syncFunParkMedia]);

  const currentHero = heroBanners[activeSlide] || heroBanners[0];

  const refreshCache = useCallback(() => {
    mediaService.clearMediaCache();
    return syncFunParkMedia(true);
  }, [syncFunParkMedia]);

  return {
    heroBanners,
    exploreItems,
    activeSlide,
    setActiveSlide,
    currentHero,
    isLoading,
    isServerSynced,
    refreshCache
  };
}
