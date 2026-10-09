/**
 * useAdventureMedia Hook
 * 
 * Manages Adventure Zone (hero) and (explore adventure zone) image caching,
 * zero-flash synchronous hydration, background revalidation,
 * browser preloading, and server replacement sync.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { mediaService } from '../api/mediaService';

export function useAdventureMedia() {
  // 1. Synchronous hydration from cache (zero loading flicker)
  const [heroBanners, setHeroBanners] = useState(() => 
    mediaService.getCachedAdventureHeroBanners()
  );

  const [exploreItems, setExploreItems] = useState(() => 
    mediaService.getCachedExploreAdventure()
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
  const syncAdventureMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    console.log('🔄 [POLLING TRIGGERED] Initiating sync for Adventure Zone media...');

    try {
      const [freshHero, freshExplore] = await Promise.all([
        mediaService.getAdventureHeroBanners(forceRefresh),
        mediaService.getExploreAdventure(forceRefresh)
      ]);

      // 2. Console log response.data every time polling triggers
      console.log('📦 [Polling response.data] Adventure Hero Banners:', freshHero);
      console.log('📦 [Polling response.data] Adventure Explore Items:', freshExplore);

      // 3. Compare old state with new fetched data and warn if unchanged
      const oldHero = prevHeroRef.current || [];
      const isHeroLengthSame = oldHero.length === (freshHero?.length || 0);
      const isHeroItemsSame = JSON.stringify(oldHero.map(i => i?.image || i?.src || i?.url || i)) === 
                              JSON.stringify((freshHero || []).map(i => i?.image || i?.src || i?.url || i));

      if (isHeroLengthSame && isHeroItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Adventure Hero]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshHero?.length || 0}\n` +
          `• Items:`, freshHero,
          `\n• Diagnostic Note: If an image was recently uploaded to Adventure Zone, the server or mock API is returning static data.`
        );
      } else {
        console.log(`✨ [POLLING UPDATE - Adventure Hero]: New images detected! Prev count: ${oldHero.length} -> New count: ${freshHero?.length}`);
      }

      const oldExplore = prevExploreRef.current || [];
      const isExploreLengthSame = oldExplore.length === (freshExplore?.length || 0);
      const isExploreItemsSame = JSON.stringify(oldExplore.map(i => i?.image || i?.src || i?.url || i)) === 
                                 JSON.stringify((freshExplore || []).map(i => i?.image || i?.src || i?.url || i));

      if (isExploreLengthSame && isExploreItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Adventure Explore]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshExplore?.length || 0}\n` +
          `• Items:`, freshExplore
        );
      } else {
        console.log(`✨ [POLLING UPDATE - Adventure Explore]: New images detected! Prev count: ${oldExplore.length} -> New count: ${freshExplore?.length}`);
      }

      if (Array.isArray(freshHero) && freshHero.length > 0) {
        setHeroBanners(freshHero);
      }

      if (Array.isArray(freshExplore) && freshExplore.length >= 3) {
        setExploreItems(freshExplore);
      }

      setIsServerSynced(true);
    } catch (err) {
      console.warn('[useAdventureMedia] Background sync warning:', err);
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

    window.addEventListener('adventure_hero_updated', handleHeroUpdate);
    window.addEventListener('adventure_explore_updated', handleExploreUpdate);

    return () => {
      window.removeEventListener('adventure_hero_updated', handleHeroUpdate);
      window.removeEventListener('adventure_explore_updated', handleExploreUpdate);
    };
  }, []);

  // 4. Initial preloading & background verification + Polling every 15s
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      mediaService.preloadImages(heroBanners);
      mediaService.preloadImages(exploreItems);
      await syncAdventureMedia(false);
    }

    initialSync();

    const handleWindowFocus = () => {
      syncAdventureMedia(true);
    };
    window.addEventListener('focus', handleWindowFocus);

    const interval = setInterval(() => {
      syncAdventureMedia(false);
    }, 5000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(interval);
    };
  }, [syncAdventureMedia]);

  const currentHero = heroBanners[activeSlide] || heroBanners[0];

  const refreshCache = useCallback(() => {
    mediaService.clearMediaCache();
    return syncAdventureMedia(true);
  }, [syncAdventureMedia]);

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
