/**
 * useEventsMedia Hook
 * 
 * Manages EVENTS & HALLS (hero) and (VIBES OF EVENTS) image caching,
 * zero-flash synchronous hydration, background revalidation,
 * browser preloading, and server replacement sync.
 */

import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '../api/mediaService';

export function useEventsMedia() {
  // 1. Synchronous hydration from cache (zero loading flicker)
  const [heroSlides, setHeroSlides] = useState(() => 
    mediaService.getCachedEventsHeroBanners()
  );

  const [vibeItems, setVibeItems] = useState(() => 
    mediaService.getCachedVibesEventsImages()
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerSynced, setIsServerSynced] = useState(false);

  // 2. Background synchronization with server
  const syncEventsMedia = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const [freshHero, freshVibes] = await Promise.all([
        mediaService.getEventsHeroBanners(forceRefresh),
        mediaService.getVibesEventsImages(forceRefresh)
      ]);

      if (Array.isArray(freshHero) && freshHero.length > 0) {
        setHeroSlides(freshHero);
      }

      if (Array.isArray(freshVibes) && freshVibes.length >= 6) {
        setVibeItems(freshVibes);
      }

      setIsServerSynced(true);
    } catch (err) {
      console.warn('[useEventsMedia] Background sync warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Listen for dynamic server updates & reactive cache changes
  useEffect(() => {
    const handleHeroUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setHeroSlides(e.detail);
      }
    };

    const handleVibesUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length >= 6) {
        setVibeItems(e.detail);
      }
    };

    window.addEventListener('events_hero_updated', handleHeroUpdate);
    window.addEventListener('events_vibes_updated', handleVibesUpdate);

    return () => {
      window.removeEventListener('events_hero_updated', handleHeroUpdate);
      window.removeEventListener('events_vibes_updated', handleVibesUpdate);
    };
  }, []);

  // 4. Initial preloading & background verification
  useEffect(() => {
    let isMounted = true;

    async function initialSync() {
      // Preload current cached images for optimal performance
      mediaService.preloadImages(heroSlides);
      mediaService.preloadImages(vibeItems);

      // Perform background sync with server
      await syncEventsMedia(false);
    }

    initialSync();

    return () => {
      isMounted = false;
    };
  }, []);

  // 5. Auto-advance hero carousel every 6 seconds
  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides?.length]);

  const currentHero = heroSlides[currentSlide] || heroSlides[0];

  const refreshCache = useCallback(() => {
    mediaService.clearMediaCache();
    return syncEventsMedia(true);
  }, [syncEventsMedia]);

  return {
    heroSlides,
    vibeItems,
    currentSlide,
    setCurrentSlide,
    currentHero,
    isLoading,
    isServerSynced,
    refreshCache
  };
}
