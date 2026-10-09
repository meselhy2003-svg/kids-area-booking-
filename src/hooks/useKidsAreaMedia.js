/**
 * useKidsAreaMedia Hook
 * 
 * Manages Kids Area (hero) and (explore kids area) image caching,
 * zero-flash synchronous hydration, background revalidation,
 * browser preloading, and server replacement sync.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { mediaService } from '../api/mediaService';

export function useKidsAreaMedia() {
  // 1. Synchronous hydration from cache (zero loading flicker)
  const [heroBanners, setHeroBanners] = useState(() => 
    mediaService.getCachedKidsHeroBanners()
  );

  const [exploreItems, setExploreItems] = useState(() => 
    mediaService.getCachedExploreKidsArea()
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

  // 2. Background synchronization with server
  const syncKidsMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    console.log('🔄 [POLLING TRIGGERED] Initiating sync for Kids Area media...');

    try {
      const [freshHero, freshExplore] = await Promise.all([
        mediaService.getKidsHeroBanners(forceRefresh),
        mediaService.getExploreKidsArea(forceRefresh)
      ]);

      // 2. Console log response.data every time polling triggers
      console.log('📦 [Polling response.data] Kids Area Hero Banners:', freshHero);
      console.log('📦 [Polling response.data] Kids Area Explore Items:', freshExplore);

      // 3. Compare old state with new fetched data and warn if unchanged
      const oldHero = prevHeroRef.current || [];
      const isHeroLengthSame = oldHero.length === (freshHero?.length || 0);
      const isHeroItemsSame = JSON.stringify(oldHero.map(i => i?.image || i?.src || i?.url || i)) === 
                              JSON.stringify((freshHero || []).map(i => i?.image || i?.src || i?.url || i));

      if (isHeroLengthSame && isHeroItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Kids Area Hero]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshHero?.length || 0}\n` +
          `• Items:`, freshHero,
          `\n• Diagnostic Note: If you just uploaded an image in the admin dashboard, the backend or mock API is returning static data, or the section/page name in the upload doesn't match this endpoint.`
        );
      } else {
        console.log(`✨ [POLLING UPDATE - Kids Area Hero]: New images detected! Previous count: ${oldHero.length} -> New count: ${freshHero?.length}`);
      }

      const oldExplore = prevExploreRef.current || [];
      const isExploreLengthSame = oldExplore.length === (freshExplore?.length || 0);
      const isExploreItemsSame = JSON.stringify(oldExplore.map(i => i?.image || i?.src || i?.url || i)) === 
                                 JSON.stringify((freshExplore || []).map(i => i?.image || i?.src || i?.url || i));

      if (isExploreLengthSame && isExploreItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Kids Area Explore]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshExplore?.length || 0}\n` +
          `• Items:`, freshExplore,
          `\n• Diagnostic Note: If you just uploaded an image to the Explore section, the backend is returning unchanged static data.`
        );
      } else {
        console.log(`✨ [POLLING UPDATE - Kids Area Explore]: New images detected! Previous count: ${oldExplore.length} -> New count: ${freshExplore?.length}`);
      }

      if (Array.isArray(freshHero) && freshHero.length > 0) {
        setHeroBanners(freshHero);
      }

      if (Array.isArray(freshExplore) && freshExplore.length >= 3) {
        setExploreItems(freshExplore);
      }

      setIsServerSynced(true);
    } catch (err) {
      console.warn('[useKidsAreaMedia] Background sync warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Listen for dynamic server updates & reactive cache changes
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

    window.addEventListener('kids_area_hero_updated', handleHeroUpdate);
    window.addEventListener('kids_area_explore_updated', handleExploreUpdate);

    return () => {
      window.removeEventListener('kids_area_hero_updated', handleHeroUpdate);
      window.removeEventListener('kids_area_explore_updated', handleExploreUpdate);
    };
  }, []);

  // 4. Initial preloading & background verification + Auto-sync on window focus
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      // Preload current cached images for optimal performance
      mediaService.preloadImages(heroBanners);
      mediaService.preloadImages(exploreItems);

      // Perform background sync with server
      await syncKidsMedia(false);
    }

    initialSync();

    // Revalidate when user switches tabs or returns to window (e.g. from Apidog)
    const handleWindowFocus = () => {
      syncKidsMedia(true);
    };
    window.addEventListener('focus', handleWindowFocus);

    // Background polling every 5 seconds to catch remote uploads
    const interval = setInterval(() => {
      syncKidsMedia(false);
    }, 5000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(interval);
    };
  }, [syncKidsMedia]);

  const currentHero = heroBanners[activeSlide] || heroBanners[0];

  const refreshCache = useCallback(() => {
    mediaService.clearMediaCache();
    return syncKidsMedia(true);
  }, [syncKidsMedia]);

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
