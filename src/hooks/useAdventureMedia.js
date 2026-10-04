/**
 * useAdventureMedia Hook
 * 
 * Manages Adventure Zone (hero) and (explore adventure zone) image caching,
 * zero-flash synchronous hydration, background revalidation,
 * browser preloading, and server replacement sync.
 */

import { useState, useEffect, useCallback } from 'react';
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

  // 2. Background synchronization with server
  const syncAdventureMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const [freshHero, freshExplore] = await Promise.all([
        mediaService.getAdventureHeroBanners(forceRefresh),
        mediaService.getExploreAdventure(forceRefresh)
      ]);

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

  // 4. Initial preloading & background verification
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      // Preload current cached images for optimal performance
      mediaService.preloadImages(heroBanners);
      mediaService.preloadImages(exploreItems);

      // Perform background sync with server
      await syncAdventureMedia(false);
    }

    initialSync();

    return () => {
      isMounted = false;
    };
  }, []);

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
