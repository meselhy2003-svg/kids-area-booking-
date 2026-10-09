/**
 * useChallengeMedia Hook
 * 
 * Manages Challenge Zone (hero) and (explore challenge zone) image caching,
 * zero-flash synchronous hydration, background revalidation,
 * browser preloading, and server replacement sync.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { mediaService } from '../api/mediaService';

export function useChallengeMedia() {
  // 1. Synchronous hydration from cache (zero loading flicker)
  const [heroBanners, setHeroBanners] = useState(() => 
    mediaService.getCachedChallengeHeroBanners()
  );

  const [exploreItems, setExploreItems] = useState(() => 
    mediaService.getCachedExploreChallenge()
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
  const syncChallengeMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    console.log('🔄 [POLLING TRIGGERED] Initiating sync for Challenge Zone media...');

    try {
      const [freshHero, freshExplore] = await Promise.all([
        mediaService.getChallengeHeroBanners(forceRefresh),
        mediaService.getExploreChallenge(forceRefresh)
      ]);

      // 2. Console log response.data every time polling triggers
      console.log('📦 [Polling response.data] Challenge Hero Banners:', freshHero);
      console.log('📦 [Polling response.data] Challenge Explore Items:', freshExplore);

      // 3. Compare old state with new fetched data and warn if unchanged
      const oldHero = prevHeroRef.current || [];
      const isHeroLengthSame = oldHero.length === (freshHero?.length || 0);
      const isHeroItemsSame = JSON.stringify(oldHero.map(i => i?.image || i?.src || i?.url || i)) === 
                              JSON.stringify((freshHero || []).map(i => i?.image || i?.src || i?.url || i));

      if (isHeroLengthSame && isHeroItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Challenge Hero]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshHero?.length || 0}\n` +
          `• Items:`, freshHero,
          `\n• Diagnostic Note: If an image was recently uploaded to Challenge Zone, the server or mock API is returning static data.`
        );
      } else {
        console.log(`✨ [POLLING UPDATE - Challenge Hero]: New images detected! Prev count: ${oldHero.length} -> New count: ${freshHero?.length}`);
      }

      const oldExplore = prevExploreRef.current || [];
      const isExploreLengthSame = oldExplore.length === (freshExplore?.length || 0);
      const isExploreItemsSame = JSON.stringify(oldExplore.map(i => i?.image || i?.src || i?.url || i)) === 
                                 JSON.stringify((freshExplore || []).map(i => i?.image || i?.src || i?.url || i));

      if (isExploreLengthSame && isExploreItemsSame) {
        console.warn(
          `⚠️ [POLLING WARNING - Challenge Explore]: Fetched data is IDENTICAL to previous state!\n` +
          `• Array length: ${freshExplore?.length || 0}\n` +
          `• Items:`, freshExplore
        );
      } else {
        console.log(`✨ [POLLING UPDATE - Challenge Explore]: New images detected! Prev count: ${oldExplore.length} -> New count: ${freshExplore?.length}`);
      }

      if (Array.isArray(freshHero) && freshHero.length > 0) {
        setHeroBanners(freshHero);
      }

      if (Array.isArray(freshExplore) && freshExplore.length >= 3) {
        setExploreItems(freshExplore);
      }

      setIsServerSynced(true);
    } catch (err) {
      console.warn('[useChallengeMedia] Background sync warning:', err);
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

    window.addEventListener('challenge_hero_updated', handleHeroUpdate);
    window.addEventListener('challenge_explore_updated', handleExploreUpdate);

    return () => {
      window.removeEventListener('challenge_hero_updated', handleHeroUpdate);
      window.removeEventListener('challenge_explore_updated', handleExploreUpdate);
    };
  }, []);

  // 4. Initial preloading & background verification + Polling every 15s
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      mediaService.preloadImages(heroBanners);
      mediaService.preloadImages(exploreItems);
      await syncChallengeMedia(false);
    }

    initialSync();

    const handleWindowFocus = () => {
      syncChallengeMedia(true);
    };
    window.addEventListener('focus', handleWindowFocus);

    const interval = setInterval(() => {
      syncChallengeMedia(false);
    }, 5000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(interval);
    };
  }, [syncChallengeMedia]);

  const currentHero = heroBanners[activeSlide] || heroBanners[0];

  const refreshCache = useCallback(() => {
    mediaService.clearMediaCache();
    return syncChallengeMedia(true);
  }, [syncChallengeMedia]);

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
