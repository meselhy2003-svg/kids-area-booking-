/**
 * useFunParkMedia Hook
 * 
 * Manages Fun Park (hero) and (explore fun park) image caching,
 * zero-flash synchronous hydration, background revalidation,
 * browser preloading, and server replacement sync.
 */

import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '../api/mediaService';

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

  // 2. Background synchronization with server
  const syncFunParkMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const [freshHero, freshExplore] = await Promise.all([
        mediaService.getFunParkHeroBanners(forceRefresh),
        mediaService.getExploreFunPark(forceRefresh)
      ]);

      if (Array.isArray(freshHero) && freshHero.length > 0) {
        setHeroBanners(freshHero);
      }

      if (Array.isArray(freshExplore) && freshExplore.length >= 3) {
        setExploreItems(freshExplore);
      }

      setIsServerSynced(true);
    } catch (err) {
      console.warn('[useFunParkMedia] Background sync warning:', err);
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

    window.addEventListener('funpark_hero_updated', handleHeroUpdate);
    window.addEventListener('funpark_explore_updated', handleExploreUpdate);

    return () => {
      window.removeEventListener('funpark_hero_updated', handleHeroUpdate);
      window.removeEventListener('funpark_explore_updated', handleExploreUpdate);
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
      await syncFunParkMedia(false);
    }

    initialSync();

    // Revalidate when user switches tabs or returns to window (e.g. from Apidog)
    const handleWindowFocus = () => {
      syncFunParkMedia(true);
    };
    window.addEventListener('focus', handleWindowFocus);

    // Background polling every 15 seconds to catch remote uploads from Apidog
    const interval = setInterval(() => {
      syncFunParkMedia(false);
    }, 15000);

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
